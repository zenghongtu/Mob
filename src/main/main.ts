import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  globalShortcut,
} from 'electron';
import * as electronReferer from 'electron-referer';
import * as path from 'path';
import * as url from 'url';
import { GLOBAL_SHORTCUT } from './config';

electronReferer('https://www.ximalaya.com/');

let mainWindow: Electron.BrowserWindow | null;
let forceQuit = false;

const template = [
  {
    label: '编辑',
    submenu: [
      {
        label: '剪切',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut',
      },
      {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
      },
      {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
      },
      {
        label: '全选',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall',
      },
    ],
  },
  {
    label: '查看',
    submenu: [
      {
        label: '重载',
        accelerator: 'CmdOrCtrl+R',
        click(item, focusedWindow) {
          if (focusedWindow) {
            if (focusedWindow.id === 1) {
              BrowserWindow.getAllWindows().forEach((win) => {
                if (win.id > 1) {
                  win.close();
                }
              });
            }
            focusedWindow.reload();
          }
        },
      },
      {
        label: '切换全屏',
        accelerator: (() => {
          if (process.platform === 'darwin') {
            return 'Ctrl+Command+F';
          } else {
            return 'F11';
          }
        })(),
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        },
      },
      {
        label: '切换开发者工具',
        accelerator: (() => {
          if (process.platform === 'darwin') {
            return 'Alt+Command+I';
          } else {
            return 'Ctrl+Shift+I';
          }
        })(),
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        },
      },
    ],
  },
  {
    label: '窗口',
    role: 'window',
    submenu: [
      {
        label: '最小化',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize',
      },
      {
        label: '关闭',
        accelerator: 'CmdOrCtrl+W',
        role: 'close',
      },
      {
        label: '退出',
        accelerator: 'Cmd+Q',
        role: 'quit',
      },
    ],
  },
];

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {
        label: `关于 ${app.getName()}`,
        role: 'about',
        accelerator: '',
        // click() {
        //   dialog.showMessageBox(mainWindow, { message: 'hello world' });
        // },
      },
    ],
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    minHeight: 600,
    minWidth: 800,
    width: 1040,
    height: 715,
    backgroundColor: 'white',
    titleBarStyle: 'hiddenInset',
    title: 'Mob',
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
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, './dist/renderer/index.html'),
        protocol: 'file:',
        slashes: true,
      }),
    );
  }
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('close', (e) => {
    if (forceQuit) {
      app.quit();
    } else {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.webContents.session.on('will-download', (e, item, webContents) => {
    const totalBytes = item.getTotalBytes();

    // todo fix (here can't get path if download by browser)
    const filePath = item.getSavePath();

    item.on('updated', () => {
      mainWindow.setProgressBar(item.getReceivedBytes() / totalBytes);
    });

    item.once('done', (e, state) => {
      if (!mainWindow.isDestroyed()) {
        mainWindow.setProgressBar(-1);
      }

      if (state === 'interrupted') {
        mainWindow.webContents.send('DOWNLOAD', { type: 'error' });
      }

      if (state === 'completed') {
        mainWindow.webContents.send('DOWNLOAD', { type: 'success', filePath });
        app.dock.downloadFinished(filePath);
      }
    });
  });
  Object.keys(GLOBAL_SHORTCUT).forEach((key) => {
    globalShortcut.register(key, () => {
      mainWindow.webContents.send('HOTKEY', GLOBAL_SHORTCUT[key]);
    });
  });
}

app.on('ready', () => {
  createWindow();

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (!mainWindow.isVisible()) {
    mainWindow.show();
  }
});

app.on('before-quit', (e) => {
  forceQuit = true;
  mainWindow = null;
});
