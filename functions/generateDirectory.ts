// Initial setup for the directory manager

import { DirectoryManager } from "@/classes/DirectoryManager";
import { TextDisplay } from "@/classes/TextDisplay";
import poemFile from "../txtFiles/poem1";
import { beginEXE, getOnRun } from "@/exeFiles/begin";

export function generateDirectory(
  showPopup: (arg0: any, arg1: any) => void
): DirectoryManager {
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
  let poem1 = Doc.addFile("poem.txt", false, false);
  if (poem1) {
    Object.assign(poem1, poemFile);
  }

  let begin = root?.addFile("begin.exe", false, false);
  if (begin) {
    Object.assign(begin, beginEXE);
    begin.onRun = getOnRun(directoryManager, showPopup);
  }

  return directoryManager;
}
