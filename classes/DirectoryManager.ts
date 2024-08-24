// Used to manage a terminal's directories

import { Directory } from "./Directory";
import { TextDisplay } from "./TextDisplay";

export class Directory_Manager {
  public directories: Directory[] = [];
  public currentDirectory: Directory;
  public currentPath: string = "/";
  public homeDirectory: Directory;
  public textDisplay: TextDisplay;

  constructor() {
    const root = this.createDirectory("root", "/");
    this.currentDirectory = root.addDirectory("Users").addDirectory("guest");
    this.homeDirectory = this.currentDirectory;
    this.currentPath = this.currentDirectory.path;

    const welcomeMessage = [
      "Welcome to the Terminal.",
      "Type 'help' to see a list of available commands.",
    ];

    this.textDisplay = new TextDisplay(
      this,
      welcomeMessage
    );
  }

  public createDirectory(name: string, path: string): Directory {
    const newDir = new Directory(this, name, path);
    this.directories.push(newDir);

    return newDir;
  }

  public addDirectoryToList(directory: Directory): void {
    this.directories.push(directory);
  }

  public getDirectory(
    directory: Directory | undefined,
    path: string
  ): Directory | undefined {
    // replaces \ with / for windows
    path = path?.replace(/\\/g, "/");

    // Replaces C:/ with /
    path = path?.replace(/^C:/, "/");

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

    // Look for relative directory
    const relativeDir = directory?.directories.find((dir) => dir.name === path);
    if (relativeDir) {
      return relativeDir;
    }

    // Looks for directory with directory.path + path, alt relative path
    const relativeDirAlt = directory?.directories.find(
      (dir) => directory.path + dir.path === path
    );
    if (relativeDirAlt) {
      return relativeDirAlt;
    }

    // Looks for directory from absolute path
    const absoluteDir = this.directories.find(
      (dir) => dir.path === path || dir.path === path + "/"
    );
    if (absoluteDir) {
      return absoluteDir;
    }
    return undefined;
  }
}
