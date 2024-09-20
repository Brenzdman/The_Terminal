import { exec } from "child_process";
import { promisify } from "util";
import { join } from "path";
import fs from "fs";

const execAsync = promisify(exec);

// Define the public/downloads directory
const publicDownloadsDir = join(process.cwd(), "public", "downloads");

// Ensure the public/downloads directory exists
if (!fs.existsSync(publicDownloadsDir)) {
  fs.mkdirSync(publicDownloadsDir, { recursive: true });
}

export default async function handler(req, res) {
  try {
    // Define your packaging command
    const command = `electron-packager . TheTerminal --platform=win32 --arch=x64 --icon=favicon.ico --out=${publicDownloadsDir} --overwrite`;

    // Run the packaging command in the electron directory
    await execAsync(command, { cwd: join(process.cwd(), "electron") });

    // Define the path to the zip file
    const zipPath = join(publicDownloadsDir, "The_Terminal.zip");

    // Create the zip file
    await zipFolder(join(publicDownloadsDir, "TheTerminal-win32-x64"), zipPath);

    // Respond with success message
    res.status(200).json({ message: "Packaging complete", zipPath });
  } catch (error) {
    console.error("Error packaging app:", error);
    res
      .status(500)
      .json({ message: "Error during packaging", error: error.message });
  }
}

// Function to zip the folder
async function zipFolder(source, out) {
  const archiver = require("archiver");
  const stream = fs.createWriteStream(out);
  const archive = archiver("zip", { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on("error", (err) => reject(err))
      .pipe(stream);

    stream.on("close", () => resolve());
    archive.finalize();
  });
}
