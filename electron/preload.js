// preload.js
const { contextBridge, ipcRenderer, remote } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  minimizeWindow: () => remote.getCurrentWindow().minimize(),
  maximizeWindow: () => {
    const window = remote.getCurrentWindow();
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  },
  closeWindow: () => remote.getCurrentWindow().close(),
  toggleFullScreen: () => ipcRenderer.send("toggle-fullscreen"),
});
