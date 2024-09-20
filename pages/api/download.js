import path from "path";
import fs from "fs";

export default function handler(req, res) {
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
