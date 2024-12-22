"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    openFileDialog: () => electron_1.ipcRenderer.invoke('dialog:openFile'),
    readFileContent: (filePath) => electron_1.ipcRenderer.invoke('file:readContent', filePath),
    saveFileDialog: (data) => electron_1.ipcRenderer.invoke('dialog:saveFile', data)
});
