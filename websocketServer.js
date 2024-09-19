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
      const electronDir = path.join(process.cwd(), "electron");

      let totalSteps = 10; // Define total steps for the build process (if you know them)
      let currentStep = 0;

      // Heartbeat every second to check if the connection is still alive
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
      const buildProcess = exec("npm run build", { cwd: electronDir });

      // Handle stdout data (progress output)
      buildProcess.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);

        if (data.includes("Compiling")) {
          currentStep += 1; // Example condition for tracking progress
        }

        const progressPercentage = Math.min(
          Math.floor((currentStep / totalSteps) * 100),
          100
        );

        // Send progress updates to the client
        ws.send(
          JSON.stringify({
            type: "progress",
            progress: progressPercentage,
            message: data,
          })
        );
      });

      // Handle stderr data (errors)
      buildProcess.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
        ws.send(
          JSON.stringify({
            type: "error",
            message: data,
          })
        );
      });

      // On process completion
      buildProcess.on("close", (code) => {
        console.log(`Build process exited with code ${code}`);

        if (code === 0) {
          ws.send(
            JSON.stringify({
              type: "complete",
              message: "Build completed successfully",
            })
          );

          // Now start sending the file to the client
          const filePath = path.join(
            electronDir,
            "dist",
            "win-unpacked",
            "the_terminal.exe"
          );

          // Check if the file exists before attempting to send
          if (fs.existsSync(filePath)) {
            // Send the file in chunks using fs.createReadStream
            const readStream = fs.createReadStream(filePath);

            // Send file chunks as binary data
            readStream.on("data", (chunk) => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(chunk); // Send binary file chunk
              }
            });

            // On file stream completion
            readStream.on("end", () => {
              console.log("File transfer complete");
              ws.send(JSON.stringify({ type: "file-transfer-complete" }));
              ws.close();
            });

            // Handle read stream errors
            readStream.on("error", (err) => {
              console.error("Error reading file:", err);
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Error reading the file",
                })
              );
              ws.close();
            });
          } else {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "File not found",
              })
            );
            ws.close();
          }
        } else {
          // Build failed
          ws.send(
            JSON.stringify({
              type: "error",
              message: `Build failed with exit code ${code}`,
            })
          );
          ws.close();
        }

        clearInterval(heartbeatInterval); // Stop the heartbeat once the build is complete
      });
    }
  });

  // Clean up when the WebSocket connection is closed
  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(heartbeatInterval); // Stop heartbeats
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
