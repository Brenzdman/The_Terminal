// Initial setup for the directory manager

import { DirectoryManager } from "@/classes/DirectoryManager";
import { TextDisplay } from "@/classes/TextDisplay";
import poemFile1 from "../txtFiles/poem1";
import poemFile2 from "../txtFiles/poem2";
import { beginEXE, getOnRun } from "@/exeFiles/begin";
import { downloadEXE, getDownloadOnRun } from "@/exeFiles/download";

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
  const Downloads = home.makeDirectory("Downloads", false, true);
  home.makeDirectory("Pictures", false, true);
  home.makeDirectory("Music", false, true);

  // Initial print to the terminal
  const welcomeMessage = [
    "Welcome to The Terminal.",
    "Type `help` to see a list of available commands.",
  ];

  directoryManager.textDisplay = new TextDisplay(
    directoryManager,
    welcomeMessage
  );

  // Files
  let poem1 = Doc.addFile("poem1.txt", false, false);
  if (poem1) {
    Object.assign(poem1, poemFile1);
  }

  let poem2 = Doc.addFile("poem2.txt", false, false);
  if (poem2) {
    Object.assign(poem2, poemFile2);
  }

  let begin = root?.addFile("begin.exe", false, false);
  if (begin) {
    Object.assign(begin, beginEXE);
    begin.onRun = getOnRun(directoryManager, showPopup);
  }

  let download = Downloads.addFile("download.exe", false, false);

  if (download) {
    Object.assign(download, downloadEXE);
    download.onRun = getDownloadOnRun(directoryManager);
  }

  return directoryManager;
}
