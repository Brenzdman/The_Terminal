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
  if (!window.electron) {
    return;
  }

  const textDisplay = directoryManager.textDisplay;
  const directoryPath = "C:/";
  console.log(`Listing directory: ${directoryPath}`); // Log the path

  try {
    const files = await window.electron.invoke("list-directory", directoryPath);
    files.forEach((file: { isDirectory: any; name: any }) => {
      textDisplay.addLines(
        `${file.isDirectory ? "[DIR]" : "[FILE]"} ${file.name}`
      );
    });
  } catch (error) {
    textDisplay.addLines(`Failed to list directory contents: ${error}`);
  }
}
