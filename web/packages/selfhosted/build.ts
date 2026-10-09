import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import crypto from "node:crypto";
import { fileURLToPath, URL } from "node:url";
import json5 from "json5";
import * as esbuild from "esbuild";

const __dirname: string = fileURLToPath(new URL(".", import.meta.url));
const distDir: string = path.join(__dirname, "dist");
const coreDir: string = path.resolve(__dirname, "../core");

// 1. Clean dist directory
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 2. Transform and emit package.json from npm-package.json5
const rawPackageJson5: string = fs.readFileSync(
    path.join(__dirname, "npm-package.json5"),
    "utf8",
);

interface PackageJson {
    version: string;
    [key: string]: unknown;
}

const pkg: PackageJson = json5.parse(rawPackageJson5);

const pkgVersion = process.env["npm_package_version"];

if (pkgVersion === undefined) {
    throw new Error("npm_package_version environment variable is not defined");
}

pkg.version = pkgVersion;
fs.writeFileSync(
    path.join(distDir, "package.json"),
    JSON.stringify(pkg, null, 2),
);

// 3. Copy static files (LICENSE*, README.md)
const rootFiles: string[] = fs.readdirSync(__dirname);
for (const file of rootFiles) {
    if (file.startsWith("LICENSE") || file === "README.md") {
        fs.copyFileSync(path.join(__dirname, file), path.join(distDir, file));
    }
}

// 4. Copy translation resources next to ruffle.js so the selfhosted build
// never needs to fetch localization from an external service.
const sourceTextsDir: string = path.join(coreDir, "texts");
const distTextsDir: string = path.join(distDir, "texts");

for (const locale of fs.readdirSync(sourceTextsDir, { withFileTypes: true })) {
    if (!locale.isDirectory()) {
        continue;
    }

    const sourceLocaleDir = path.join(sourceTextsDir, locale.name);
    const distLocaleDir = path.join(distTextsDir, locale.name);

    for (const file of fs.readdirSync(sourceLocaleDir, {
        withFileTypes: true,
    })) {
        if (!file.isFile() || !file.name.endsWith(".ftl")) {
            continue;
        }

        fs.mkdirSync(distLocaleDir, { recursive: true });
        fs.copyFileSync(
            path.join(sourceLocaleDir, file.name),
            path.join(distLocaleDir, file.name),
        );
    }
}

// 5. Hash and copy WASM binaries
function copyAndHashWasm(filename: string): string {
    const sourcePath: string = path.join(coreDir, "dist", filename);

    if (!fs.existsSync(sourcePath)) {
        throw new Error(`Could not find ${sourcePath}`);
    }

    const buffer: Buffer = fs.readFileSync(sourcePath);
    const hash: string = crypto
        .createHash("md5")
        .update(buffer)
        .digest("hex")
        .slice(0, 20);

    const ext: string = path.extname(filename);
    const base: string = path.basename(filename, ext);
    const hashedName: string = `${base}.${hash}${ext}`;

    fs.writeFileSync(path.join(distDir, hashedName), buffer);

    return `./${hashedName}`;
}

const coreLoadRufflePath: string = path.join(coreDir, "dist", "load-ruffle.js");

const coreLoadRuffle: string = fs.readFileSync(coreLoadRufflePath, "utf8");

const needsMvpWasm: boolean = coreLoadRuffle.includes(
    "ruffle_web-wasm_mvp_bg.wasm",
);

const wasmExtPath: string = copyAndHashWasm("ruffle_web_bg.wasm");

const wasmMvpPath: string | undefined = needsMvpWasm
    ? copyAndHashWasm("ruffle_web-wasm_mvp_bg.wasm")
    : undefined;

// 6. Bundle with esbuild
const isProduction: boolean = process.env["NODE_ENV"] !== "development";

let rewroteWasmUrls = false;

