import "./index.css";

import { SourceAPI, PublicAPI } from "ruffle-core";

window.RufflePlayer = PublicAPI.negotiate(
    window.RufflePlayer,
    "local",
    new SourceAPI("local")
);
const ruffle = window.RufflePlayer.newest();

let player;

const main = document.getElementById("main");
const overlay = document.getElementById("overlay");
const prompt = document.getElementById("prompt");
const authorContainer = document.getElementById("author-container");
const filenameContainer = document.getElementById("filename-container");
const author = document.getElementById("author");
const filename = document.getElementById("filename");
const fileInputContainer = document.getElementById(
    "swfs-container"
);
const localFileInput = document.getElementById("local-file");
const fileInput = document.getElementById("swfs");
// prettier-ignore
const optionGroups = {
    "Animation": document.getElementById("anim-optgroup"),
    "Game": document.getElementById("games-optgroup"),
};

// Default config used by the player.
const config = {
    letterbox: "on",
    logLevel: "warn",
};

function unload() {
    if (player) {
        player.remove();
    }
    prompt.classList.remove("hidden");
}

function load(options) {
    unload();
    prompt.classList.add("hidden");

    player = ruffle.createPlayer();
    player.id = "player";
    main.append(player);
    player.load(options);
}

function showSample(swfData) {
    authorContainer.classList.remove("hidden");
    author.textContent = swfData.author;
    author.href = swfData.authorLink;
    localFileInput.value = null;
}

function hideSample(newIndex) {
    fileInput.selectedIndex = newIndex ? newIndex : 0;
    authorContainer.classList.add("hidden");
    author.textContent = "";
    author.href = "";
}

async function loadFile(file) {
    if (!file) {
        return;
    }
    hideSample(1);
    filename.textContent = file.name;
    filenameContainer.classList.remove("hidden");
    const data = await new Response(file).arrayBuffer();
    load({ data, ...config });
}

function loadSample() {
    const swfData = fileInput[fileInput.selectedIndex].swfData;
    filename.textContent = "";
    filenameContainer.classList.add("hidden");
    if (swfData) {
        showSample(swfData);
        load({ url: swfData.location, ...config });
    } else {
        hideSample();
        unload();
    }
}

localFileInput.addEventListener("change", (event) => {
    loadFile(event.target.files[0]);
});

main.addEventListener("dragenter", (event) => {
    event.stopPropagation();
    event.preventDefault();
});
main.addEventListener("dragleave", (event) => {
    event.stopPropagation();
    event.preventDefault();
    overlay.classList.remove("drag");
});
main.addEventListener("dragover", (event) => {
    event.stopPropagation();
    event.preventDefault();
    overlay.classList.add("drag");
});
main.addEventListener("drop", (event) => {
    event.stopPropagation();
    event.preventDefault();
    overlay.classList.remove("drag");
    localFileInput.files = event.dataTransfer.files;
    loadFile(event.dataTransfer.files[0]);
});
localFileInput.addEventListener("dragleave", (event) => {
    event.stopPropagation();
    event.preventDefault();
    overlay.classList.remove("drag");
});
localFileInput.addEventListener("dragover", (event) => {
    event.stopPropagation();
    event.preventDefault();
    overlay.classList.add("drag");
});
localFileInput.addEventListener("drop", (event) => {
    event.stopPropagation();
    event.preventDefault();
    overlay.classList.remove("drag");
    localFileInput.files = event.dataTransfer.files;
    loadFile(event.dataTransfer.files[0]);
});

window.addEventListener("load", () => {
    if (
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPhone/i)
    ) {
        localFileInput.removeAttribute("accept");
    }
    overlay.classList.remove("hidden");
});

(async () => {
    const response = await fetch("swfs.json");

    if (response.ok) {
        const data = await response.json();
        for (const swfData of data.swfs) {
            const option = document.createElement("option");
            option.textContent = swfData.title;
            option.value = swfData.location;
            option.swfData = swfData;
            optionGroups[swfData.type].append(option);
        }
        fileInputContainer.classList.remove("hidden");
        fileInput.querySelectorAll("option").forEach((el) => {
            el.addEventListener("click", () => {
                if (el.value === "local") {
                    localFileInput.click();
                } else {
                    loadSample();
                }
            });
        });
    }

    const initialFile = new URL(window.location).searchParams.get("file");
    if (initialFile) {
        const options = Array.from(fileInput.options);
        fileInput.selectedIndex = Math.max(
            options.findIndex((swfData) => swfData.value.endsWith(initialFile)),
            0
        );
        loadSample();
    } else {
        load({
            url: "logo-anim.swf",
            autoplay: "on",
            backgroundColor: "#31497D",
            letterbox: "off",
            unmuteOverlay: "hidden",
        });
    }
})();
