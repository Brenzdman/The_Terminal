import { join } from "path";
import fs from "fs";
import archiver from "archiver"; // Archiver is needed for zipping files

async function createZipPackage() {
  try {
    // Paths to the directories and files
    const desktopAppFolderPath = join(process.cwd(), "desktop-app/app");
    const exeFilePath = join(process.cwd(), "desktop-app/The_Terminal.exe");

    // Define the path to the zip file to be created in the public directory
    const publicDir = join(process.cwd(), "public");
    const zipPath = join(publicDir, "The_Terminal.zip");

    // Ensure the public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Zip the desktop-app/app folder and the exe file into one package
    const zipStartTime = Date.now();
    await zipFolder(desktopAppFolderPath, exeFilePath, zipPath);
    const zipEndTime = Date.now();
    console.log(`Zipping took ${zipEndTime - zipStartTime} ms`);

    console.log(`Package created at ${zipPath}`);
  } catch (error) {
    console.error("Error zipping app files:", error);
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

// Run the function
createZipPackage();
