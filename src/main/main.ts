import { app, BrowserWindow, dialog } from 'electron';
import * as electronReferer from 'electron-referer';
import * as path from 'path';
import * as url from 'url';

electronReferer('https://www.ximalaya.com/');

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    minHeight: 600,
    minWidth: 800,
    width: 1024,
    height: 700,
    backgroundColor: 'white',
    titleBarStyle: 'hiddenInset',
    title: 'XiMa FM',
    frame: 'darwin' === process.platform,
    // icon: '',
    show: true,
    acceptFirstMouse: true,
    webPreferences: {
      webSecurity: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:6008/#/');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, './dist/renderer/index.html'),
        protocol: 'file:',
        slashes: true,
      }),
    );
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.session.on('will-download', (e, item, webContents) => {
    const totalBytes = item.getTotalBytes();

    const filePath = item.getSavePath();

    item.on('updated', () => {
      mainWindow.setProgressBar(item.getReceivedBytes() / totalBytes);
    });

    item.once('done', (e, state) => {
      if (!mainWindow.isDestroyed()) {
        mainWindow.setProgressBar(-1);
      }

      if (state === 'interrupted') {
        dialog.showErrorBox(
          '下载失败',
          `文件 ${item.getFilename()} 因为某些原因被中断下载!`,
        );
      }

      if (state === 'completed') {
        // todo add notification
        app.dock.downloadFinished(filePath);
      }
    });
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
