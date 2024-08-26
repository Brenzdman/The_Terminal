import { Directory_Manager } from "@/classes/DirectoryManager";

export function generateDirectory(): Directory_Manager {
  let directoryManager = new Directory_Manager(true);
  let currentDirectory = directoryManager.currentDirectory;

  if (!currentDirectory) {
    throw new Error("Directory not found!");
  }

  currentDirectory.addFile("start.exe");

  const testFile = currentDirectory.addFile("test.txt");

  if (testFile) {
    testFile.content = ["Hello World!"];
  }

  currentDirectory.makeDirectory("newDir", true, true);

  return directoryManager;
}
