const { exec } = require("child_process");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

// Function to minimize or hide the window (if needed)
console.log("The Terminal that runs The_Terminal...");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

// Function to prompt the user to install npm manually
function promptUserToInstallNpm() {
  console.log("node not found.");
  console.log(
    "Please install node by following the instructions at `https://nodejs.org/en/download/package-manager`"
  );

  rl.question("Press Enter after installing npm...", () => {
    checkForElectron();
  });
}

function runCMD() {
  rl.question("", (cmd) => {
    const installProcess = exec(cmd);

    installProcess.stdout.on("data", (data) => {
      console.log(data);
    });

    installProcess.stderr.on("data", (data) => {
      console.error(data);
    });

    installProcess.on("close", (code) => {
      if (
        fs.existsSync(path.join(__dirname, "node_modules", ".bin", "electron"))
      ) {
        rl.close();
        checkForElectron();
      } else {
        runCMD();
      }
    });
  });
}

// Function to prompt the user to install Electron manually
function promptUserForElectronInstallation() {
  console.log("Electron not found");
  console.log("Please install Electron by running `npm install electron`");
  console.log("");

  runCMD();
}

// Function to start the app with Electron
function startApp() {
  const command = `npm start`;
  const appProcess = exec(command, (error) => {
    if (error) {
      console.error(`Error starting app: ${error.message}`);
      return false;
    }
  });

  appProcess.on("close", (code) => {
    console.log(`App process exited with code ${code}`);
    rl.close();
    process.exit(0); // Close the terminal
  });

  return true;
}

// Function to check for Electron installation
function checkForElectron() {
  // if the start cmd works
  if (!startApp()) {
    promptUserForElectronInstallation();
  } else {
    console.log("Running The_Terminal...");
    minimizeWindow();
  }
}

// Check if npm is installed
exec("npm -v", (error, stdout, stderr) => {
  if (error) {
    console.error(`npm is not installed: ${error.message}`);
    promptUserToInstallNpm();
    return;
  }

  console.log(`npm version: ${stdout}`);
  checkForElectron();
});
