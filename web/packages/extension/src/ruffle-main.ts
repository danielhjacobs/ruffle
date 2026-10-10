import { PublicAPI } from "ruffle-core/dist/public/setup/public-api.js";
import { buildInfo } from "ruffle-core/dist/build-info.js";
import type { SourceAPI } from "ruffle-core/dist/public/setup/source-api.js";
import type { PlayerElement, ReadyState } from "ruffle-core/dist/public/player/index.js";

const CHANNEL = "ruffle-extension-core-bridge-v1";
const PLAYER_ID = "data-ruffle-extension-player";
let sequence = Math.floor(Math.random() * 0x7fffffff);
let contentMessageId: number | null = null;
let coreReady = false;
let publicAPI: PublicAPI;

type Reply = { channel: string; direction: "isolated"; requestId: number; success: boolean; skipped?: boolean; error?: string };
type PlayerState = {
    element: HTMLElement;
    id: string;
    config: Record<string, unknown>;
    configWasSet: boolean;
    onFSCommand: ((command: string, args: string) => void) | null;
    onFSCommandWasSet: boolean;
    traceObserver: ((message: string) => void) | null;
    traceObserverWasSet: boolean;
};
const pending = new Map<number, { resolve(reply: Reply): void; reject(error: Error): void }>();
const states = new WeakMap<HTMLElement, PlayerState>();
let playerCounter = 0;

function serializable(value: unknown, seen = new WeakSet<object>()): unknown {
    if (value === null || ["string", "number", "boolean"].includes(typeof value)) return value;
    if (value === undefined || typeof value === "function" || typeof value === "symbol") return undefined;
    if (value instanceof URL) return value.href;
    if (typeof value !== "object" || seen.has(value)) return undefined;
    seen.add(value);
    if (Array.isArray(value)) return value.map((item) => serializable(item, seen));
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
        const safe = serializable(item, seen);
        if (safe !== undefined) result[key] = safe;
    }
    return result;
}

function ensureCore(force: boolean): Promise<Reply> {
    const requestId = ++sequence;
    const promise = new Promise<Reply>((resolve, reject) => pending.set(requestId, { resolve, reject }));
    window.postMessage({
        channel: CHANNEL,
        direction: "main",
        requestId,
        command: "ensure-core",
        force,
        config: serializable(window.RufflePlayer?.config) ?? {},
    }, "*");
    window.setTimeout(() => {
        const request = pending.get(requestId);
        if (request) {
            pending.delete(requestId);
            request.reject(new Error("The isolated Ruffle controller did not respond."));
        }
    }, 15000);
    return promise;
}

function descriptor(element: object, name: PropertyKey): PropertyDescriptor | undefined {
    let proto = Object.getPrototypeOf(element) as object | null;
    while (proto) {
        const found = Object.getOwnPropertyDescriptor(proto, name);
        if (found) return found;
        proto = Object.getPrototypeOf(proto) as object | null;
    }
    return undefined;
}
function hasCore(element: HTMLElement): boolean {
    return typeof descriptor(element, "load")?.value === "function" &&
        typeof descriptor(element, "ruffle")?.value === "function";
}
function getCoreValue(state: PlayerState, name: string, fallback: () => unknown): unknown {
    const desc = descriptor(state.element, name);
    if (desc?.get) {
        try { return desc.get.call(state.element); } catch { /* use fallback */ }
    }
    if (desc && "value" in desc) return desc.value;
    return fallback();
}
function applyPlayerState(state: PlayerState): void {
    if (!hasCore(state.element)) return;
    if (state.configWasSet) descriptor(state.element, "config")?.set?.call(state.element, state.config);
    if (state.onFSCommandWasSet) descriptor(state.element, "onFSCommand")?.set?.call(state.element, state.onFSCommand);
    if (state.traceObserverWasSet) descriptor(state.element, "traceObserver")?.set?.call(state.element, state.traceObserver);
}
async function invoke(state: PlayerState, method: string, args: unknown[] = []): Promise<unknown> {
    const result = await ensureCore(true);
    if (!result.success) throw new Error(result.error || "Ruffle could not be initialized.");
    applyPlayerState(state);
    const desc = descriptor(state.element, method);
    if (typeof desc?.value !== "function") throw new Error("Ruffle player method unavailable: " + method);
    return desc.value.apply(state.element, args);
}
function setCoreValue(state: PlayerState, name: string, value: unknown, save: () => void): void {
    save();
    const setter = descriptor(state.element, name)?.set;
    if (setter) {
        try { setter.call(state.element, value); return; } catch { /* not upgraded yet */ }
    }
    void ensureCore(true).then((result) => {
        if (result.success) {
            applyPlayerState(state);
            descriptor(state.element, name)?.set?.call(state.element, value);
        }
    }).catch((error: unknown) => console.warn("Unable to set Ruffle player property:", error));
}
function nextPlayerTagName(): string {
    let suffix = 0;
    for (;;) {
        const name = suffix === 0 ? "ruffle-player" : "ruffle-player-" + suffix;
        if (!customElements.get(name)) return name;
        suffix++;
    }
}

