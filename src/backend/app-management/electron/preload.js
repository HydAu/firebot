'use strict';

const { ipcRenderer } = require('electron');

const {
    version,
    isPackaged,
    locale,
    os
} = ipcRenderer.sendSync('preload.getAppDetails');

window.firebotAppDetails = {
    getVersion: () => version,
    version,
    isPackaged,
    getLocale: () => locale,
    locale,
    os,
    screens: () => ipcRenderer.sendSync('preload.app.getAllDisplays'),
    getAppPath: (...args) => ipcRenderer.sendSync('preload.app.getAppPath', ...args),
    getPath: (...args) => ipcRenderer.sendSync('preload.app.getPath', ...args)
};