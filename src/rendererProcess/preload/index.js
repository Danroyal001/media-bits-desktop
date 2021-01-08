(() => {
    window.isElectron = true;
    window.electron = require('electron');
    window.appinstalled = window.appInstalled = true;
    window.minimize = () => window.electron.ipcRenderer.send('minimize');
    window.unmaximize = () => window.electron.ipcRenderer.send('unmaximize');
    window.maximize = () => window.electron.ipcRenderer.send('maximize');
    window.__dirname = __dirname;
    window.__filename = __filename;
})();