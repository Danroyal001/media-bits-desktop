#!/usr/bin/env node
const { app, BrowserWindow, ipcMain, Tray, Menu, shell } = require('electron');
const { dialog } = require('electron/main');
const path = require('path');
const minWidth = 1000;
const minHeight = 600;
/**
   * add to app tray
   * @type Tray | any
   * */
let appTrayIcon = null;
const iconPath = path.join(__dirname, '..', 'rendererProcess', 'globalAssets', 'logo.png');
const httpServer = require('./http-server');

const openURL = url => {
  shell.openExternal(`${url}`)
      dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
        title: "Media-Bits",
        message: `Launching ${url} in default browser`,
        buttons: ['Ok'],
        normalizeAccessKeys: true
      });
};

const toolTip = 'Media-Bits - Next generation media streaming, projection, editing and video conferencing';
const trayButtons = [
  {
    label: "Media-Bits",
    click(){
      return BrowserWindow.getAllWindows()[BrowserWindow.getAllWindows().length - 1].focus();
    }
  },
  {
  label: 'New Window',
  click(){
    return createWindow();
    }
  },
  {
    type: "separator",
    role: "none"
  },
  {
    label: "Use Web version",
    click(){
      openURL("https://media-bits.web.app/editor")
    }
  },
  {
    label: "Relaunch",
    click(){
      app.relaunch()
      return app.quit();
    }
  },
  {
    label: "Check for Updates",
    click(){
      return require('update-electron-app')({
        repo: 'danroyal001/media-bits-desktop',
        logger: require('electron-log')
      })
    }
  },
  {
    type: "separator",
    role: "none"
  },
  {
    label: 'Go to Website',
    click(){
      return shell.openExternal('https://media-bits.web.app/')
    }
  },
  {
    label: 'Visit Documentation',
    click(){
      return shell.openExternal('https://media-bits.web.app/documentation')
    }
  },
  {
    label: 'Watch Tutorial Videos',
    click(){
      return shell.openExternal('https://media-bits.web.app/tutorial-videos')
    }
  },
  {
    type: "separator",
    role: "none"
  },
  {
    label: 'Quit / Exit',
    click(){
      app.quit();
      }
    }
];

httpServer(path.join(__dirname, '..','rendererProcess','windows','main'), 4515);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// handle minimize and maximize
ipcMain.on('minimize', e => (BrowserWindow.getFocusedWindow() || BrowserWindow.fromId(e.sender.id)).minimize())
ipcMain.on('maximize', e => {
  const win = BrowserWindow.getFocusedWindow() || BrowserWindow.fromId(e.sender.id)
  if(win.isMaximized()){
    win.unmaximize()
    win.setSize(minWidth, minHeight, true)
  } else win.maximize()
});

/**
   * Create the splash screen 
   * */
const showSplashScreen = () => {
  const splashScreenWidth = 550;
  const splashScreenHeight = 350;
  const splashScreen = new BrowserWindow({
    transparent: true,
    width: splashScreenWidth,
    height: splashScreenHeight,
    icon: iconPath,
    frame: false,
    center: true
  });
  //splashScreen.loadURL("file:///"+__dirname+"/../globalAssets/splash-screen.png");
  splashScreen.loadURL("file:///"+__dirname+"/../rendererProcess/windows/splashScreen/index.html");
  const id = "splash-screen";
  splashScreen.id = id;
  splashScreen.webContents.id = id; 
  splashScreen.menuBarVisible = false;
  splashScreen.setMinimumSize(splashScreenWidth, splashScreenHeight);
  splashScreen.setMaximumSize(splashScreenWidth, splashScreenHeight);
  splashScreen.setMaximizable(false);
  splashScreen.setMinimizable(false);
  splashScreen.setMovable(false);
  //splashScreen.setHasShadow(true);
  //splashScreen.setIgnoreMouseEvents(true);
  splashScreen.setAlwaysOnTop(true);
  // Set Thumbbar buttons on the taskbar thumbnail
  splashScreen.setThumbarButtons(trayButtons);
  splashScreen.isModal(true)
  return splashScreen;
  // end open splash-screen function
}


/**
 * creates a new app window
 * @param void @type void
 * */
const createWindow = () => {

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: minWidth,
    height: minHeight,
    icon: iconPath,
    frame: false,
    webPreferences: {
      scrollBounce: true,
      enableWebSQL: true,
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
      nativeWindowOpen: true,
      preload: path.join(__dirname, '..', 'rendererProcess', 'preload', 'index.js')
    }
  });

  // dist: 5555
  // dev: 8080
  mainWindow.loadURL("http://localhost:8080/editor");
  // set id to random float as string
  const id = `${(new Date()).getSeconds() + Math.random()}`;
  mainWindow.id = id;
  mainWindow.webContents.id = id;
  mainWindow.menuBarVisible = false;
  mainWindow.setBackgroundColor('#009688');
  mainWindow.setMinimumSize(minWidth, minHeight)
  mainWindow.maximize();
  mainWindow.setHasShadow(true);
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  // Set Thumbbar buttons on the taskbar thumbnail
  mainWindow.setThumbarButtons(trayButtons);
  // end open window function
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const splash = showSplashScreen();

  setTimeout(() => {
    createWindow();
    appTrayIcon = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate(trayButtons)
    appTrayIcon.setToolTip(toolTip);
    appTrayIcon.setContextMenu(contextMenu);
  }, 10000);

  setTimeout(() => {
    splash.close();
  }, 13000);

  });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (appTrayIcon) {
      appTrayIcon.destroy()
      appTrayIcon = null;
      app.quit();
      return process.exit(0);
    }
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
