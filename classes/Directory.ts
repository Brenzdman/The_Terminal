// Collaborates heavily with userText.tsx and DirectoryManager.ts

import { getColor, getColorString } from "@/functions/color";
import { Directory_Manager } from "./DirectoryManager";

export class Directory {
  public name: string;
  public files: Dir_File[] = [];
  public directories: Directory[] = [];
  public directoryManager: Directory_Manager;
  public userMalleable: boolean = false;
  public path: string;

  constructor(dm: Directory_Manager, name: string, path: string) {
    this.name = name;
    this.path = path;
    this.directoryManager = dm;
  }

  public toString(): string {
    return `[${getColor("dir")}${this.name}]`;
  }

  // Lists all files and directories in the current directory
  public ls(): string[] {
    const sortedDirs = this.directories.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const sortedFiles = this.files.sort((a, b) => a.name.localeCompare(b.name));

    const dirStrings = sortedDirs.map((dir) => dir.toString());
    const fileStrings = sortedFiles.map((file) => file.toString());

    return [...dirStrings, ...fileStrings];
  }

  public addFile(file: Dir_File, userMalleable = false): void {
    this.files.push(file);
    file.userMalleable = userMalleable;
  }

  public validName(name: string): boolean {
    const textDisplay = this.directoryManager.textDisplay;
    if (!name || !/^[a-zA-Z0-9_()\-]*$/.test(name)) {
      textDisplay.addLines(getColorString("Invalid name", getColor("error")));
      return false;
    }
    return true;
  }

  public makeDirectory(name: string, userMalleable = false): Directory {
    name = name?.trim();
    const dir = this.directoryManager.getDirectory(this, name);
    const textDisplay = this.directoryManager.textDisplay;

    // if name includes characters other than letters, numbers, _, (), or -
    if (!this.validName(name)) {
      return this;
    }

    if (dir) {
      textDisplay.addLines(
        getColorString("Directory already exists", getColor("error"))
      );
      return dir;
    }

    let newFolder = new Directory(
      this.directoryManager,
      name,
      this.path + name + "/"
    );
    newFolder.userMalleable = userMalleable;
    this.directories.push(newFolder);
    this.directoryManager.addDirectoryToList(newFolder);

    textDisplay?.addLines("Directory created");
    return newFolder;
  }

  public removeDirectory(path: string): void {
    const dir = this.directoryManager.getDirectory(this, path);
    const textDisplay = this.directoryManager.textDisplay;
    if (!dir) {
      textDisplay.addLines(
        getColorString("Directory not found", getColor("error"))
      );
      return;
    }

    if (!dir.userMalleable) {
      textDisplay.addLines(getColorString("ACCESS DENIED", getColor("error")));
      return;
    }

    this.directories.splice(this.directories.indexOf(dir), 1);
    this.directoryManager.removeDirectoryFromList(dir);
    textDisplay.addLines("Directory removed");
    return;
  }

  public rename(oldName: string, newName: string): void {
    const textDisplay = this.directoryManager.textDisplay;

    const dir = this.directoryManager.getDirectory(this, oldName);
    const file = this.directoryManager.getFile(this, oldName);

    if (!this.validName(newName)) {
      return;
    }

    if ((dir && !dir.userMalleable) || (file && !file.userMalleable)) {
      textDisplay.addLines(getColorString("ACCESS DENIED", getColor("error")));
      return;
    }

    if (file) {
      file.name = newName;
      textDisplay.addLines("File renamed");
      return;
    } else if (dir) {
      dir.name = newName;
      dir.path = dir.path.replace(new RegExp(oldName + "/"), newName + "/");
      textDisplay.addLines("Directory renamed");
      return;
    }

    textDisplay.addLines(getColorString("File not found", getColor("error")));
    return;
  }

  public cd(path: string): void {
    const textDisplay = this.directoryManager.textDisplay;

    const dir = this.directoryManager.getDirectory(this, path);
    if (!dir) {
      textDisplay.addLines(
        getColorString(
          `cd: no such file or directory at '${path}'`,
          getColor("error")
        )
      );
      return;
    }

    this.directoryManager.currentDirectory = dir;
    this.directoryManager.currentPath = dir.path;

    textDisplay.newLine();
  }

  public runFile(requestName: string): void {
    const textDisplay = this.directoryManager.textDisplay;

    // Alt way to run files in subdirectories
    let dir: Directory = this;
    if (requestName.includes("/") || requestName.includes("\\")) {
      dir = this.directoryManager.getDirectory(this, requestName) || this;
    }

    // Check if the file exists in dir
    const file = dir.files.find(
      (dirFile) =>
        dirFile.name + dirFile.type == requestName ||
        dirFile.name == requestName
    );

    if (file) {
      if (file.onRun) {
        textDisplay.addLines([`Running ${file.name}${file.type}...`]);
        file.onRun();
        return;
      }
    }

    textDisplay.addLines(getColorString("File not found", getColor("error")));
  }

  readFile(name: string): boolean {
    const textDisplay = this.directoryManager.textDisplay;
    let ran = false;
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      if (file.name + file.type !== name || file.type !== ".txt") {
        continue;
      }

      textDisplay.addLines([file.content]);
      ran = true;
    }
    return ran;
  }
}

export class Dir_File {
  public name: string;
  public content: string = "";
  public type: string = ".txt";
  public onRun: (() => void) | null = null;
  public userMalleable: boolean = false;

  constructor(name: string, type: string, onRun?: () => void) {
    this.name = name;
    this.type = type;
    this.onRun = onRun || null;
  }

  toString(): string {
    return `[${getColor(this.type)}${this.name}${this.type}]`;
  }
}
