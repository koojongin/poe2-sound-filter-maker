import {contextBridge, ipcRenderer} from 'electron';

declare global {
    interface Window {
        electron: {
            readFileContent: (filePath: string) => Promise<string>;
            openFileDialog: () => Promise<any>
            saveFileDialog: (data: any) => Promise<any>
        };
    }
}

contextBridge.exposeInMainWorld('electron', {
    openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
    readFileContent: (filePath: string) => ipcRenderer.invoke('file:readContent', filePath),
    saveFileDialog: (data: { content: any }) =>
        ipcRenderer.invoke('dialog:saveFile', data)
});
