export class Directory {
    public name: string;
    public files: Dir_File[] = [];
    public directories: Directory[] = [];

    constructor(name: string) {
        this.name = name;
    }

    public ls(): string {
        let output = "";
        this.files.forEach((file) => {
            output += file.name + " ";
        });
        this.directories.forEach((dir) => {
            output += dir.name + " ";
        });
        return output;
    }

    public addFile(file: Dir_File) {
        this.files.push(file);
    }
}

class Dir_File {
  public name: string;
  public content: string;

  constructor(name: string, content: string) {
    this.name = name;
    this.content = content;
  }
}
