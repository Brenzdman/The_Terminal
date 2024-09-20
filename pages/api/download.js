import path from "path";
import fs from "fs";

export default function handler(req, res) {
  const downloadsDir = process.cwd();
  const filePath = path.resolve(".", `${downloadsDir}/The_Terminal.zip`);
  const stat = fs.statSync(filePath);

  res.setHeader("Content-Length", stat.size);
  res.setHeader("Content-Disposition", "attachment; filename=The_Terminal.zip");
  res.setHeader("Content-Type", "application/zip");

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);

  // Listen for the finish event to delete files and folders after sending
  res.on("finish", () => {
    const downloadsDir = path.resolve(".", downloadsDir);

    // Delete zip file after sending
    fs.unlinkSync(filePath);
  });
}
