import { Dir_File } from "@/classes/Directory";
import { start } from "./start";
import { Directory_Manager } from "@/classes/DirectoryManager";

export function generateDirectory(): Directory_Manager {
  let directoryManager = new Directory_Manager(true);
  let currentDirectory = directoryManager.currentDirectory;

  if (!currentDirectory) {
    throw new Error("Directory not found!");
  }

  const startFile = new Dir_File("start", ".exe", start);
  currentDirectory.addFile(startFile);

  const testFile = new Dir_File("test", ".txt");
  testFile.content = ["Hello World!"];
  currentDirectory.addFile(testFile);

  currentDirectory.makeDirectory("newDir");

  return directoryManager;
}
