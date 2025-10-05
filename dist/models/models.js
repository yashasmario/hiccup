/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*************************!*\
  !*** ./models/notes.ts ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Note: () => (/* binding */ Note),
/* harmony export */   addNote: () => (/* binding */ addNote)
/* harmony export */ });
class Note {
    constructor(title, folderID) {
        this.embedding = [];
        this.sites = [];
        this.content = "";
        this.title = title.trim();
        this.id = crypto.randomUUID();
        this.createdAt = Date.now();
        this.lastUpdate = Date.now();
        this.words = 0;
        if (folderID) {
            this.folderID = folderID;
            this.save(folderID);
        }
    }
    async save(folderID) {
        if (!this.folderID) {
            throw new Error("Missing Path");
        }
        await chrome.storage.local.set({
            [`${folderID}/meta_${this.id}`]: {
                id: this.id,
                title: this.title,
                createdAt: this.createdAt,
                lastUpdate: this.lastUpdate,
                words: this.words,
                embedding: this.embedding,
                sites: this.sites,
            }
        });
        this.folderID = folderID;
        await chrome.storage.local.set({
            [`${folderID}/content_${this.id}`]: this.content
        });
    }
    async getMeta() {
        const result = await chrome.storage.local.get(`${this.folderID}/meta_${this.id}`);
        return result[`${this.folderID}/meta_${this.id}`];
    }
    async getContent() {
        const result = await chrome.storage.local.get(`${this.folderID}/content_${this.id}`);
        return result[`${this.folderID}/content_${this.id}`];
    }
    async delete() {
        await chrome.storage.local.remove([
            `${this.folderID}/meta_${this.id}`,
            `${this.folderID}/content_${this.id}`
        ]);
    }
    update(content) {
        this.lastUpdate = Date.now();
        this.content = content;
        this.words = content.trim().split(/\s+/).length;
        if (this.folderID) {
            this.save(this.folderID);
        }
        else
            throw new Error("Missing Path");
    }
}
function addNote(title, path) {
    const note = new Note(title, path);
    return note.id;
}

/******/ })()
;
//# sourceMappingURL=models.js.map