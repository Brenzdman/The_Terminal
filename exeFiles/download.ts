import { Dir_File } from "@/classes/Directory";
import { DirectoryManager } from "@/classes/DirectoryManager";
import { saveAs } from "file-saver";

export const downloadEXE = new Dir_File("download", ".exe");

export function getDownloadOnRun(dm: DirectoryManager): () => void {
  return async function (): Promise<void> {
    onRun(dm);
  };
}

async function onRun(dm: DirectoryManager) {
  const textDisplay = dm.textDisplay;
  try {
    // Trigger the build process via API
    // const buildResponse = await fetch("/api/package");

    // if (!buildResponse.ok) {
    //   throw new Error("Failed to start the build process");
    // }

    // Optionally, handle progress or status updates
    // For simplicity, you might want to wait a bit for the build to complete
    // You can implement a polling mechanism if needed

    // Wait for the build to complete and then download the file
    const fileResponse = await fetch("/api/package"); // Adjust API endpoint for file download
    if (!fileResponse.ok) {
      throw new Error("Failed to download the file");
    }

    const blob = await fileResponse.blob();
    saveAs(blob, "The_Terminal.zip"); // Save the file

    console.log("File saved successfully");
  } catch (error) {
    console.error("There was a problem with the operation:", error);
    textDisplay.addLines(`Error: ${error}`);
  }
}

// Optional: Implement polling or status checking for real-time progress updates if needed
