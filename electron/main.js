const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: false,
    frame: false,
    icon: path.join(__dirname, "favicon.ico"), // Set the window icon
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  // electron-packager . TheTerminal --platform=win32 --arch=x64 --icon=favicon.ico

  // Load the website directly
  mainWindow.loadURL("https://cmdterminal.vercel.app");

  // Open the DevTools (optional)
  // mainWindow.webContents.openDevTools();

  // Add error handling for preload script
  mainWindow.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription) => {
      console.error(`Failed to load preload script: ${errorDescription}`);
    }
  );
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("request-fullscreen", () => {
  if (mainWindow) {
    mainWindow.setFullScreen(true);
  }
});

ipcMain.on("exit-fullscreen", () => {
  if (mainWindow) {
    mainWindow.setFullScreen(false);
  }
});
