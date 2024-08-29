const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false, 
    },
  });

  mainWindow.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// IPC handler for listing directory contents
ipcMain.handle("list-directory", async (event, directoryPath) => {
  try {
    const files = await fs.promises.readdir(directoryPath, {
      withFileTypes: true,
    });
    return files.map((file) => ({
      name: file.name,
      isDirectory: file.isDirectory(),
    }));
  } catch (error) {
    throw new Error(`Unable to read directory: ${error.message}`);
  }
});
