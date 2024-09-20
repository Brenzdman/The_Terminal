import { exec } from "child_process";
import { promisify } from "util";
import { join } from "path";
import fs from "fs";
import { version as electronVersion } from "electron/package.json"; // Import Electron version

const execAsync = promisify(exec);

// Use Vercel's /tmp directory for temporary storage
const downloadDir = "/tmp"; // Vercel allows writing here during execution

// Ensure the /tmp directory exists (it should exist by default, but double-check)
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

export default async function handler(req, res) {
  try {
    // Define your packaging command using npx and specify the Electron version
    const command = `npx electron-packager . TheTerminal --platform=win32 --arch=x64 --icon=favicon.ico --out=${downloadDir} --overwrite --electron-version=${electronVersion}`;

    // Run the packaging command in the electron directory
    await execAsync(command, { cwd: join(process.cwd(), "electron") });

    // Define the path to the zip file
    const zipPath = join(downloadDir, "The_Terminal.zip");

    // Create the zip file
    await zipFolder(join(downloadDir, "TheTerminal-win32-x64"), zipPath);

    // Respond by sending the file as a download
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=The_Terminal.zip`
    );
    const fileStream = fs.createReadStream(zipPath);
    fileStream.pipe(res);

    fileStream.on("close", () => {
      // After the file is served, delete the zip file and other temporary files
      fs.unlinkSync(zipPath);
      fs.rmdirSync(join(downloadDir, "TheTerminal-win32-x64"), {
        recursive: true,
      });
    });
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
