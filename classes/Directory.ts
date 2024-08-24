// Collaborates heavily with userText.tsx and DirectoryManager.ts

import { getColor, getColorString } from "@/functions/color";
import { Directory_Manager } from "./DirectoryManager";
import { get } from "http";

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
  public ls(path: string | undefined): string[] {
    let dir: Directory | undefined = this;
    if (path) {
      dir = this.directoryManager.getDirectory(this, path);
    }

    if (!dir) {
      return [getColorString(`No directory at '${path}'`, getColor("error"))];
    }

    const sortedDirs = dir.directories.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const sortedFiles = dir.files.sort((a, b) => a.name.localeCompare(b.name));

    const dirStrings = sortedDirs.map((dir) => dir.toString());
    const fileStrings = sortedFiles.map((file) => file.toString());

    return [...dirStrings, ...fileStrings];
  }

  public addFile(file: Dir_File, userMalleable = false): void {
    this.files.push(file);
    file.userMalleable = userMalleable;
  }

  private validName(name: string): boolean {
    const textDisplay = this.directoryManager.textDisplay;
    if (!name || !/^[a-zA-Z0-9_()\-]*$/.test(name)) {
      textDisplay.addLines(getColorString("Invalid name", getColor("error")));
      return false;
    }
    return true;
  }

  private splitPathName(pathName: string): [Directory, string] {
    const path = pathName.slice(0, pathName.lastIndexOf("/") + 1);

    let name = pathName;
    if (path) {
      name = pathName.slice(pathName.lastIndexOf("/") + 1);
    }

    // Gets relative directory if applicable
    const pathDir = this.directoryManager.getDirectory(this, path) || this;

    return pathDir ? [pathDir, name] : [this, pathName];
  }

  public makeDirectory(pathName: string, userMalleable = false): Directory {
    const textDisplay = this.directoryManager.textDisplay;
    const [pathDir, name] = this.splitPathName(pathName);

    if (pathDir === this && name !== pathName) {
      textDisplay.addLines(getColorString("Invalid path", getColor("error")));
    }

    const existingDir = this.directoryManager.getDirectory(pathDir, name);

    // if name includes characters other than letters, numbers, _, (), or -
    if (!this.validName(name)) {
      return this;
    }

    if (existingDir) {
      textDisplay.addLines(
        getColorString(
          `Directory already exists at ${existingDir.path}`,
          getColor("error")
        )
      );
      return existingDir;
    }

    let newFolder = new Directory(
      pathDir.directoryManager,
      name,
      pathDir.path + name + "/"
    );
    newFolder.userMalleable = userMalleable;
    pathDir.directories.push(newFolder);
    pathDir.directoryManager.addDirectoryToList(newFolder);

    textDisplay?.addLines("Directory created");
    return newFolder;
  }

  public removeDirectory(pathName: string): void {
    const textDisplay = this.directoryManager.textDisplay;
    const [pathDir, name] = this.splitPathName(pathName);

    if (pathDir === this && name !== pathName) {
      textDisplay.addLines(getColorString("Invalid path", getColor("error")));
    }

    const dir = this.directoryManager.getDirectory(pathDir, name);

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

  private filePathToFile(filePath: string): Dir_File | undefined {
    let dir: Directory = this;
    let dirPath = this.path;
    let fileName = filePath;

    if (filePath.includes("/") || filePath.includes("\\")) {
      dirPath += filePath.slice(0, filePath.lastIndexOf("/") + 1);
      fileName = filePath.slice(filePath.lastIndexOf("/") + 1);
    }

    dir = this.directoryManager.getDirectory(this, dirPath) || this;

    return dir.files.find(
      (dirFile) =>
        dirFile.name + dirFile.type == fileName || dirFile.name == fileName
    );
  }

  public runFile(requestName: string): void {
    const textDisplay = this.directoryManager.textDisplay;
    const file = this.filePathToFile(requestName);

    if (file) {
      if (file.onRun) {
        textDisplay.addLines([`Running ${file.name}${file.type}...`]);
        file.onRun();
        return;
      }
    }

    textDisplay.addLines(getColorString("File not found", getColor("error")));
  }

  readFile(name: string): void {
    const textDisplay = this.directoryManager.textDisplay;
    const file = this.filePathToFile(name);

    if (!file) {
      textDisplay.addLines(
        getColorString(`File '${name}' found`, getColor("error"))
      );
      return;
    }

    textDisplay.addLines(file.content);
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
