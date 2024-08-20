import { Dir_File, Directory, Directory_Manager } from "@/classes/Directory";
import { start } from "./start";

export function generateDirectory(): Directory_Manager {
  let directoryManager = new Directory_Manager();
  let root = directoryManager.getDirectory(null, "/");

  if (!root) {
    throw new Error("Root directory not found");
  }

  const startFile = new Dir_File("start", ".exe", start);
  root.addFile(startFile);

  const testFile = new Dir_File("test", ".txt");
  testFile.content = "Hello World!";
  root.addFile(testFile);

  root.addDirectory("newDir");

  return directoryManager;
}
