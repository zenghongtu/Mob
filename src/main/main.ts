import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  globalShortcut,
  systemPreferences,
} from 'electron';
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
  UPDATE_BACKGROUND_IMAGE,
  ENABLE_BACKGROUND_IMAGE,
  BACKGROUND_IMAGE_URL,
  UPDATE_THEME,
  THEME_URL,
  DEFAULT_MEDIA_SHORTCUT,
} from '../constants';
import { settings } from './db';
import {
  IModifyHotkeyArgs,
  IUploadBackgroundImage,
  IUpdateTheme,
} from '../typings/message';
import { copyFile, genUniqueKey } from './utils';
import * as fs from 'fs';

electronReferer('https://www.ximalaya.com/');

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36'; // tslint:disable-line

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

const isMac = 'darwin' === process.platform;
function createWindow() {
  const titleBarStyle = isMac ? 'hiddenInset' : 'default';
  mainWindow = new BrowserWindow({
    minHeight: 600,
    minWidth: 800,
    width: 1040,
    height: 715,
    backgroundColor: 'white',
    titleBarStyle,
    title: 'Mob',
    frame: !isMac,
    icon: path.join(__dirname, '../../build/icon.png'),
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

  if (isMac) {
    setTimeout(
      () => systemPreferences.isTrustedAccessibilityClient(true),
      1000,
    );
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('close', (e) => {
    if (forceQuit || !isMac) {
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

const registerHotkeys = (shortcuts, isRetry = false) => {
  // macOS. Loop check is trusted
  if (isMac) {
    const isTrusted = systemPreferences.isTrustedAccessibilityClient(false);
    if (!isTrusted) {
      setTimeout(() => registerHotkeys(shortcuts, true), 1000);
      // Don't repeat register shortcuts after retry failed
      if (isRetry) {
        return;
      }
    }
  }

  const newShortcuts = { ...DEFAULT_MEDIA_SHORTCUT, ...shortcuts };
  globalShortcut.unregisterAll();
  Object.keys(newShortcuts).forEach((key) => {
    globalShortcut.register(key, () => {
      mainWindow.webContents.send(TRIGGER_HOTKEY, newShortcuts[key]);
    });
  });
};

const handleModifyHotkey = (event, args: IModifyHotkeyArgs) => {
  const { type, payload } = args;
  let shortcuts;
  if (type === 'switch') {
    settings.set(ENABLE_HOTKEY, payload);
    if (!payload) {
      globalShortcut.unregisterAll();
      return;
    }
    shortcuts = settings.get(GLOBAL_SHORTCUT, DEFAULT_GLOBAL_SHORTCUT);
  } else {
    shortcuts = payload;
    settings.set(GLOBAL_SHORTCUT, shortcuts);
  }
  registerHotkeys(shortcuts);
  event.sender.send(MODIFY_HOTKEY, { type, status: 'success' });
};

ipcMain.on(MODIFY_HOTKEY, handleModifyHotkey);

/**
 * background-image
 */

const handleUploadBackgroundImage = (event, args: IUploadBackgroundImage) => {
  const { type, payload } = args;
  try {
    if (type === 'switch') {
      const enable = payload;
      settings.set(ENABLE_BACKGROUND_IMAGE, enable);
      event.sender.send(UPDATE_BACKGROUND_IMAGE, {
        type,
        payload: { enable, url: '' },
        status: 'success',
      });
    } else {
      const src = payload as string;
      const extName = path.extname(src);
      const bgImageName = genUniqueKey();
      const target = path.join(app.getPath('userData'), bgImageName + extName);
      copyFile(src, target);
      // get correct url
      const url = encodeURI(`file://${target}`);
      const prevImageUrl = settings.get(BACKGROUND_IMAGE_URL);
      if (prevImageUrl) {
        // get correct path
        const prevImagePath = decodeURI(prevImageUrl).slice(7);
        fs.unlink(prevImagePath, (err) => {
          if (err) {
            // tslint:disable-next-line:no-console
            console.error(err);
            return;
          }
        });
      }
      settings.set(BACKGROUND_IMAGE_URL, url);
      event.sender.send(UPDATE_BACKGROUND_IMAGE, {
        type,
        payload: { enable: true, url },
        status: 'success',
      });
    }
  } catch (e) {
    event.sender.send(UPDATE_BACKGROUND_IMAGE, { type, status: 'error' });
    // tslint:disable-next-line:no-console
    console.error('update background image error!');
  }
};
ipcMain.on(UPDATE_BACKGROUND_IMAGE, handleUploadBackgroundImage);

/**
 * update theme
 */
const handleUpdateTheme = (event, args: IUpdateTheme) => {
  const {
    type,
    payload: {
      content,
      params: { curTheme, nextTheme },
    },
  } = args;
  const cssFilename = genUniqueKey() + '.css';
  const output = path.join(app.getPath('userData'), cssFilename);
  const cc = {};
  Object.keys(curTheme).forEach((colorName) => {
    cc[curTheme[colorName]] = nextTheme[colorName];
  });
  const reg = new RegExp(Object.keys(cc).join('|'), 'g');

  const newContent = content.replace(reg, (matched) => {
    return cc[matched];
  });
  fs.writeFile(output, newContent, 'utf8', (error) => {
    if (error) {
      event.sender.send(UPDATE_THEME, {
        type,
        status: 'error',
        payload: { output },
      });
      return;
    }
    event.sender.send(UPDATE_THEME, {
      type,
      status: 'success',
      payload: { output, theme: nextTheme },
    });

    const prevThemeUrl = settings.get(THEME_URL);
    if (prevThemeUrl) {
      const prevThemePath = decodeURI(prevThemeUrl);
      fs.unlink(prevThemePath, (err) => {
        if (err) {
          // tslint:disable-next-line:no-console
          console.error(err);
          return;
        }
      });
    }
  });
};
ipcMain.on(UPDATE_THEME, handleUpdateTheme);

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
