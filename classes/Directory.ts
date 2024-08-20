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
}

export class Dir_File {
  public name: string;
  public content: string | null = null;
  public type: string = ".txt";
  public onRun: (() => void) | null = null;

  constructor(name: string, type: string, onRun?: () => void) {
    this.name = name;
    this.type = type;
    this.onRun = onRun || null;
  }
}
