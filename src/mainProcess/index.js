const { app, BrowserWindow, ipcMain, Tray, Menu, desktopCapturer } = require('electron');
const path = require('path');
const minWidth = 1000;
const minHeight = 600;
let appTrayIcon = null;
const iconPath = path.join(__dirname, '..', 'rendererProcess', 'globalAssets', 'logo.png');
// const httpServer = require('./http-server');

// httpServer('../rendererProcess/windows/main', 8085);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// handle minimize and maximize
ipcMain.on('minimize', e => BrowserWindow.fromId(e.sender.id).minimize())
ipcMain.on('maximize', e => {
  const win = BrowserWindow.fromId(e.sender.id)
  if(win.isMaximized()){
    win.unmaximize()
    win.setSize(minWidth, minHeight, true)
  } else win.maximize()
});

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: minWidth,
    height: minHeight,
    icon: iconPath,
    frame: false,
    webPreferences: {
      scrollBounce: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      preload: path.join(__dirname, '..', 'rendererProcess', 'preload', 'index.js')
    }
  });

  // mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.loadURL("http://localhost:8080/#/editor");
  // set id to random float
  const id = Math.random();
  mainWindow.id = id;
  mainWindow.webContents.id = id;
  mainWindow.menuBarVisible = false;
  mainWindow.setBackgroundColor('#009688');
  mainWindow.setMinimumSize(minWidth, minHeight)
  mainWindow.maximize();
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  // end open window function
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  // add to app tray
  appTrayIcon = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
    label: 'New Window',
    click: () => {
      createWindow();
      }
    },
    {
      label: 'Quit / Exit',
      click: () => {
        app.quit();
        }
      }
  ])
  appTrayIcon.setToolTip('Media-Bits - Next generation media streaming, editing and video conferencing')
  appTrayIcon.setContextMenu(contextMenu)
  });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (appTrayIcon) {
      appTrayIcon.destroy()
      appTrayIcon = null;
    }
    app.quit();
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
