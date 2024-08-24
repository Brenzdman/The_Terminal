
export class Line {
  color: string = "#fff";
  text: string = "";

  userGenerated: boolean = false;
  path: string;

  constructor(text: string, path: string) {
    this.text = text;
    this.path = path;
  }

  copy() {
    let newLine = new Line(this.text, this.path);
    newLine.userGenerated = this.userGenerated;
    newLine.color = this.color;
    newLine.path = this.path;
    return newLine;
  }
}
