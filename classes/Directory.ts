import { TextDisplay } from "./TextDisplay";

export class Directory {
  public name: string;
  public files: Dir_File[] = [];
  public directories: Directory[] = [];

  constructor(name: string) {
    this.name = name;
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
