const { exec } = require("child_process");

// Function to minimize or hide the window (if needed)
console.log("The Terminal that runs The_Terminal...");
minimizeWindow();
function minimizeWindow() {
  exec(
    "powershell -command \"$wshell = New-Object -ComObject wscript.shell; $wshell.AppActivate((Get-Process -Id $PID).MainWindowTitle); $wshell.SendKeys('% n')\"",
    (error) => {
      if (error) {
        console.error(`Error minimizing window: ${error.message}`);
      }
    }
  );
}

// Install Electron
const child = exec("npm install electron", { stdio: "inherit" });

child.on("close", (code) => {
  // Start the app
  const command = "cd app && npm start";
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
  });
});
