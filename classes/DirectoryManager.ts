// Used to manage a terminal's directories

import { Dir_File, Directory } from "./Directory";
import { TextDisplay } from "./TextDisplay";

export class Directory_Manager {
  public directories: Directory[] = [];
  public currentDirectory: Directory;
  public currentPath: string = "/";
  public homeDirectory: Directory;
  public textDisplay: TextDisplay;

  constructor() {
    const root = this.createDirectory("root", "/");
    this.currentDirectory = root.makeDirectory("Users").makeDirectory("guest");
    this.homeDirectory = this.currentDirectory;
    this.currentPath = this.currentDirectory.path;

    const welcomeMessage = [
      "Welcome to the Terminal.",
      "Type 'help' to see a list of available commands.",
    ];

    this.textDisplay = new TextDisplay(this, welcomeMessage);
  }

  public createDirectory(name: string, path: string): Directory {
    const newDir = new Directory(this, name, path);
    this.directories.push(newDir);

    return newDir;
  }

  public addDirectoryToList(directory: Directory): void {
    this.directories.push(directory);
  }

  public removeDirectoryFromList(directory: Directory): void {
    this.directories.splice(this.directories.indexOf(directory), 1);
  }

  private sterilizePath(path: string, file: boolean = false): string {
    // Replaces \ with / for windows
    path = path?.replace(/\\/g, "/");

    // Replaces C:/ with /
    path = path.replace(/^([Cc]:\/)/, "/");

    // Adds "/" to the end  if not present
    if (!path?.endsWith("/")) {
      path = path + "/";
    }

    if (file) {
      path = path.slice(0, -1);
    }

    return path;
  }

  public getDirectory(
    directory: Directory | undefined,
    path: string
  ): Directory | undefined {
    // Checks for empty path
    if (!path || path == ".") {
      return directory;
    }

    // Finds home directory
    if (path == "~") {
      return this.homeDirectory;
    }

    // Finds previous directory
    if (path == "..") {
      path = directory!.path;

      // Gets second to "/" from the end
      let lastSlash = path?.lastIndexOf("/", path.length - 2);

      if (lastSlash === -1) {
        path = "/";
      }

      path = path?.slice(0, lastSlash! + 1);
    }

    // replaces \ with / for windows
    path = this.sterilizePath(path);

    // Look for relative directory
    const relativeDir = directory?.directories.find(
      (dir) => directory?.path + path === dir.path
    );
    if (relativeDir) {
      return relativeDir;
    }

    // Looks for directory from relative absolute path
    const altRelativeDir = this.directories.find(
      (dir) => dir.path === directory?.path + path
    );
    if (altRelativeDir) {
      return altRelativeDir;
    }

    // Looks for directory from absolute path
    const absoluteDir = this.directories.find((dir) => dir.path === path);
    if (absoluteDir) {
      return absoluteDir;
    }
    return undefined;
  }

  public getFile(
    directory: Directory | undefined,
    path: string
  ): Dir_File | undefined {
    path = this.sterilizePath(path, true);

    // Looks for the relative Directory if applicable
    if (path.includes("/")) {
      const directoryPath = path.slice(0, path.lastIndexOf("/") + 1);
      const directory = this.getDirectory(this.currentDirectory, directoryPath);
      if (directory) {
        return directory.files.find(
          (file) =>
            file.name + file.type === path.slice(path.lastIndexOf("/") + 1)
        );
      }
    }

    // Looks for the file from the current directory
    console.log(path);
    return directory?.files.find((file) => file.name + file.type === path || file.name === path);
  }
}
