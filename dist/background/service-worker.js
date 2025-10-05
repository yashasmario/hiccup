/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!**************************************!*\
  !*** ./background/service-worker.ts ***!
  \**************************************/

// when the user clicks the extension icon:
chrome.action.onClicked.addListener(async (tab) => {
    if (!tab.url)
        return;
    const url = new URL(tab.url);
    await chrome.sidePanel.setOptions({
        tabId: tab.id,
        path: "sidepanel/sidepanel.html",
        enabled: true
    });
    if (tab.id) {
        await chrome.sidePanel.open({ tabId: tab.id });
    }
    // remember this origin for future visits
    await saveEnabledOrigin(url.origin);
    console.log(url.origin);
});
chrome.runtime.onMessage.addListener((message) => {
    if (message.type == "sp_Opened") {
        console.log("open MessageRecieved");
    }
    if (message.type == "sp_Closed") {
        console.log("close MessageRecieved");
    }
});
// list of origins where the user previously opened the side panel
async function saveEnabledOrigin(origin) {
    const enabledOrigins = await getEnabledOrigins();
    if (!enabledOrigins.includes(origin)) {
        enabledOrigins.push(origin);
        await chrome.storage.local.set({ enabledOrigins });
    }
}
async function getEnabledOrigins() {
    const data = await chrome.storage.local.get("enabledOrigins");
    return data.enabledOrigins || [];
}

/******/ })()
;
//# sourceMappingURL=service-worker.js.map