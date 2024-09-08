// Used to manage a terminal's directories

import { Dir_File, Directory } from "./Directory";
import { TextDisplay } from "./TextDisplay";

export class Directory_Manager {
  public directories: Directory[] = [];
  public currentDirectory: Directory = new Directory(this, "root", "/");
  public currentPath: string = "/";
  public homeDirectory: Directory = this.currentDirectory;
  public textDisplay: TextDisplay = new TextDisplay(this);

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

  public sterilizePath(
    path: string,
    directory: Directory | undefined,
    file: boolean = false
  ): string {
    path = path.trim();
    // Replaces ~ with home path
    path = path.replace(/^~/, this.homeDirectory.path);
    
    // Replaces \ with / for windows

    path = path?.replace(/\\/g, "/");

    // Replaces C:/ with /
    path = path.replace(/^([Cc]:\/)/, "/");

    // Adds "/" to the end  if not present
    if (!path?.endsWith("/")) {
      path = path + "/";
    }

    // Removes duplicate "/"s if present
    for (let i = 0; i < path.length - 1; i++) {
      if (path[i] === "/" && path[i + 1] === "/") {
        path = path.slice(0, i) + path.slice(i + 1);
        i--;
      }
    }

    if (file) {
      path = path.slice(0, -1);
      path = path.replace(/^\/+/, "");
    }

    // handles ../ and similar
    let startPath = path.slice(0, path.indexOf("/") + 1);
    let isDotsOnly = /^[.]+$/.test(startPath.slice(0, -1));
    let numBack = 0;

    while (isDotsOnly && startPath.includes("../")) {
      numBack++;
      startPath = startPath.slice(1);
      isDotsOnly = /^[.]+$/.test(startPath.slice(0, -1));
    }

    if (numBack > 0) {
      let currentPath = directory?.path || "bad path";

      for (let i = 0; i < numBack; i++) {
        let lastSlash = currentPath.lastIndexOf("/", currentPath.length - 2);

        if (lastSlash === -1 || currentPath.length === 1) {
          currentPath = "bad path";
          break;
        }

        currentPath = currentPath.slice(0, lastSlash + 1);
      }

      path = currentPath;
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

    path = this.sterilizePath(path, directory);

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
    path = this.sterilizePath(path, directory, true);

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
    return directory?.files.find(
      (file) => file.name + file.type === path || file.name === path
    );
  }
}
