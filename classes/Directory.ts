// Collaborates heavily with userText.tsx and DirectoryManager.ts

import { errorMessage } from "@/functions/messages";
import { DirectoryManager } from "./DirectoryManager";
import { StyledText } from "./StyledText";

export class Directory {
  public name: string;
  public files: Dir_File[] = [];
  public directories: Directory[] = [];
  public directoryManager: DirectoryManager;
  public userMalleable: boolean = false;
  public path: string;

  constructor(dm: DirectoryManager, name: string, path: string) {
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
        errorMessage(textDisplay, "noDirAtPath", path);
        return;
      }
    }

    const sortedDirs = dir.directories.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const sortedFiles = dir.files.sort((a, b) => a.name.localeCompare(b.name));

    const dirStrings = sortedDirs.map((dir) => dir.toString());
    const fileStrings = sortedFiles.map((file) => file.toString());

    dirStrings.forEach((string) => {
      const line = textDisplay.addLines(string);
      line[0].text.addStyle(0, string.length, "dir");
    });

    fileStrings.forEach((string) => {
      const line = textDisplay.addLines(string);

      if (string.endsWith(".txt")) {
        line[0].text.addStyle(0, string.length, ".txt");
      }

      if (string.endsWith(".exe")) {
        line[0].text.addStyle(0, string.length, ".exe");
      }
    });
  }

  public addFile(
    pathSegment: string,
    userMalleable = false
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
      errorMessage(textDisplay, "fileAlreadyExists", file.toString());

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
      errorMessage(textDisplay, "invalidName", name);
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

  public makeDirectory(pathName: string, userMalleable = false): Directory {
    const textDisplay = this.directoryManager.textDisplay;
    const [pathDir, name] = this.splitPathName(pathName);

    if (pathDir === this && name !== pathName) {
      errorMessage(textDisplay, "invalidPath", pathName);
    }

    const existingDir = this.directoryManager.getDirectory(pathDir, name);

    // if name includes characters other than letters, numbers, _, (), or -
    if (!this.validName(name)) {
      return this;
    }

    if (existingDir) {
      errorMessage(textDisplay, "dirAlreadyExists", existingDir.toString());

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
      errorMessage(textDisplay, "invalidPath", pathName);
    }

    const dir = this.directoryManager.getDirectory(pathDir, name);
    if (!dir) {
      errorMessage(textDisplay, "noDirAtPath", pathName);
      return;
    }

    if (!dir.userMalleable) {
      errorMessage(textDisplay, "accessDenied", pathName);
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
      errorMessage(textDisplay, "invalidPath", pathName);
      return;
    }

    const dir = this.directoryManager.getDirectory(pathDir, name);
    const file = this.directoryManager.getFile(pathDir, name);

    if (!this.validName(newName)) {
      return;
    }

    if ((dir && !dir.userMalleable) || (file && !file.userMalleable)) {
      errorMessage(textDisplay, "accessDenied", pathName);
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

    errorMessage(textDisplay, "noDirOrFileAtPath", pathName);
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
      errorMessage(textDisplay, "noFileAtPath", sourcePath);
      return;
    }

    if (!sourceFile.userMalleable && move) {
      errorMessage(textDisplay, "accessDenied", sourcePath);
      return;
    }

    if (sourceFile.type != ".txt") {
      errorMessage(textDisplay, "invalidFileType", sourcePath);
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
      errorMessage(textDisplay, "accessDenied", destinationPath);
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
            errorMessage(textManager, "accessDenied", pathSegment);
            return;
          }

          const content: StyledText[] = [];
          segments.splice(0, segments.length - 2).forEach((segment) => {
            if (segment != ">") {
              content.push(new StyledText(segment));
            }
          });

          file.content = content;
          textManager.addLines(`Text echoed to ${file.name}.txt`);
          return;
        } else {
          errorMessage(textManager, "invalidFileType", pathSegment);
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
      errorMessage(textDisplay, "noDirAtPath", path);
      return;
    }

    this.directoryManager.currentDirectory = dir;
    this.directoryManager.currentPath = dir.path;
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
      errorMessage(textDisplay, "cannotRunFile", file.toString());
      return;
    }

    errorMessage(textDisplay, "noFileAtPath", requestName);
  }

  readFile(requestName: string): void {
    const textDisplay = this.directoryManager.textDisplay;
    const [dir, name] = this.splitPathName(requestName);
    const file = dir.getFile(name);

    if (!file) {
      errorMessage(textDisplay, "noFileAtPath", requestName);
      return;
    }

    textDisplay.addLines(file.content);
  }

  deleteFile(requestName: string): void {
    const textDisplay = this.directoryManager.textDisplay;
    const [dir, name] = this.splitPathName(requestName);
    const file = dir.getFile(name);

    if (!file) {
      errorMessage(textDisplay, "noFileAtPath", requestName);
      return;
    }

    if (!file.userMalleable) {
      errorMessage(textDisplay, "accessDenied", requestName);
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
  public content: StyledText[] = [];
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
