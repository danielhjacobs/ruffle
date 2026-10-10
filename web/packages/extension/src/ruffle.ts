/**
 * Isolated-world controller. Only the small public API and plugin shim run in
 * MAIN immediately; the full core is injected there only when required.
 */
const CHANNEL = "ruffle-extension-core-bridge-v1";
const PLAYER_ID = "data-ruffle-extension-player";
if (!globalThis.browser) globalThis.browser = chrome;

type LoadEnvelope = {
    to: "ruffle_page";
    index: number;
    id: number;
    data: { type: "load"; config: Record<string, unknown>; publicPath: string };
};
type MainRequest = {
    channel: string; direction: "main"; requestId: number;
    command: "ensure-core" | "open-url-in-player";
    force?: boolean; config?: Record<string, unknown>; url?: string;
};

const FLASH_MIME_TYPES = new Set([
    "application/x-shockwave-flash", "application/futuresplash",
    "application/x-shockwave-flash2-preview", "application/vnd.adobe.flash.movie",
]);
const GENERIC_MIME_TYPES = new Set(["application/octet-stream", "binary/octet-stream"]);
let loadEnvelope: LoadEnvelope | null = null;
let coreLoading: Promise<boolean> | null = null;
let coreLoaded = false;
let observer: MutationObserver | null = null;

function isFlashReference(src: string | null, type: string | null): boolean {
    const mime = (type ?? "").split(";", 1)[0]!.trim().toLowerCase();
    if (FLASH_MIME_TYPES.has(mime)) return true;
    if (!src) return false;
    let swf = false;
    try { swf = /\.(?:swf|spl)$/i.test(new URL(src, document.baseURI).pathname); } catch { /* invalid URL */ }
    if (!mime) return swf;
    return swf && GENERIC_BINARY_MIME_TYPES.has(mime);
}
function isFlashElement(element: Element): boolean {
    const tag = element.localName.toLowerCase();
    if (/^ruffle-(?:player|embed|object)(?:-\d+)?$/.test(tag)) return true;
    if (tag === "embed") return isFlashReference(element.getAttribute("src"), element.getAttribute("type"));
    if (tag !== "object") return false;
    const type = element.getAttribute("type");
    if (isFlashReference(element.getAttribute("data"), type)) return true;
    if (element.getAttribute("classid")?.toLowerCase() === "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000") return true;
    const movie = Array.from(element.querySelectorAll("param")).find((p) => p.getAttribute("name")?.toLowerCase() === "movie");
    return isFlashReference(movie?.getAttribute("value") ?? null, type);
}
function containsFlashCandidate(node: Node): boolean {
    if (!(node instanceof Element)) return false;
    if (isFlashElement(node)) return true;
    return Array.from(node.querySelectorAll("object, embed, ruffle-player, ruffle-embed, ruffle-object")).some(isFlashElement);
}
function reply(requestId: number, success: boolean, skipped = false, error?: string): void {
    window.postMessage({ channel: CHANNEL, direction: "isolated", requestId, success, skipped, error }, "*");
}
function injectCoreByURL(): Promise<void> {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = browser.runtime.getURL("dist/ruffleCore.js");
        script.charset = "utf-8";
        script.addEventListener("load", function () { this.remove(); resolve(); }, { once: true });
        script.addEventListener("error", (event) => {
            script.remove();
            reject(new Error("The page blocked Ruffle core script injection: " + String(event)));
        }, { once: true });
        (document.head || document.documentElement).append(script);
    });
}
function waitForCoreAck(): Promise<void> {
    if (!loadEnvelope) {
        loadEnvelope = {
            to: "ruffle_page", index: -1, id: -1,
            data: { type: "load", config: {}, publicPath: browser.runtime.getURL("/dist/") },
        };
    }
    const envelope: LoadEnvelope = { ...loadEnvelope, index: -1, data: { ...loadEnvelope.data } };
    return new Promise((resolve, reject) => {
        const timeout = window.setTimeout(() => {
            window.removeEventListener("message", onMessage);
            reject(new Error("Ruffle core did not acknowledge initialization."));
        }, 10000);
        const onMessage = (event: MessageEvent<unknown>) => {
            if (event.source !== window || !event.data || typeof event.data !== "object") return;
            const message = event.data as Record<string, unknown>;
            if (message["to"] === "ruffle_content" && message["index"] === -1 && message["id"] === envelope.id) {
                window.clearTimeout(timeout);
                window.removeEventListener("message", onMessage);
                resolve();
            }
        };
        window.addEventListener("message", onMessage);
        window.postMessage(envelope, "*");
    });
}
async function ensureCore(force: boolean, config?: Record<string, unknown>): Promise<{ success: boolean; skipped?: boolean; error?: string }> {
    if (config && loadEnvelope) {
        loadEnvelope = { ...loadEnvelope, data: { ...loadEnvelope.data, config: { ...loadEnvelope.data.config, ...config } } };
    }
    if (coreLoaded) return { success: true };
    if (!force && !Array.from(document.querySelectorAll("object, embed, ruffle-player, ruffle-embed, ruffle-object")).some(isFlashElement)) {
        return { success: true, skipped: true };
    }
    if (coreLoading) {
        const ok = await coreLoading;
        return ok ? { success: true } : { success: false, error: "Ruffle core initialization failed." };
    }
    coreLoading = (async () => {
        let injected = false;
        try { injected = await browser.runtime.sendMessage({ type: "inject_ruffle_core" }) === true; } catch { /* URL fallback below */ }
        if (!injected) await injectCoreByURL();
        await waitForCoreAck();
        coreLoaded = true;
        return true;
    })().catch((error: unknown) => {
        console.warn("Unable to initialize Ruffle core:", error);
        return false;
    }).finally(() => { coreLoading = null; });
    const ok = await coreLoading;
    return ok ? { success: true } : { success: false, error: "Ruffle core injection or initialization failed." };
}
function markPlayerElements(): void {
    for (const element of document.querySelectorAll("ruffle-player, ruffle-embed, ruffle-object, ruffle-embed-1, ruffle-object-1")) {
        if (!element.hasAttribute(PLAYER_ID)) element.setAttribute(PLAYER_ID, "r" + Math.random().toString(36).slice(2));
    }
}
function observeDocument(): void {
    if (observer) return;
    observer = new MutationObserver((records) => {
        for (const record of records) {
            if (record.type === "attributes" && record.target instanceof Element && isFlashElement(record.target)) {
                void ensureCore(true); return;
            }
            for (const node of record.addedNodes) {
                if (containsFlashCandidate(node)) { void ensureCore(true); return; }
            }
        }
        markPlayerElements();
    });
    observer.observe(document, { subtree: true, childList: true, attributes: true,
        attributeFilter: ["src", "data", "type", "classid", "name", "value"] });
    markPlayerElements();
    if (Array.from(document.querySelectorAll("object, embed, ruffle-player, ruffle-embed, ruffle-object")).some(isFlashElement)) {
        void ensureCore(true);
    }
}

