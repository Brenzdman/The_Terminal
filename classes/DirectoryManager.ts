// Used to manage a terminal's directories

import { Directory } from "./Directory";
import { TextDisplay } from "./TextDisplay";

export class Directory_Manager {
  public directories: Directory[] = [];
  public currentDirectory: Directory;
  public homeDirectory: Directory;
  public textDisplay: TextDisplay;

  constructor() {
    const root = this.createDirectory("root", "/");
    this.currentDirectory = root.addDirectory("Users").addDirectory("guest");
    this.homeDirectory = this.currentDirectory;

    const welcomeMessage = [
      "Welcome to the Terminal.",
      "Type 'help' to see a list of available commands.",
    ];

    this.textDisplay = new TextDisplay(
      this.currentDirectory.path,
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
    path = path.replace(/\\/g, "/");

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
    if (directory) {
      for (let i = 0; i < directory.directories.length; i++) {
        const dir = directory.directories[i];
        if (dir.name == path) {
          return dir;
        }
      }
    }

    // Looks for directory from path
    for (let i = 0; i < this.directories.length; i++) {
      const dir = this.directories[i];
      console.log(dir.path);
      if (dir.path === path || dir.path === path + "/") {
        return dir;
      }
    }
    return undefined;
  }
}
