import { Directory_Manager } from "@/classes/DirectoryManager";

declare global {
  interface Window {
    electron: {
      invoke: (arg0: string, arg1: string) => any;
    };
  }
}

let ipcRenderer: { invoke: (arg0: string, arg1: string) => any };
if (typeof window !== "undefined" && window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

export async function desktopLs(
  directoryPath: string,
  directoryManager: Directory_Manager
) {
  if (typeof window == "undefined" || !window.electron) {
    return;
  }

  console.log("Listing directory: ", directoryPath);

  const textDisplay = directoryManager.textDisplay;
  const directory = directoryManager.currentDirectory;
  const path = directoryManager.getDirectory(directory, directory.path)?.path;

  if (!path) {
    textDisplay.addLines(`Directory not found: ${path}`);
    return;
  }

  try {
    const files = await window.electron.invoke("list-directory", path);
    files.forEach((file: { isDirectory: any; name: any }) => {
      if (file.isDirectory) {
        directory.makeDirectory(file.name, true, true);
      } else if (file.name.includes(".")) {
        directory.addFile(file.name, true, true);
      }
    });
  } catch (error) {
    textDisplay.addLines(
      `Failed to list directory at path:${path}, run as administrator at your own risk for access. `
    );
  }
}
