const { app, BrowserWindow } = require('electron');
const path = require('path');
// const httpServer = require('./http-server');

// httpServer('../rendererProcess/windows/main', 8085);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, '..', 'rendererProcess', 'globalAssets', 'logo.png'),
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      preload: path.join(__dirname, '..', 'rendererProcess', 'preload', 'index.js')
    }
  });

  // Object.values((await (new JSZip()).loadAsync($0.files[0])).files)[0]

  // mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.loadURL("http://localhost:8080/#/editor");
  mainWindow.menuBarVisible = false;
  mainWindow.setBackgroundColor('#009688');
  mainWindow.maximize();
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
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
