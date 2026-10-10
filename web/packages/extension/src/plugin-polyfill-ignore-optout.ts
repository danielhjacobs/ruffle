// This file is compiled and then injected into content.ts's compiled form.

// Signal to the immediately following MAIN-world API facade that the user
// explicitly chose to ignore data-ruffle-optout.
(window as Window & { __ruffleExtensionIgnoreOptout?: boolean })
    .__ruffleExtensionIgnoreOptout = true;

import {
    installPlugin,
    FLASH_PLUGIN,
} from "ruffle-core/dist/plugin-polyfill.js";

installPlugin(FLASH_PLUGIN);