window.addEventListener("message", (event: MessageEvent<unknown>) => {
    if (event.source !== window || !event.data || typeof event.data !== "object") return;
    const message = event.data as Record<string, unknown>;
    if (message["to"] === "ruffle_page" && message["data"] && typeof message["data"] === "object" &&
        (message["data"] as Record<string, unknown>)["type"] === "load") {
        loadEnvelope = {
            to: "ruffle_page",
            index: Number(message["index"] ?? 0),
            id: Number(message["id"] ?? 0),
            data: {
                type: "load",
                config: ((message["data"] as Record<string, unknown>)["config"] ?? {}) as Record<string, unknown>,
                publicPath: String((message["data"] as Record<string, unknown>)["publicPath"] ?? browser.runtime.getURL("/dist/")),
            },
        };
        observeDocument();
        return;
    }
    if (message["channel"] === CHANNEL && message["direction"] === "main" && typeof message["requestId"] === "number") {
        const request = message as unknown as MainRequest;
        if (request.command === "open-url-in-player") {
            void browser.runtime.sendMessage({ type: "open_url_in_player", url: String(request.url ?? "") });
            reply(request.requestId, true);
            return;
        }
        void ensureCore(Boolean(request.force), request.config).then((result) =>
            reply(request.requestId, result.success, Boolean(result.skipped), result.error));
    }
    if (message["to"] === "ruffle_content" && message["id"] === loadEnvelope?.id && message["index"] === -1) {
        coreLoaded = true;
    }
});
