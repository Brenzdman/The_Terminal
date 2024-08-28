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


  mainWindow.loadURL("http://localhost:3000"); // or your production URL
}

// Function to list directory contents
function listDirectory(directoryPath) {
  return fs.readdirSync(directoryPath).map((file) => {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);
    return {
      name: file,
      isDirectory: stats.isDirectory(),
    };
  });
}

// IPC listener for 'list-directory' event
ipcMain.handle("list-directory", (event, directoryPath) => {
  return listDirectory(directoryPath);
});

app.on("ready", createWindow);
