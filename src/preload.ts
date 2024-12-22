import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    openFile: async (): Promise<string | null> => ipcRenderer.invoke('dialog:openFile'),
});
