(() => {
    window.isElectron = true;
    window.electron = require('electron');
    window.appinstalled = window.appInstalled = true;
})();