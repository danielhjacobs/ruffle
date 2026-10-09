/**
 *
 * This code provides a content script message listener that proxies messages
 * into/from the main world.
 *
 * On older Firefox, it also pierces the extension sandbox by copying our code into the main world
 *
 */

import {
    enableBrowserOnOutdatedChromium,
    getOptions,
    getExplicitOptions,
} from "./utils";
import { isMessage } from "./messages";

const pendingMessages: ({
    resolve(value: unknown): void;
    reject(reason?: unknown): void;
} | null)[] = [];

const ID = Math.floor(Math.random() * 100000000000);

/**
 * Send a message to the main world, where Ruffle runs.
 * @param {*} data - JSON-serializable data to send to main world.
 * @returns {Promise<*>} JSON-serializable response from main world.
 */
function sendMessageToPage(data: unknown): Promise<unknown> {
    const message = {
        to: "ruffle_page",
        index: pendingMessages.length,
        id: ID,
        data,
    };
    window.postMessage(message, "*");
    return new Promise((resolve, reject) => {
        pendingMessages.push({ resolve, reject });
    });
}

/**
 * Inject an extension script URL into the page's main world. This is a
 * fallback for browsers that cannot use scripting.executeScript with MAIN.
 */
function injectScriptURL(url: string): Promise<void> {
    const script = document.createElement("script");
    const promise = new Promise<void>((resolve, reject) => {
        script.addEventListener(
            "load",
            function () {
                this.remove();
                resolve();
            },
            { once: true },
        );
        script.addEventListener(
            "error",
            (event) => {
                script.remove();
                reject(event);
            },
            { once: true },
        );
    });
    script.charset = "utf-8";
    script.src = url;
    (document.head || document.documentElement).append(script);
    return promise;
}


/**
 * Check whether the current page (or one of its ancestors) is configured
 * to opt-out from Ruffle.
 * @returns {boolean} Whether the current page opts-out or not.
 */
function checkPageOptout(): boolean {
    if (document.documentElement.hasAttribute("data-ruffle-optout")) {
        return true;
    }
    try {
        if (
            window.top &&
            window.top.document &&
            window.top.document.documentElement &&
            window.top.document.documentElement.hasAttribute(
                "data-ruffle-optout",
            )
        ) {
            // In case the opting-out page uses iframes.
            return true;
        }
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        console.warn(`Unable to check top-level optout: ${message}`);
    }
    return false;
}

/**
 * @returns {boolean} Whether the current page is an XML document or not.
 */
function isXMLDocument(): boolean {
    // Based on https://developer.mozilla.org/en-US/docs/Web/API/Document/xmlVersion
    return document.createElement("foo").tagName !== "FOO";
}

const FLASH_MIME_TYPES = new Set([
    "application/x-shockwave-flash",
    "application/futuresplash",
    "application/x-shockwave-flash2-preview",
    "application/vnd.adobe.flash.movie",
]);

const GENERIC_BINARY_MIME_TYPES = new Set([
    "application/octet-stream",
    "binary/octet-stream",
]);

function isFlashReference(src: string | null, type: string | null): boolean {
    const mimeType = (type ?? "").split(";", 1)[0]!.trim().toLowerCase();
    if (FLASH_MIME_TYPES.has(mimeType)) {
        return true;
    }
    if (!src) {
        return false;
    }

    let isSwfPath = false;
    try {
        isSwfPath = /\.(?:swf|spl)$/i.test(
            new URL(src, document.baseURI).pathname,
        );
    } catch {
        // Ignore invalid URLs.
    }

    if (!mimeType) {
        return isSwfPath;
    }
    return isSwfPath && GENERIC_BINARY_MIME_TYPES.has(mimeType);
}

function isFlashCandidate(element: Element): boolean {
    const name = element.localName.toLowerCase();
    if (/^ruffle-(?:player|embed|object)(?:-\d+)?$/.test(name)) {
        return true;
    }
    if (name !== "embed" && name !== "object") {
        return false;
    }

    const type = element.getAttribute("type");
    if (name === "embed") {
        return isFlashReference(element.getAttribute("src"), type);
    }

    if (isFlashReference(element.getAttribute("data"), type)) {
        return true;
    }

    const classId = element.getAttribute("classid")?.toLowerCase();
    if (classId === "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000") {
        return true;
    }

    const movieParam = Array.from(element.querySelectorAll("param")).find(
        (param) => param.getAttribute("name")?.toLowerCase() === "movie",
    );
    return isFlashReference(movieParam?.getAttribute("value") ?? null, type);
}

/**
 * Scan added subtrees for Flash elements and the numbered Ruffle element names
 * used when a page already defines its own custom elements with Ruffle's names.
 */