function decoratePlayer(element: HTMLElement): PlayerState {
    const old = states.get(element);
    if (old) return old;

    let id = element.getAttribute(PLAYER_ID);
    if (!id) {
        id = "p" + (++playerCounter).toString(36);
        element.setAttribute(PLAYER_ID, id);
    }
    const state: PlayerState = {
        element, id, config: {}, configWasSet: false,
        onFSCommand: null, onFSCommandWasSet: false,
        traceObserver: null, traceObserverWasSet: false,
    };
    states.set(element, state);

    const method = (name: string) => (...args: unknown[]) => invoke(state, name, args);
    const load = (options: string | Record<string, unknown>) => invoke(state, "load", [options]);
    const reload = () => invoke(state, "reload");
    const callExternalInterface = (name: string, ...args: unknown[]) =>
        invoke(state, "callExternalInterface", [name, ...args]);

    const versionedAPI = (): object => new Proxy({}, {
        get(_target, key) {
            if (key === "config") return getCoreValue(state, "config", () => state.config);
            if (key === "readyState") return getCoreValue(state, "readyState", () => 0);
            if (key === "loadedConfig" || key === "metadata") return getCoreValue(state, String(key), () => null);
            if (key === "volume") return getCoreValue(state, "volume", () => 1);
            if (key === "fullscreenEnabled" || key === "isFullscreen") return getCoreValue(state, String(key), () => false);
            if (key === "suspended") {
                const real = descriptor(state.element, "ruffle")?.value;
                return hasCore(state.element) && typeof real === "function"
                    ? Boolean(real.call(state.element, 1).suspended)
                    : true;
            }
            if (key === "traceObserver") return state.traceObserver;
            const desc = descriptor(state.element, "ruffle");
            if (hasCore(state.element) && typeof desc?.value === "function") {
                const api = desc.value.call(state.element, 1) as Record<string, unknown>;
                const value = api[String(key)];
                return typeof value === "function" ? value.bind(api) : value;
            }
            if (key === "addFSCommandHandler") {
                return (callback: (command: string, args: string) => void) =>
                    invoke(state, "ruffle").then((api) =>
                        (api as { addFSCommandHandler(callback: typeof callback): void }).addFSCommandHandler(callback));
            }
            const methods = new Set(["load", "reload", "requestFullscreen", "exitFullscreen", "suspend", "resume", "downloadSwf", "displayMessage", "callExternalInterface"]);
            if (methods.has(String(key))) {
                return (...args: unknown[]) => invoke(state, "ruffle").then((api) => {
                    const fn = (api as Record<string, unknown>)[String(key)];
                    if (typeof fn !== "function") throw new Error("Ruffle API method unavailable: " + String(key));
                    return fn.apply(api, args);
                });
            }
            return undefined;
        },
        set(_target, key, value) {
            if (key === "config") {
                setCoreValue(state, "config", value, () => {
                    state.config = value as Record<string, unknown>;
                    state.configWasSet = true;
                });
                return true;
            }
            if (key === "traceObserver") {
                setCoreValue(state, "traceObserver", value, () => {
                    state.traceObserver = typeof value === "function" ? value : null;
                    state.traceObserverWasSet = true;
                });
                return true;
            }
            return false;
        },
    });

    Object.defineProperties(element, {
        config: {
            configurable: true,
            get: () => getCoreValue(state, "config", () => state.config),
            set: (value: Record<string, unknown>) => setCoreValue(state, "config", value, () => {
                state.config = value && typeof value === "object" ? value : {};
                state.configWasSet = true;
            }),
        },
        loadedConfig: { configurable: true, get: () => getCoreValue(state, "loadedConfig", () => null) },
        readyState: { configurable: true, get: () => getCoreValue(state, "readyState", () => 0) as ReadyState },
        metadata: { configurable: true, get: () => getCoreValue(state, "metadata", () => null) },
        onFSCommand: {
            configurable: true,
            get: () => getCoreValue(state, "onFSCommand", () => state.onFSCommand),
            set: (value: ((command: string, args: string) => void) | null) => setCoreValue(state, "onFSCommand", value, () => {
                state.onFSCommand = typeof value === "function" ? value : null;
                state.onFSCommandWasSet = true;
            }),
        },
        traceObserver: {
            configurable: true,
            get: () => getCoreValue(state, "traceObserver", () => state.traceObserver),
            set: (value: ((message: string) => void) | null) => setCoreValue(state, "traceObserver", value, () => {
                state.traceObserver = typeof value === "function" ? value : null;
                state.traceObserverWasSet = true;
            }),
        },
        volume: { configurable: true, get: () => getCoreValue(state, "volume", () => 1), set: (value: number) => setCoreValue(state, "volume", value, () => {}) },
        isPlaying: { configurable: true, get: () => getCoreValue(state, "isPlaying", () => false) },
        fullscreenEnabled: { configurable: true, get: () => getCoreValue(state, "fullscreenEnabled", () => false) },
        isFullscreen: { configurable: true, get: () => getCoreValue(state, "isFullscreen", () => document.fullscreenElement === element) },
        ruffle: {
            configurable: true,
            value: (version = 1) => {
                if (version !== 1) throw new Error("Only Ruffle API version 1 is supported.");
                const desc = descriptor(element, "ruffle");
                return hasCore(element) && typeof desc?.value === "function"
                    ? desc.value.call(element, version)
                    : versionedAPI();
            },
        },
        load: { configurable: true, value: load },
        reload: { configurable: true, value: reload },
        play: { configurable: true, value: method("play") },
        pause: { configurable: true, value: method("pause") },
        suspend: { configurable: true, value: method("pause") },
        resume: { configurable: true, value: method("play") },
        setFullscreen: {
            configurable: true,
            value: (full: boolean) => {
                const fn = descriptor(element, "setFullscreen")?.value;
                if (typeof fn === "function") fn.call(element, full);
                else if (full && element.requestFullscreen) void element.requestFullscreen().catch(() => {});
                else if (!full && document.exitFullscreen && document.fullscreenElement) void document.exitFullscreen().catch(() => {});
            },
        },
        enterFullscreen: {
            configurable: true,
            value: () => {
                const fn = descriptor(element, "enterFullscreen")?.value;
                if (typeof fn === "function") fn.call(element);
                else if (element.requestFullscreen) void element.requestFullscreen().catch(() => {});
            },
        },
        exitFullscreen: {
            configurable: true,
            value: () => {
                const fn = descriptor(element, "exitFullscreen")?.value;
                if (typeof fn === "function") fn.call(element);
                else if (document.exitFullscreen && document.fullscreenElement) void document.exitFullscreen().catch(() => {});
            },
        },
        downloadSwf: { configurable: true, value: () => invoke(state, "downloadSwf") },
        displayMessage: { configurable: true, value: (message: string) => invoke(state, "displayMessage", [message]) },
        PercentLoaded: { configurable: true, value: () => Number(getCoreValue(state, "readyState", () => 0)) >= 2 ? 100 : 0 },
        callExternalInterface: { configurable: true, value: callExternalInterface },
    });
    return state;
}

