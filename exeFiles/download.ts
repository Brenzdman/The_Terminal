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
    // Establish WebSocket connection
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      ws.send("start-build"); // Trigger the build process
    };

    let heartbeats = 0;
    let progress = 0;
    const fileChunks: Blob[] = []; // Array to store file chunks

    ws.onmessage = (event) => {
      const isBinary = event.data instanceof Blob; // Ensure binary data type
      if (isBinary) {
        fileChunks.push(event.data); // Accumulate binary file chunks
      } else {
        const data = JSON.parse(event.data);

        if (data.type === "heartbeat") {
          heartbeats++;
        } else if (data.type === "progress") {
          progress = data.progress;
        } else if (data.type === "error") {
          console.error(`Error: ${data.message}`);
          textDisplay.addLines(`Error: ${data.message}`);
        } else if (data.type === "complete") {
          console.log("Build completed successfully");
          // Wait for the file transfer to complete before closing the WebSocket
        } else if (data.type === "file-transfer-complete") {
          console.log("File transfer complete");
          saveFile(fileChunks); // Trigger file save once the transfer is complete
          ws.close(); // Now close the WebSocket connection
        }

        // Update UI with the loading bar
        textDisplay.setLastLine(loadingBar(progress, heartbeats));
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
      textDisplay.newUserLine();
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      textDisplay.addLines(`Error: ${error}`);
    };
  } catch (error) {
    console.error("There was a problem with the WebSocket operation:", error);
  }
}

function loadingBar(progress: number, heartbeats: number) {
  const bar = Array.from({ length: 10 }, (_, i) => {
    return i < progress / 10 ? "█" : "░";
  }).join("");
  return `Progress: ${progress}% ${bar} Heartbeat: ${heartbeats}`;
}

function saveFile(fileChunks: Blob[]) {
  try {
    // Combine all the chunks into a single Blob
    const blob = new Blob(fileChunks, { type: "application/octet-stream" });

    // Save the file with a specific name
    saveAs(blob, "The_Terminal.zip");

    console.log("File saved successfully");
  } catch (error) {
    console.error("Error while saving file:", error);
  }
}
