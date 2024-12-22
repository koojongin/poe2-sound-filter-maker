import {app, BrowserWindow, dialog, ipcMain} from 'electron';
import * as path from 'path';
import * as fs from "fs";

let mainWindow: BrowserWindow | null = null;
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Preload 스크립트 경로
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            webSecurity: false
        },
    });

    // mainWindow.loadFile(path.join(__dirname, '../index.html'));
    mainWindow.loadURL('http://localhost:3000');

    mainWindow.on('closed', () => {
        mainWindow = null;//
    });
});

ipcMain.handle('dialog:openFile', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile']
    });
    return result.filePaths[0];
});

ipcMain.handle('file:readContent', async (event, filePath: string) => {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error(error);
        return null;
    }
});

ipcMain.handle('dialog:saveFile', async (event, {content}) => {
    const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: path.join(app.getPath('documents'), 'myfile.filter'),
    });
    if (result.canceled) {
        return; // 사용자가 취소한 경우
    }

    const filePath = result.filePath;
    // 선택한 경로에 텍스트 파일 저장
    fs.writeFileSync(filePath, content, 'utf-8');
    return filePath
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
