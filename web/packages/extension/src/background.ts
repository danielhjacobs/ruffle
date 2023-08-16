import * as utils from "./utils";

const RULE_SWF_URL = 1;

async function enable() {
    if (chrome?.declarativeNetRequest) {
        const playerPage = chrome.runtime.getURL("/player.html");
        const rules = [
            {
                id: RULE_SWF_URL,
                action: {
                    type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
                    redirect: { regexSubstitution: playerPage + "#\\0" },
                },
                condition: {
                    regexFilter: "^.*\\.swf(\\?.*|#.*|)$",
                    resourceTypes: [
                        chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
                    ],
                },
            },
        ];
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [RULE_SWF_URL],
            addRules: rules,
        });
    }

    if (chrome?.scripting) {
        await chrome.scripting.registerContentScripts([
            {
                id: "plugin-polyfill",
                js: ["dist/pluginPolyfill.js"],
                persistAcrossSessions: false,
                matches: ["<all_urls>"],
                excludeMatches: [
                    "https://sso.godaddy.com/*",
                    "https://authentication.td.com/*",
                    "https://*.twitch.tv/*",
                    "https://www.tuxedocomputers.com/*",
                    "https://*.taobao.com/*",
                ],
                runAt: "document_start",
                world: "MAIN",
            },
        ]);
    }
}

async function disable() {
    if (chrome?.declarativeNetRequest) {
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [RULE_SWF_URL],
        });
    }

    if (chrome?.scripting) {
        await chrome.scripting.unregisterContentScripts({
            ids: ["plugin-polyfill"],
        });
    }
}

(async () => {
    const { ruffleEnable } = await utils.getOptions();

    if (ruffleEnable) {
        await enable();
    }

    utils.storage.onChanged.addListener(async (changes, namespace) => {
        if (namespace === "sync" && "ruffleEnable" in changes) {
            if (changes["ruffleEnable"]!.newValue) {
                await enable();
            } else {
                await disable();
            }
        }
    });
})();
