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

  public addFile(
    pathSegment: string,
    userMalleable = false
  ): Dir_File | undefined {
    const textDisplay = this.directoryManager.textDisplay;
    let [pathDir, name] = this.splitPathName(pathSegment);
    name = pathSegment.slice(0, pathSegment.length - 4);
    const type = pathSegment.slice(pathSegment.length - 4);

    if (!this.validName(name)) {
      return;
    }

    let file = this.directoryManager.getFile(pathDir, pathSegment);

    if (file) {
      textDisplay.addLines(
        getColorString(
          `File already exists at ${file.name}${file.type}`,
          getColor("error")
        )
      );

      return file;
    }

    file = new Dir_File(name, type);
    file.userMalleable = userMalleable;
    pathDir.files.push(file);

    return file;
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

  public rename(pathName: string, newName: string): void {
    const textDisplay = this.directoryManager.textDisplay;
    const [pathDir, name] = this.splitPathName(pathName);

    if (pathDir === this && name !== pathName) {
      textDisplay.addLines(getColorString("Invalid path", getColor("error")));
    }

    const dir = this.directoryManager.getDirectory(pathDir, name);
    const file = this.directoryManager.getFile(pathDir, name);

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
      dir.path = dir.path.replace(new RegExp(pathName + "/"), newName + "/");
      textDisplay.addLines("Directory renamed");
      return;
    }

    textDisplay.addLines(getColorString("File not found", getColor("error")));
    return;
  }

  public copy(sourcePath: string, destinationPath: string): void {
    const textDisplay = this.directoryManager.textDisplay;
    const [sourceDir, fileName] = this.splitPathName(sourcePath);
    const [destinationDir, destinationName] =
      this.splitPathName(destinationPath);

    const sourceFile = sourceDir.getFile(fileName);
    if (!sourceFile) {
      textDisplay.addLines(getColorString("File not found", getColor("error")));
      return;
    }

    if (sourceFile.type != ".txt") {
      textDisplay.addLines(
        getColorString("Can only copy .txt files", getColor("error"))
      );
      return;
    }

    let destinationFile = destinationDir.getFile(destinationName);

    if (!destinationFile) {
      // Attempts to make a new file if one doesn't exist
      destinationFile = this.addFile(destinationPath, true);

      if (!destinationFile) {
        return;
      }
    }

    if (!destinationFile.userMalleable) {
      console.log(destinationFile);
      textDisplay.addLines(getColorString("ACCESS DENIED", getColor("error")));
      return;
    }

    destinationFile.content = sourceFile.content;
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
            textManager.addLines(
              getColorString("ACCESS DENIED", getColor("error"))
            );
            return;
          }

          file.content = segments.slice(0, segments.length - 2);
          textManager.addLines(`Text echoed to ${file.name}.txt`);
          return;
        } else {
          textManager.addLines(
            getColorString(
              "echo > only works with txt files.",
              getColor("error")
            )
          );
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

  private getFile(fileName: string): Dir_File | undefined {
    return this.files.find(
      (dirFile) =>
        dirFile.name + dirFile.type == fileName || dirFile.name == fileName
    );
  }

  public runFile(requestName: string): void {
    const textDisplay = this.directoryManager.textDisplay;
    const [dir, name] = this.splitPathName(requestName);
    const file = dir.getFile(name);

    if (file) {
      if (file.onRun) {
        textDisplay.addLines([`Running ${file.name}${file.type}...`]);
        file.onRun();
        return;
      }
    }

    textDisplay.addLines(getColorString("File not found", getColor("error")));
  }

  readFile(requestName: string): void {
    const textDisplay = this.directoryManager.textDisplay;
    const [dir, name] = this.splitPathName(requestName);
    const file = dir.getFile(name);

    if (!file) {
      textDisplay.addLines(
        getColorString(
          `File '${name}' not found at path ${dir.path}`,
          getColor("error")
        )
      );
      return;
    }

    textDisplay.addLines(file.content);
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
    return `[${getColor(this.type)}${this.name}${this.type}]`;
  }
}
