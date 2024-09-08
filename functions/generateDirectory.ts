// Initial setup for the directory manager

import { Directory_Manager } from "@/classes/DirectoryManager";
import { TextDisplay } from "@/classes/TextDisplay";

export function generateDirectory(): Directory_Manager {
  let directoryManager = new Directory_Manager();

  // root directory
  const root = directoryManager.createDirectory("root", "/");
  const home = root.makeDirectory("Users").makeDirectory("guest");
  directoryManager.currentDirectory = home;
  directoryManager.homeDirectory = home;
  directoryManager.currentPath = home.path;

  // home directories
  home.makeDirectory("Documents", false, true);
  home.makeDirectory("Downloads", false, true);
  home.makeDirectory("Pictures", false, true);
  home.makeDirectory("Music", false, true);
  let currentDirectory = directoryManager.currentDirectory;

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
  const startFile = currentDirectory.addFile("start.exe");
  const textDisplay = directoryManager.textDisplay;

  startFile!.onRun = () => {
    textDisplay.addLines("Hello World!");
    textDisplay.addLines("Hello World!");
    textDisplay.addLines("Hello World!");
    textDisplay.addLines("Hello World!");
  };

  const testFile = currentDirectory.addFile("test.txt");

  if (testFile) {
    testFile.content = ["Hello World!"];
  }

  return directoryManager;
}
