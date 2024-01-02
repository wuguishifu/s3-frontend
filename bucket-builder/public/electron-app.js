import { app, BrowserWindow } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';

const basePath = app.getPath();
let window = null;

function createWindow() {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true
    });

    const startURL = isDev
        ? 'http://localhost:5173/'
        : `file://${path.join(basePath, 'dist/index.html')}`;
    window.loadURL(startURL);
    window.on('closed', () => window = null);
}

app.on('ready', () => {
    console.log('starting up');
    createWindow();
});

app.on('window-all-closed', () => {
    console.log('shutting down');
    app.quit();
});

app.on('will-quit', () => {
    console.log('shutting down');
    app.quit();
});