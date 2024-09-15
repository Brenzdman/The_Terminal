// Initial setup for the directory manager

import { DirectoryManager } from "@/classes/DirectoryManager";
import { TextDisplay } from "@/classes/TextDisplay";
import poem1text from "../txtFiles/poem1";

export function generateDirectory(): DirectoryManager {
  let directoryManager = new DirectoryManager();

  // root directory
  const root = directoryManager.getDirectory(
    directoryManager.currentDirectory,
    "/"
  );
  const home = root!.makeDirectory("Users").makeDirectory("guest");
  directoryManager.currentDirectory = home;
  directoryManager.homeDirectory = home;
  directoryManager.currentPath = home.path;

  // home directories
  const Doc = home.makeDirectory("Documents", false, true);
  home.makeDirectory("Downloads", false, true);
  home.makeDirectory("Pictures", false, true);
  home.makeDirectory("Music", false, true);

  // Initial print to the terminal
  const welcomeMessage = [
    "Welcome to the Terminal.",
    "Type 'help' to see a list of available commands.",
  ];

  directoryManager.textDisplay = new TextDisplay(
    directoryManager,
    welcomeMessage
  );

  // Files
  const poem1 = Doc.addFile("poem.txt", false, false);
  poem1!.content = poem1text;

  return directoryManager;
}
