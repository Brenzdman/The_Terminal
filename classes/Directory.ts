// Collaborates heavily with userText.tsx and DirectoryManager.ts

import { getColor } from "@/functions/color";
import { Directory_Manager } from "./DirectoryManager";
import {
  accessDenied,
  cannotRunFile,
  dirAlreadyExists,
  fileAlreadyExists,
  invalidFileType,
  invalidName,
  invalidPath,
  noDirAtPath,
  noDirOrFileAtPath,
  noFileAtPath,
} from "@/functions/messages";

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
    return `${this.name}`;
  }

  // Lists all files and directories in the current directory
  public ls(path: string | undefined): void {
    const textDisplay = this.directoryManager.textDisplay;
    let dir: Directory | undefined = this;

    if (path) {
      dir = this.directoryManager.getDirectory(this, path);

      if (!dir) {
        noDirAtPath(textDisplay, path);
        return;
      }
    }

    const sortedDirs = dir.directories.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const sortedFiles = dir.files.sort((a, b) => a.name.localeCompare(b.name));

    const dirStrings = sortedDirs.map((dir) => dir.toString());
    const fileStrings = sortedFiles.map((file) => file.toString());

    textDisplay.addLines([...dirStrings, ...fileStrings]);
  }

  public addFile(
    pathSegment: string,
    userMalleable = false,
    suppressDialog: boolean = false
  ): Dir_File | undefined {
    const textDisplay = this.directoryManager.textDisplay;
    let [pathDir, name] = this.splitPathName(pathSegment);

    // Gets file type
    if (name.slice(name.length - 4, name.length - 3) != ".") {
      name += ".txt";
    }

    const type = name.slice(name.length - 4, name.length);
    name = name.slice(0, name.length - 4);

    if (!this.validName(name)) {
      return;
    }

    let file = this.directoryManager.getFile(pathDir, pathSegment);

    if (file) {
      if (!suppressDialog) {
        fileAlreadyExists(textDisplay, file);
      }

      return file;
    }

    file = new Dir_File(name, type);
    file.userMalleable = userMalleable;
    pathDir.files.push(file);

    return file;
  }

  private validName(name: string): boolean {
    const textDisplay = this.directoryManager.textDisplay;
    const invalidChars = /[\\/:*?"<>|]/;
    const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;

    if (
      !name ||
      invalidChars.test(name) ||
      reservedNames.test(name) ||
      name.endsWith(" ") ||
      name.endsWith(".")
    ) {
      invalidName(textDisplay, name);
      return false;
    }
    return true;
  }

  private splitPathName(pathName: string): [Directory, string] {
    if (!pathName) {
      return [this, ""];
    }

    const path = pathName.slice(0, pathName.lastIndexOf("/") + 1);

    let name = pathName;
    if (path) {
      name = pathName.slice(pathName.lastIndexOf("/") + 1);
    }

    // Gets relative directory if applicable
    const pathDir = this.directoryManager.getDirectory(this, path) || this;

    return pathDir ? [pathDir, name] : [this, pathName];
  }

  public makeDirectory(
    pathName: string,
    userMalleable = false,
    suppressDialog: boolean = false
  ): Directory {
    const textDisplay = this.directoryManager.textDisplay;
    const [pathDir, name] = this.splitPathName(pathName);

    if (pathDir === this && name !== pathName) {
      invalidPath(textDisplay, pathName);
    }

    const existingDir = this.directoryManager.getDirectory(pathDir, name);

    // if name includes characters other than letters, numbers, _, (), or -
    if (!this.validName(name)) {
      return this;
    }

    if (existingDir) {
      if (!suppressDialog) {
        dirAlreadyExists(textDisplay, existingDir.path);
      }
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

    if (!suppressDialog) textDisplay?.addLines("Directory created");
    return newFolder;
  }

  public removeDirectory(pathName: string): void {
    const textDisplay = this.directoryManager.textDisplay;
    const [pathDir, name] = this.splitPathName(pathName);

    if (pathDir === this && name !== pathName) {
      invalidPath(textDisplay, pathName);
    }

    const dir = this.directoryManager.getDirectory(pathDir, name);
    if (!dir) {
      noDirAtPath(textDisplay, pathName);
      return;
    }

    if (!dir.userMalleable) {
      accessDenied(textDisplay);
      return;
    }

    this.directories.splice(this.directories.indexOf(dir), 1);
    this.directoryManager.removeDirectoryFromList(dir);
    textDisplay.addLines("Directory removed");
    return;
  }

  public rename(pathName: string, newName: string): void {
    const textDisplay = this.directoryManager.textDisplay;
    const [pathDir, name] = this.splitPathName(pathName);

    if (pathDir === this && name !== pathName) {
      invalidPath(textDisplay, pathName);
      return;
    }

    const dir = this.directoryManager.getDirectory(pathDir, name);
    const file = this.directoryManager.getFile(pathDir, name);

    if (!this.validName(newName)) {
      return;
    }

    if ((dir && !dir.userMalleable) || (file && !file.userMalleable)) {
      accessDenied(textDisplay);
      return;
    }

    if (file) {
      file.name = newName;
      textDisplay.addLines("File renamed");
      return;
    } else if (dir) {
      dir.name = newName;
      dir.path = dir.path.replace(new RegExp(pathName + "/"), newName + "/");
      textDisplay.addLines("Directory renamed");
      return;
    }

    noDirOrFileAtPath(textDisplay, pathName);
    return;
  }

  public move(sourcePath: string, destinationPath: string): void {
    this.copy(sourcePath, destinationPath, true);
  }

  public copy(
    sourcePath: string,
    destinationPath: string,
    move: boolean = false
  ): void {
    const textDisplay = this.directoryManager.textDisplay;
    const [sourceDir, fileName] = this.splitPathName(sourcePath);
    const [destinationDir, destinationName] =
      this.splitPathName(destinationPath);

    const sourceFile = sourceDir.getFile(fileName);
    if (!sourceFile) {
      noFileAtPath(textDisplay, fileName);
      return;
    }

    if (!sourceFile.userMalleable && move) {
      accessDenied(textDisplay);
      return;
    }

    if (sourceFile.type != ".txt") {
      invalidFileType(textDisplay);
      return;
    }

    let destinationFile;
    // if destination path only
    if (!destinationName) {
      const newPath = destinationPath + sourceFile.name + sourceFile.type;
      destinationFile = this.addFile(newPath, true);
    }

    destinationFile = destinationDir.getFile(destinationName);

    if (!destinationFile) {
      // Attempts to make a new file if one doesn't exist
      destinationFile = this.addFile(destinationPath, true);

      if (!destinationFile) {
        return;
      }
    }

    if (!destinationFile.userMalleable) {
      accessDenied(textDisplay);
      return;
    }

    destinationFile.content = sourceFile.content;

    if (move) {
      sourceDir.files.splice(sourceDir.files.indexOf(sourceFile), 1);
      textDisplay.addLines(`File moved to ${destinationFile.name}.txt`);
      return;
    }

    textDisplay.addLines(`File copied to ${destinationFile.name}.txt`);
  }

  public echo(segments: string[]): void {
    const textManager = this.directoryManager.textDisplay;
    if (segments.length >= 2) {
      const pathSegment = segments[segments.length - 1];
      const previousSegment = segments[segments.length - 2];
      if (previousSegment == ">") {
        if (pathSegment.includes(".txt")) {
          let file = this.getFile(pathSegment);

          if (!file) {
            file = this.addFile(pathSegment, true);
            if (!file) return;
          }

          if (!file.userMalleable) {
            accessDenied(textManager);
            return;
          }

          file.content = segments.slice(0, segments.length - 2);
          textManager.addLines(`Text echoed to ${file.name}.txt`);
          return;
        } else {
          invalidFileType(textManager);
          return;
        }
      }
    }

    textManager.addLines(segments);
  }

  public cd(path: string): void {
    const textDisplay = this.directoryManager.textDisplay;

    const dir = this.directoryManager.getDirectory(this, path);
    if (!dir) {
      noDirOrFileAtPath(textDisplay, path);
      return;
    }

    this.directoryManager.currentDirectory = dir;
    this.directoryManager.currentPath = dir.path;
    textDisplay.newUserLine();
  }

  private getFile(fileName: string): Dir_File | undefined {
    return this.files.find((file) => file.name + file.type === fileName);
  }

  public runFile(requestName: string): void {
    const textDisplay = this.directoryManager.textDisplay;
    const [dir, name] = this.splitPathName(requestName);
    const file = dir.getFile(name);

    if (file) {
      if (file.onRun) {
        textDisplay.addLines(`Running ${file.name}${file.type}...`);
        file.onRun();
        return;
      }

      cannotRunFile(textDisplay, file);
      console.log(file);
      return;
    }

    noFileAtPath(textDisplay, dir.path + name);
  }

  readFile(requestName: string): void {
    const textDisplay = this.directoryManager.textDisplay;
    const [dir, name] = this.splitPathName(requestName);
    const file = dir.getFile(name);

    if (!file) {
      noFileAtPath(textDisplay, requestName);
      return;
    }

    textDisplay.addLines(file.content);
  }

  deleteFile(requestName: string): void {
    const textDisplay = this.directoryManager.textDisplay;
    const [dir, name] = this.splitPathName(requestName);
    const file = dir.getFile(name);

    if (!file) {
      noFileAtPath(textDisplay, requestName);
      return;
    }

    if (!file.userMalleable) {
      accessDenied(textDisplay);
      return;
    }

    dir.files.splice(dir.files.indexOf(file), 1);
    textDisplay.addLines(`File ${file.name}${file.type} deleted`);
  }

  clear(): void {
    this.directoryManager.textDisplay.clear();
  }
}

export class Dir_File {
  public name: string;
  public content: string[] = [];
  public type: string = ".txt";
  public onRun: (() => void) | null = null;
  public userMalleable: boolean = false;

  constructor(name: string, type: string, onRun?: () => void) {
    this.name = name;
    this.type = type;
    this.onRun = onRun || null;
  }

  toString(): string {
    return `${this.name}${this.type}`;
  }
}
