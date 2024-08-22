import { getColor } from "@/functions/color";
import { TextDisplay } from "./TextDisplay";

export class Directory_Manager {
  public directories: Directory[] = [];
  public currentDirectory: Directory;
  public homeDirectory: Directory;

  constructor() {
    let root = this.createDirectory("root", "/");
    this.currentDirectory = root.addDirectory("home").addDirectory("user");
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
    // Finds previous directory

    if (path == "~") {
      return this.homeDirectory;
    }

    if (path == "..") {
      let path = directory?.path;

      // Gets second to "/" from the end
      let lastSlash = path?.lastIndexOf("/", path.length - 2);

      if (lastSlash === -1) {
        path = "/";
      }

      path = path?.slice(0, lastSlash! + 1);

      return this.getDirectory(this.currentDirectory, path!);
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

  public runFile(name: string, textDisplay: TextDisplay): boolean {
    let ran = false;
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      if (file.name + file.type !== name && file.name !== name) {
        continue;
      }

      if (file.onRun !== null) {
        file.onRun();
        ran = true;
      }

      if (ran) {
        textDisplay.newLine();
      }
    }
    return ran;
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
