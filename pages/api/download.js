import { join } from "path";
import fs from "fs";

export default function handler(req, res) {
  try {
    // Path to the zip file in the public directory
    const zipFilePath = join(process.cwd(), "public", "The_Terminal.zip");

    // Check if the file exists
    if (!fs.existsSync(zipFilePath)) {
      res.status(404).json({ message: "File not found" });
      return;
    }

    // Set headers to indicate a file download
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=The_Terminal.zip`
    );

    // Create a read stream and pipe it to the response
    const fileStream = fs.createReadStream(zipFilePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error serving the zip file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