// This handles rewriting static original WASM URLs in load-ruffle.js
// to their hashed counterparts.
const wasmUrlPlugin: esbuild.Plugin = {
    name: "rewrite-wasm-urls",

    setup(build: esbuild.PluginBuild) {
        build.onLoad(
            { filter: /(?:^|[/\\])load-ruffle\.js$/ },
            async (args: esbuild.OnLoadArgs) => {
                let contents: string = await fs.promises.readFile(
                    args.path,
                    "utf8",
                );

                const rewrite = (pattern: RegExp, hashedPath: string) => {
                    let count = 0;
                    contents = contents.replace(pattern, () => {
                        count++;
                        return JSON.stringify(hashedPath);
                    });
                    if (count === 0) {
                        throw new Error(
                            `No reference matching ${pattern} found in ${args.path}`,
                        );
                    }
                };

                rewrite(/(["'])\.?\/?ruffle_web_bg\.wasm\1/g, wasmExtPath);
                if (wasmMvpPath !== undefined) {
                    rewrite(
                        /(["'])\.?\/?ruffle_web-wasm_mvp_bg\.wasm\1/g,
                        wasmMvpPath,
                    );
                }

                const leftover = /["'][^"']*_bg\.wasm["']/.exec(contents);
                if (leftover) {
                    throw new Error(
                        `Unhashed .wasm reference ${leftover[0]} left in ${args.path}`,
                    );
                }

                rewroteWasmUrls = true;

                return {
                    contents,
                    loader: "js",
                };
            },
        );
    },
};

let rewroteLocalization = false;

// This transform applies only to the selfhosted bundle. Keep other core consumers,
// including the browser extension, using their normal bundled translations.
const selfhostedLocalizationPlugin: esbuild.Plugin = {
    name: "selfhosted-localization",

    setup(build: esbuild.PluginBuild) {
        build.onLoad(
            { filter: /(?:^|[/\\])internal[/\\]i18n\.js$/ },
            async (args: esbuild.OnLoadArgs) => {
                let contents: string = await fs.promises.readFile(
                    args.path,
                    "utf8",
                );

                const bundledTextsMatch =
                    /const BUNDLED_TEXTS = (\{[\s\S]*?\n\});/.exec(contents);
                if (!bundledTextsMatch || !bundledTextsMatch[1]) {
                    throw new Error(
                        `Could not find BUNDLED_TEXTS in ${args.path}`,
                    );
                }

                const bundledTexts = JSON.parse(bundledTextsMatch[1]) as Record<
                    string,
                    Record<string, string>
                >;
                if (!bundledTexts["en-US"]) {
                    throw new Error(
                        "English translations are missing from BUNDLED_TEXTS",
                    );
                }

                contents = contents.replace(
                    bundledTextsMatch[0],
                    `const BUNDLED_TEXTS = ${JSON.stringify({ "en-US": bundledTexts["en-US"] })};`,
                );

                if (!contents.includes('"__RUFFLE_LOCALE_TEXTS_BASE__"')) {
                    throw new Error(
                        "Local localization path marker was not found",
                    );
                }
                contents = contents.replace(
                    '"__RUFFLE_LOCALE_TEXTS_BASE__"',
                    JSON.stringify("texts"),
                );

                rewroteLocalization = true;

                return {
                    contents,
                    loader: "js",
                };
            },
        );
    },
};

await esbuild.build({
    entryPoints: [path.join(__dirname, "js/ruffle.ts")],
    bundle: true,
    outdir: distDir,
    entryNames: "ruffle",
    format: "iife",
    // Make our code and dependencies use built-ins that the page can't break.
    inject: [path.join(coreDir, "dist", "pristine-globals.js")],
    minify: isProduction,
    sourcemap: true,
    target: "es2021",
    plugins: [wasmUrlPlugin, selfhostedLocalizationPlugin],
});

if (!rewroteLocalization) {
    throw new Error(
        "internal/i18n.js was never loaded through the selfhosted localization transform",
    );
}

if (!rewroteWasmUrls) {
    throw new Error(
        "load-ruffle.js was never loaded through rewrite-wasm-urls, so its .wasm URLs weren't rewritten",
    );
}

console.log("ESBuild complete!");
