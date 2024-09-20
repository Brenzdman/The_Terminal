import { Dir_File } from "@/classes/Directory";
import { DirectoryManager } from "@/classes/DirectoryManager";
import { saveAs } from "file-saver";

export const downloadEXE = new Dir_File("download", ".exe");

export function getDownloadOnRun(dm: DirectoryManager): () => void {
  return async function (): Promise<void> {
    await onRun(dm);
  };
}

async function onRun(dm: DirectoryManager) {
  const textDisplay = dm.textDisplay;
  try {
    const fileResponse = await fetch("/api/download"); // Adjust API endpoint for file download

    if (!fileResponse.ok) {
      throw new Error(`HTTP error! status: ${fileResponse.status}`);
    }

    const blob = await fileResponse.blob();
    saveAs(blob, "The_Terminal.zip");

    console.log("File saved successfully");
  } catch (error) {
    console.error("There was a problem with the operation:", error);
    textDisplay.addLines(`Error: ${error}`);
  }
}

// Optional: Implement polling or status checking for real-time progress updates if needed
