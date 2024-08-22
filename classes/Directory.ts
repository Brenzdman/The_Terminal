import { getColor, getColorString } from "@/functions/color";
import { TextDisplay } from "./TextDisplay";
import { get } from "http";

export class Directory_Manager {
  public directories: Directory[] = [];
  public currentDirectory: Directory;
  public homeDirectory: Directory;

  constructor() {
    let root = this.createDirectory("root", "/");
    this.currentDirectory = root.addDirectory("Users").addDirectory("guest");
    this.homeDirectory = this.currentDirectory;
  }

  public createDirectory(name: string, path: string): Directory {
    let newDir = new Directory(this, name, path);
    this.directories.push(newDir);
    return newDir;
  }

  public getDirectory(
    directory: Directory | null,
    path: string
  ): Directory | null {
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

    for (let i = 0; i < this.directories.length; i++) {
      const dir = this.directories[i];
      console.log(dir.path);
      if (dir.path === path || dir.path === path + "/") {
        return dir;
      }
    }
    return null;
  }
}

export class Directory {
  public name: string;
  public files: Dir_File[] = [];
  public directories: Directory[] = [];
  public directoryManager: Directory_Manager;
  public path: string;

  constructor(dm: Directory_Manager, name: string, path: string) {
    this.name = name;
    this.path = path;
    this.directoryManager = dm;
  }

  public ls(): string[] {
    let output: string[] = [];
    this.files.forEach((file) => {
      output.push(`[${getColor(file.type)}${file.name}${file.type}]`);
    });
    this.directories.forEach((dir) => {
      output.push(`[${getColor("dir")}${dir.name}]`);
    });
    return output;
  }

  public addFile(file: Dir_File) {
    this.files.push(file);
  }

  public addDirectory(name: string): Directory {
    let newFolder = new Directory(
      this.directoryManager,
      name,
      this.path + name + "/"
    );
    this.directories.push(newFolder);
    this.directoryManager.directories.push(newFolder);

    return newFolder;
  }

  public cd(path: string): Directory | null {
    console.log(path);
    if (!path || path == ".") {
      return this;
    }

    for (let i = 0; i < this.directories.length; i++) {
      const dir = this.directories[i];
      if (dir.name == path) {
        return dir;
      }
    }

    return this.directoryManager.getDirectory(this, path);
  }

  public runFile(requestName: string, textDisplay: TextDisplay): void {
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      if (file.type !== ".exe") {
        continue;
      }

      if (file.name + file.type !== requestName && file.name !== requestName) {
        continue;
      }

      if (file.onRun !== null) {
        textDisplay.addLines([`Running ${file.name}${file.type}...`]);
        file.onRun();
        return;
      }
    }
    textDisplay.addLines(getColorString("File not found", getColor("error")));
  }

  readFile(name: string, textDisplay: TextDisplay): boolean {
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

  constructor(name: string, type: string, onRun?: () => void) {
    this.name = name;
    this.type = type;
    this.onRun = onRun || null;
  }
}
