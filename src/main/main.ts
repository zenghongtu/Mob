import { app, BrowserWindow, ipcMain, Menu, globalShortcut } from 'electron';
import * as electronReferer from 'electron-referer';
import * as path from 'path';
import * as url from 'url';
import {
  DOWNLOAD,
  TRIGGER_HOTKEY,
  MODIFY_HOTKEY,
  DEFAULT_GLOBAL_SHORTCUT,
  GLOBAL_SHORTCUT,
  ENABLE_HOTKEY,
} from '../constants';
import { settings } from './db';
import { IModifyHotkeyArgs } from '../typings/message';

electronReferer('https://www.ximalaya.com/');

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36';

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

  mainWindow.webContents.setUserAgent(USER_AGENT);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:6008/#/');
    if (process.env.DEV_TOOLS) {
      mainWindow.webContents.openDevTools();
    }
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
        mainWindow.webContents.send(DOWNLOAD, { type: 'error' });
      }

      if (state === 'completed') {
        mainWindow.webContents.send(DOWNLOAD, { type: 'success', filePath });
        app.dock.downloadFinished(filePath);
      }
    });
  });

  /**
   * hotkey
   */
  const enableHotkey = settings.get(ENABLE_HOTKEY);
  if (enableHotkey) {
    const shortcuts = settings.get(GLOBAL_SHORTCUT);
    const curShortcuts =
      (shortcuts as typeof DEFAULT_GLOBAL_SHORTCUT) || DEFAULT_GLOBAL_SHORTCUT;
    registerHotkeys(curShortcuts);
  }
}

const registerHotkeys = (shortcuts) => {
  Object.keys(shortcuts).forEach((key) => {
    globalShortcut.register(key, () => {
      mainWindow.webContents.send(TRIGGER_HOTKEY, shortcuts[key]);
    });
  });
};

const handleModifyHotkey = (event, args: IModifyHotkeyArgs) => {
  const { type, payload } = args;
  let shortcuts;
  if (type === 'switch') {
    if (!payload) {
      globalShortcut.unregisterAll();
      return;
    }
    settings.set(ENABLE_HOTKEY, payload);
    shortcuts = settings.get(GLOBAL_SHORTCUT, DEFAULT_GLOBAL_SHORTCUT);
  } else {
    shortcuts = payload;
    settings.set(GLOBAL_SHORTCUT, shortcuts);
  }
  registerHotkeys(shortcuts);
};

ipcMain.on(MODIFY_HOTKEY, handleModifyHotkey);

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
