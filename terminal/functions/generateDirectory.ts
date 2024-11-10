// Initial setup for the directory manager

import { DirectoryManager } from "@/classes/DirectoryManager";
import { TextDisplay } from "@/classes/TextDisplay";
import poemFile1 from "../txtFiles/poem1";
import poemFile2 from "../txtFiles/poem2";
import { introEXE, getOnRun } from "@/terminal/exeFiles/intro";
import { downloadEXE, getDownloadOnRun } from "@/terminal/exeFiles/download";
import { YouTubeEXE } from "@/terminal/exeFiles/YouTube";
import music_READ_ME from "@/terminal/txtFiles/music_READ_ME";

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
  const Doc = home.makeDirectory("Documents", false);
  const Downloads = home.makeDirectory("Downloads", false);
  const Videos = home.makeDirectory("Videos", false);
  const Music = home.makeDirectory("Music", false);

  // Initial print to the terminal
  const welcomeMessage = [
    "Welcome to the Terminal.",
    "Type `help` to see a list of available commands.",
  ];

  directoryManager.textDisplay = new TextDisplay(
    directoryManager,
    welcomeMessage
  );

  // Files
  // let poem1 = Doc.addFile("poem1.txt", false);
  // Object.assign(poem1!, poemFile1);

  // let poem2 = Doc.addFile("poem2.txt", false);
  // Object.assign(poem2!, poemFile2);

  let intro = root?.addFile("intro.exe", false);
  Object.assign(intro!, introEXE);
  intro!.onRun = getOnRun(directoryManager, showPopup);

  let musicREAD_ME = Music.addFile("READ_ME.txt", false);
  Object.assign(musicREAD_ME!, music_READ_ME);

  let download = Downloads.addFile("download.exe", false);
  Object.assign(download!, downloadEXE);
  download!.onRun = getDownloadOnRun(directoryManager);

  let YouTube = Videos.addFile("YouTube.exe", false);
  Object.assign(YouTube!, YouTubeEXE);

  return directoryManager;
}
