const WebSocket = require("ws");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  let heartbeatInterval;

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);

    if (message == "start-build") {
      let totalSteps = 5; // Define total steps for the build process
      let currentStep = 0;

      // Heartbeat every second
      heartbeatInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: "heartbeat",
              message: "Connection is alive",
            })
          );
        }
      }, 1000);

      // Start the build process
      const buildProcess = exec("npm run package", { cwd: process.cwd() });

      buildProcess.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);

        currentStep += 1;

        const progressPercentage = Math.min(
          Math.floor((currentStep / totalSteps) * 100),
          100
        );

        ws.send(
          JSON.stringify({
            type: "progress",
            progress: progressPercentage,
            message: data,
          })
        );
      });

      buildProcess.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
        ws.send(
          JSON.stringify({
            type: "error",
            message: data,
          })
        );
      });

      buildProcess.on("close", (code) => {
        console.log(`Build process exited with code ${code}`);

        if (code === 0) {
          ws.send(
            JSON.stringify({
              type: "complete",
              message: "Build completed successfully",
            })
          );

          // Send the The_Terminal.zip file
          const zipPath = path.join(
            process.cwd(),
            "electron",
            "The_Terminal.zip"
          );

          // Check if the zip file exists
          if (fs.existsSync(zipPath)) {
            const readStream = fs.createReadStream(zipPath);

            readStream.on("data", (chunk) => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(chunk, { binary: true }); // Send binary data
              }
            });

            readStream.on("end", () => {
              console.log("File transfer complete");
              ws.send(JSON.stringify({ type: "file-transfer-complete" }));

              // Delete the folder and zip file
              deleteFolder(
                path.join(process.cwd(), "electron", "The_Terminal")
              );
              fs.unlinkSync(zipPath);
              console.log("Deleted The_Terminal folder and zip file");
            });

            readStream.on("error", (err) => {
              console.error("Error reading zip file:", err);
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Error reading zip file",
                })
              );
            });
          } else {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "The_Terminal.zip not found",
              })
            );
          }
        } else {
          ws.send(
            JSON.stringify({
              type: "error",
              message: `Build failed with exit code ${code}`,
            })
          );
        }

        clearInterval(heartbeatInterval); // Stop heartbeat after build completes
      });
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(heartbeatInterval); // Stop heartbeats
  });
});

console.log("WebSocket server is running on ws://localhost:8080");

// Function to delete a folder and its contents
function deleteFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolder(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}