function containsFlashCandidate(node: Node): boolean {
    if (!(node instanceof Element)) {
        return false;
    }
    if (isFlashCandidate(node)) {
        return true;
    }
    return Array.from(node.querySelectorAll("*")).some(isFlashCandidate);
}

function mutationContainsFlashCandidate(mutation: MutationRecord): boolean {
    if (mutation.type === "attributes") {
        const target = mutation.target;
        if (!(target instanceof Element)) {
            return false;
        }
        if (isFlashCandidate(target)) {
            return true;
        }
        const parentObject = target.closest("object");
        return parentObject !== null && isFlashCandidate(parentObject);
    }

    for (const node of mutation.addedNodes) {
        if (containsFlashCandidate(node)) {
            return true;
        }
        // A newly inserted movie <param> can make its containing object eligible.
        if (node instanceof Element) {
            const parentObject = node.closest("object");
            if (parentObject && isFlashCandidate(parentObject)) {
                return true;
            }
        }
    }
    return false;
}


(async () => {
    enableBrowserOnOutdatedChromium();
    await browser.storage.sync.set({
        ["showReloadButton"]: false,
    });
    const options = await getOptions();
    const explicitOptions = await getExplicitOptions();

    const pageOptout = checkPageOptout();
    const shouldLoad =
        !isXMLDocument() &&
        options.ruffleEnable &&
        (options.ignoreOptout || !pageOptout);

    let runtimeLoaded = false;

    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
        // The popup only needs to know whether Ruffle is enabled for this tab;
        // a page-world runtime is unnecessary until Flash content is found.
        if (
            typeof message === "object" &&
            message !== null &&
            "type" in message &&
            message.type === "ping"
        ) {
            sendResponse({
                loaded: shouldLoad,
                tabOptions: options,
                optout: pageOptout,
            });
            return false;
        }

        if (shouldLoad && runtimeLoaded) {
            sendMessageToPage(message).then((response) => {
                sendResponse({
                    loaded: true,
                    tabOptions: options,
                    optout: pageOptout,
                    data: response,
                });
            });
            return true;
        }

        sendResponse({
            loaded: false,
            tabOptions: options,
            optout: pageOptout,
        });
        return false;
    });

    if (!shouldLoad) {
        return;
    }

    window.addEventListener("message", (event) => {
        // We only accept messages from ourselves.
        if (event.source !== window || !event.data) {
            return;
        }

        const { to, index, data, id } = event.data;
        if (to === "ruffle_content" && id === ID) {
            const request = index !== null ? pendingMessages[index] : null;
            if (request) {
                pendingMessages[index] = null;
                request.resolve(data);
            } else if (isMessage(data)) {
                switch (data.type) {
                    case "open_url_in_player":
                        void browser.runtime.sendMessage({
                            type: "open_url_in_player",
                            url: data.url,
                        });
                        break;
                    default:
                    // Ignore unknown messages.
                }
            }
        }
    });

    let runtimeLoading: Promise<void> | null = null;
    let flashObserver: MutationObserver | null = null;

    const loadRuffle = (): Promise<void> => {
        if (runtimeLoaded) {
            return Promise.resolve();
        }
        if (runtimeLoading) {
            return runtimeLoading;
        }

        const loading = (async () => {
            // Prefer extension-controlled injection into the exact frame.
            // The URL fallback covers older browsers without MAIN injection.
            let injected = false;
            try {
                injected = await browser.runtime.sendMessage({
                    type: "inject_ruffle_runtime",
                });
            } catch {
                // Fall back to a web-accessible script URL below.
            }

            if (!injected) {
                await injectScriptURL(
                    browser.runtime.getURL("dist/ruffle.js"),
                );
            }

            await sendMessageToPage({
                type: "load",
                config: {
                    ...explicitOptions,
                    autoplay: options.autostart ? "on" : "auto",
                    unmuteOverlay: options.autostart ? "hidden" : "visible",
                    splashScreen: !options.autostart,
                },
                publicPath: browser.runtime.getURL("/dist/"),
            });

            runtimeLoaded = true;
            flashObserver?.disconnect();
            flashObserver = null;
        })();

        // Store the caught promise so concurrent mutations share the same
        // operation without creating unhandled rejections.
        runtimeLoading = loading.catch((error: unknown) => {
            runtimeLoading = null;
            console.warn("Unable to initialize Ruffle in the page:", error);
        });
        return runtimeLoading;
    };

    flashObserver = new MutationObserver((mutations) => {
        if (mutations.some(mutationContainsFlashCandidate)) {
            void loadRuffle();
        }
    });
    flashObserver.observe(document, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["src", "data", "type", "classid", "name", "value"],
    });

    // The content script runs at document_start, so the observer catches later
    // insertions. This scan handles candidate elements already present.
    if (Array.from(document.querySelectorAll("*")).some(isFlashCandidate)) {
        void loadRuffle();
    }
})();
