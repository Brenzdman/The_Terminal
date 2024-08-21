import { TextDisplay } from "./TextDisplay";

export class Directory_Manager {
  public directories: Directory[] = [];
  public currentDirectory: Directory;

  constructor() {
    this.currentDirectory = this.createDirectory("root", "/");
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
    if (path == "..") {
      path = directory?.path || "/";
      // Goes back a segment
      path = path.split("/").slice(0, -1).join("/") + "/";
    }

    console.log(path);

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
      output.push(file.name + file.type);
    });
    this.directories.forEach((dir) => {
      output.push(dir.name);
    });
    return output;
  }

  public addFile(file: Dir_File) {
    this.files.push(file);
  }

  public addDirectory(name: string) {
    let newFolder = new Directory(
      this.directoryManager,
      name,
      this.path + name + "/"
    );
    this.directories.push(newFolder);
    this.directoryManager.directories.push(newFolder);
  }

  public cd(path: string): Directory | null {
    console.log(path);
    if (path == "") {
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
      if (file.name + file.type !== name) {
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
