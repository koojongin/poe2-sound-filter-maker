"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    openFile: async () => electron_1.ipcRenderer.invoke('dialog:openFile'),
});
