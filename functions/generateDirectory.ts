import { Dir_File, Directory_Manager } from "@/classes/Directory";
import { start } from "./start";

export function generateDirectory(): Directory_Manager {
  let directoryManager = new Directory_Manager();
  let currentDirectory = directoryManager.currentDirectory;

  if (!currentDirectory) {
    throw new Error("Directory not found!");
  }

  const startFile = new Dir_File("start", ".exe", start);
  currentDirectory.addFile(startFile);

  const testFile = new Dir_File("test", ".txt");
  testFile.content = "Hello World!";
  currentDirectory.addFile(testFile);

  currentDirectory.addDirectory("newDir");

  return directoryManager;
}
