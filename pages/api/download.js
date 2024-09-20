import path, { join } from "path";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

export default async function handler(req, res) {
  // Call the packager function to package the app
  await packager();

  const filePath = path.resolve(".", "public/downloads/The_Terminal.zip");
  const stat = fs.statSync(filePath);

  res.setHeader("Content-Length", stat.size);
  res.setHeader("Content-Disposition", "attachment; filename=The_Terminal.zip");
  res.setHeader("Content-Type", "application/zip");

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);

  // Listen for the finish event to delete files and folders after sending
  res.on("finish", () => {
    const downloadsDir = path.resolve(".", "public/downloads");

    // Delete all files in the public/downloads directory
    fs.readdir(downloadsDir, (err, files) => {
      if (err) {
        console.error("Error reading downloads directory:", err);
        return;
      }

      files.forEach((file) => {
        const fileToDelete = path.join(downloadsDir, file);
        fs.lstat(fileToDelete, (err, stats) => {
          if (err) {
            console.error("Error getting file stats:", err);
            return;
          }

          if (stats.isDirectory()) {
            // Recursively delete the directory
            deleteFolder(fileToDelete);
          } else {
            // Delete the file
            fs.unlink(fileToDelete, (err) => {
              if (err) {
                console.error("Error deleting file:", err);
              } else {
                console.log(`Deleted file: ${fileToDelete}`);
              }
            });
          }
        });
      });
    });
  });
}

// Function to recursively delete a folder and its contents
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
    console.log(`Deleted folder: ${folderPath}`);
  }
}

export async function packager() {
  const execAsync = promisify(exec);
  // Define the public/downloads directory
  const publicDownloadsDir = join(process.cwd(), "public", "downloads");

  // Ensure the public/downloads directory exists
  if (!fs.existsSync(publicDownloadsDir)) {
    fs.mkdirSync(publicDownloadsDir, { recursive: true });
  }
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
    console.log("App packaged successfully");
  } catch (error) {
    console.error("Error packaging app:", error);
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