const extensionSource: SourceAPI = {
    version: buildInfo.versionNumber + "+" + buildInfo.buildDate.substring(0, 10),
    polyfill(): void {
        void ensureCore(false).catch((error: unknown) => console.warn("Ruffle polyfill initialization failed:", error));
    },
    pluginPolyfill(): void {
        // The early registered main-world script has already installed it.
    },
    createPlayer(): PlayerElement {
        const element = document.createElement(nextPlayerTagName()) as PlayerElement;
        decoratePlayer(element);
        void ensureCore(true).catch((error: unknown) => console.warn("Ruffle initialization failed:", error));
        return element;
    },
};

function openInNewTab(swf: URL): void {
    window.postMessage({
        channel: CHANNEL,
        direction: "main",
        requestId: ++sequence,
        command: "open-url-in-player",
        url: String(swf),
    }, "*");
}

function installPublicAPI(): void {
    const previous = window.RufflePlayer;
    publicAPI = previous instanceof PublicAPI ? previous : new PublicAPI(previous);
    window.RufflePlayer = publicAPI;
    publicAPI.sources["extension"] = extensionSource;
    publicAPI.config = { ...publicAPI.config, openInNewTab };
}

window.addEventListener("message", (event: MessageEvent<unknown>) => {
    if (event.source !== window || !event.data || typeof event.data !== "object") return;
    const message = event.data as Record<string, unknown>;
    if (message["channel"] === CHANNEL && message["direction"] === "isolated" &&
        typeof message["requestId"] === "number") {
        const request = pending.get(message["requestId"]);
        if (request) {
            pending.delete(message["requestId"]);
            request.resolve(message as unknown as Reply);
        }
        if (message["success"] === true && message["skipped"] !== true) {
            coreReady = true;
            for (const state of states.values()) applyPlayerState(state);
        }
        return;
    }
    if (message["to"] === "ruffle_content" && message["index"] === -1 &&
        message["id"] === contentMessageId) {
        coreReady = true;
        return;
    }
    if (message["to"] === "ruffle_page" && message["data"] && typeof message["data"] === "object") {
        const data = message["data"] as Record<string, unknown>;
        const index = message["index"];
        const id = message["id"];
        if (typeof id === "number") contentMessageId = id;
        if (!coreReady && (data["type"] === "load" || data["type"] === "ping") &&
            typeof index === "number" && index !== -1) {
            window.postMessage({ to: "ruffle_content", index, id, data: {} }, "*");
        }
    }
});

installPublicAPI();
