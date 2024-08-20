export class Directory {
  private name: string;
  private files: Dir_File[] = [];
  private directories: Directory[] = [];

  constructor(name: string) {
    this.name = name;
  }

  public addFile(file: Dir_File): void {
    this.files.push(file);
  }

  public addDirectory(directory: Directory): void {
    this.directories.push(directory);
  }

  public getName(): string {
    return this.name;
  }

  public getFiles(): Dir_File[] {
    return this.files;
  }

  public getDirectories(): Directory[] {
    return this.directories;
  }
}

class Dir_File
{
    private name: string;
    private content: string;

    constructor(name: string, content: string)
    {
        this.name = name;
        this.content = content;
    }

    public getName(): string
    {
        return this.name;
    }

    public getContent(): string
    {
        return this.content;
    }
}