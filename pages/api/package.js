import { exec } from "child_process";
import { promisify } from "util";
import { join } from "path";
import fs from "fs";
import archiver from "archiver"; // Archiver is needed for zipping files

const execAsync = promisify(exec);

// Use Vercel's /tmp directory for temporary storage
const tempDir = "/tmp";

// Ensure the /tmp directory exists (it should exist by default, but double-check)
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

export default async function handler(req, res) {
  try {
    // Path to the desktop-app folder you want to zip
    const desktopAppFolderPath = join(process.cwd(), "desktop-app/app");

    // Path to the script.js file inside the desktop-app folder
    const scriptJsPath = join(process.cwd(), "desktop-app/script.js");

    // Define the path to the new executable
    const exeFilePath = join(tempDir, "The_Terminal.exe");

    // Compile script.js into The_Terminal.exe using pkg with debug flag
    await execAsync(
      `npm_config_cache=${tempDir}/.npm npx pkg --debug ${scriptJsPath} --targets node16-win-x64 --output ${exeFilePath}`
    );

    // Check if the executable was created
    if (!fs.existsSync(exeFilePath)) {
      throw new Error(`Executable not found at ${exeFilePath}`);
    }

    // Define the path to the zip file to be created
    const zipPath = join(tempDir, "The_Terminal.zip");

    // Zip the desktop-app/app folder and the exe file into one package
    await zipFolder(desktopAppFolderPath, exeFilePath, zipPath);

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
      fs.unlinkSync(exeFilePath);
    });
  } catch (error) {
    console.error("Error zipping app files:", error);
    res
      .status(500)
      .json({ message: "Error during zipping", error: error.message });
  }
}

// Function to zip the folder (including desktop-app/app folder and exe file)
async function zipFolder(desktopAppFolderPath, exeFilePath, out) {
  const stream = fs.createWriteStream(out);
  const archive = archiver("zip", { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    archive
      // Add the desktop-app/app folder to the zip
      .directory(desktopAppFolderPath, "app")
      // Add the executable to the zip
      .file(exeFilePath, { name: "The_Terminal.exe" })
      .on("error", (err) => reject(err))
      .pipe(stream);

    stream.on("close", () => resolve());
    archive.finalize();
  });
}
