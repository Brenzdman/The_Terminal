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

export async function startElectron(directoryManager: Directory_Manager) {
  await getFiles("/", directoryManager);
}

async function getFiles(
  directoryPath: string,
  directoryManager: Directory_Manager
) {
  if (typeof window == "undefined" || !window.electron) {
    return;
  }

  const textDisplay = directoryManager.textDisplay;
  const directory = directoryManager.currentDirectory;

  try {
    const files = await window.electron.invoke("list-directory", directoryPath);
    files.forEach((file: { isDirectory: any; name: any }) => {
      if (file.isDirectory) {
        directory.makeDirectory(file.name, true, true);
      } else if (file.name.includes(".")) {
        directory.addFile(file.name, true);
      }
    });
  } catch (error) {
    textDisplay.addLines(
      `Failed to list directory, run as administrator at your own risk for access. `
    );
  }
}
