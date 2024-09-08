// Initial setup for the directory manager

import { Directory_Manager } from "@/classes/DirectoryManager";
import { TextDisplay } from "@/classes/TextDisplay";
import README from "../txtFiles/README";

export function generateDirectory(): Directory_Manager {
  let directoryManager = new Directory_Manager();

  // root directory
  const root = directoryManager.createDirectory("root", "/");
  const home = root.makeDirectory("Users").makeDirectory("guest");
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
  const readMe = Doc.addFile("README.txt", false, false);
  readMe!.content = README;

  return directoryManager;
}
