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
  requestFullScreen: () => ipcRenderer.send("request-fullscreen"),
  exitFullScreen: () => ipcRenderer.send("exit-fullscreen"),
  toggleFullScreen: () => {
    const window = remote.getCurrentWindow();
    if (window.isFullScreen()) {
      ipcRenderer.send("exit-fullscreen");
    } else {
      ipcRenderer.send("request-fullscreen");
    }
  },
});

window.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
      console.log("Requesting full screen");
      ipcRenderer.send("request-fullscreen");
    } else {
      console.log("Exiting full screen");
      ipcRenderer.send("exit-fullscreen");
    }
  });
});
