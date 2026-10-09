import { FluentBundle, FluentResource } from "@fluent/bundle";
import { negotiateLanguages } from "@fluent/langneg";
import type { FluentVariable } from "@fluent/bundle";
import { currentScriptURL } from "../current-script.js";

interface FileBundle {
    [filename: string]: string;
}

interface LocaleBundle {
    [locale: string]: FileBundle;
}

// This is automatically populated by `tools/bundle_texts.ts` via a postbuild script
const BUNDLED_TEXTS: LocaleBundle = {/* %BUNDLED_TEXTS% */};
const LOCALE_TEXTS_BASE = "__RUFFLE_LOCALE_TEXTS_BASE__";
const LOCALE_FILES: Record<string, string[]> = {/* %LOCALE_FILES% */};

const bundles: Record<string, FluentBundle> = {};

for (const [locale, files] of Object.entries(BUNDLED_TEXTS)) {
    const bundle = new FluentBundle(locale);
    if (files) {
        for (const [filename, text] of Object.entries(files)) {
            if (text) {
                for (const error of bundle.addResource(
                    new FluentResource(text),
                )) {
                    console.error(
                        `Error in text for ${locale} ${filename}: ${error}`,
                    );
                }
            }
        }
    }
    bundles[locale] = bundle;
}

const localeLoads = new Map<string, Promise<void>>();

/**
 *
 * @returns An empty promise
 * Loads a locale's Fluent resources once, sharing in-flight requests.
 *
 * @param locale The locale to load
 */
function loadLocale(locale: string): Promise<void> {
    if (bundles[locale] !== undefined) {
        return Promise.resolve();
    }

    const pending = localeLoads.get(locale);
    if (pending !== undefined) {
        return pending;
    }

    const filenames = LOCALE_FILES[locale];
    if (!filenames) {
        return Promise.resolve();
    }

    const load = (async () => {
        const bundle = new FluentBundle(locale);
        const resources = await Promise.all(
            filenames.map(async (filename) => {
                try {
                    const response = await fetch(
                        new URL(
                            LOCALE_TEXTS_BASE + "/" + locale + "/" + filename,
                            currentScriptURL ?? new URL(".", document.baseURI),
                        ).href,
                    );
                    if (!response.ok) {
                        throw new Error("HTTP " + response.status);
                    }
                    return await response.text();
                } catch (error) {
                    console.warn(
                        "Unable to load Ruffle translations for " +
                            locale +
                            "/" +
                            filename,
                        error,
                    );
                    return null;
                }
            }),
        );

        for (let i = 0; i < resources.length; i++) {
            const source = resources[i];
            if (source !== null && source !== undefined) {
                for (const error of bundle.addResource(
                    new FluentResource(source),
                )) {
                    console.error(
                        "Error in text for " +
                            locale +
                            " " +
                            filenames[i] +
                            ": " +
                            error,
                    );
                }
            }
        }

        // Store even a partially loaded bundle: missing messages fall back to
        // English, and failed files should not cause a request on every lookup.
        bundles[locale] = bundle;
        window.dispatchEvent(new Event("ruffle-localizationchange"));
    })().finally(() => {
        localeLoads.delete(locale);
    });

    localeLoads.set(locale, load);
    return load;
}

/**
 * Begins loading the preferred locales without blocking synchronous text lookups.
 */
async function loadPreferredLocales(): Promise<void> {
    if (LOCALE_TEXTS_BASE === "__RUFFLE_LOCALE_TEXTS_BASE__") {
        return;
    }

    const locales = negotiateLanguages(
        navigator.languages,
        Object.keys(LOCALE_FILES),
        { defaultLocale: "en-US" },
    ).filter((locale) => locale !== "en-US");

    await Promise.all(locales.map(loadLocale));
}

if (LOCALE_TEXTS_BASE !== "__RUFFLE_LOCALE_TEXTS_BASE__") {
    window.addEventListener("languagechange", () => {
        void loadPreferredLocales();
    });
    void loadPreferredLocales();
}

/**
 * Gets the localised text for the given locale and text ID.
 *
 * If the locale does not contain a text for this ID, it will return null.
 *
 * @param locale Locale to prefer when retrieving text, ie "en-US"
 * @param id ID of the text to retrieve
 * @param args Any arguments to use when creating the localised text
 * @returns Localised text or null if not found
 */
function tryText(
    locale: string,
    id: string,
    args?: Record<string, FluentVariable> | null,
): string | null {
    const bundle = bundles[locale];
    if (bundle !== undefined) {
        const message = bundle.getMessage(id);
        if (message !== undefined && message.value) {
            return bundle.formatPattern(message.value, args);
        }
    }
    return null;
}

/**
 * Gets the localised text for the given text ID.
 *
 * The users preferred locales are used, in priority order, to find the given text.
 *
 * If no text is found for any preferred locale, en-US will be used.
 * If en-US does not contain a text for this ID, an error will be logged and the ID itself will be returned.
 *
 * @param id ID of the text to retrieve
 * @param args Any arguments to use when creating the localised text
 * @returns Localised text
 */
export function text(
    id: string,
    args?: Record<string, FluentVariable> | null,
): string {
    // A player may be created after Ruffle is imported and after the preferred
    // language changes without a languagechange event. Start missing fetches
    // here, but keep this lookup synchronous and use English until they finish.
    if (LOCALE_TEXTS_BASE !== "__RUFFLE_LOCALE_TEXTS_BASE__") {
        void loadPreferredLocales();
    }

    const locales = negotiateLanguages(
        navigator.languages,
        Object.keys(bundles),
        { defaultLocale: "en-US" },
    );

    for (const i in locales) {
        const result = tryText(locales[i]!, id, args);
        if (result) {
            return result;
        }
    }

    console.error(`Unknown text key '${id}'`);
    return id;
}

/**
 * Gets the localised text for the given text ID, as <p>paragraphs</p> and HTML entities safely encoded.
 *
 * The users preferred locales are used, in priority order, to find the given text.
 *
 * If no text is found for any preferred locale, en-US will be used.
 * If en-US does not contain a text for this ID, an error will be logged and the ID itself will be returned.
 *
 * @param id ID of the text to retrieve
 * @param args Any arguments to use when creating the localised text
 * @returns Localised text with each line in a Paragraph element
 */
export function textAsParagraphs(
    id: string,
    args?: Record<string, FluentVariable> | null,
): HTMLDivElement {
    const result = document.createElement("div");
    text(id, args)
        .split("\n")
        .forEach((line) => {
            const p = document.createElement("p");
            p.innerText = line;
            result.appendChild(p);
        });
    return result;
}

/**
 * Fills in the localized texts of all elements under the given root that request one.
 *
 * Elements with a `data-i18n-key` attribute get their content set to the text with that key,
 * and elements with a `data-i18n-title-key` attribute get their title set to the text with that key.
 *
 * @param root Root to search for elements in
 * @param getText Function returning the text for the given ID
 */
export function localizeElements(
    root: ParentNode,
    getText: (id: string) => string = text,
): void {
    for (const element of root.querySelectorAll<HTMLElement | SVGElement>(
        "[data-i18n-key]",
    )) {
        element.textContent = getText(element.dataset["i18nKey"]!);
    }
    for (const element of root.querySelectorAll<HTMLElement | SVGElement>(
        "[data-i18n-title-key]",
    )) {
        element.setAttribute(
            "title",
            getText(element.dataset["i18nTitleKey"]!),
        );
    }
}
