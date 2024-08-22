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

export class TextDisplay {
  lines: Line[] = [];
  currentPath: string;
  cursorX: number = 0;
  cursorSymbol: string = "|";
  autoFill: string = "";
  autoFillReplace: boolean = false;

  constructor(currentPath: string, lines?: string[]) {
    this.currentPath = currentPath;
    if (lines) {
      this.addLines(lines);
    } else {
      this.lines.push(new Line("", this.currentPath));
    }
  }

  addLines(lines: string[] | string) {
    if (typeof lines === "string") {
      lines = lines.split("\n");
    }

    if (lines[lines.length - 1] === "") {
      lines.pop();
    }

    lines.forEach((line) => {
      this.lines.push(new Line(line, this.currentPath));
    });

    this.lines.push(new Line(" ", this.currentPath));
    this.lines.push(new Line("", this.currentPath));
  }

  typeCharacter(letter: string, userGenerated: boolean = true) {
    const lastLine = this.getLastLine();

    // Checks if using a prev cmd
    if (this.autoFill && this.autoFillReplace) {
      lastLine.text = this.autoFill;
      this.autoFill = "";
      this.autoFillReplace = false;
    }

    lastLine.text =
      lastLine.text.slice(0, this.cursorX) +
      letter +
      lastLine.text.slice(this.cursorX);

    lastLine.userGenerated = userGenerated;
    lastLine.path = this.currentPath;
    this.moveCursorRight();
  }

  moveCursorLeft() {
    this.cursorX = Math.max(-1, this.cursorX - 1);
    this.cursorSymbol = "|";
  }

  moveCursorRight() {
    const lastLine = this.getLastLine();
    this.cursorX = Math.min(this.cursorX + 1, lastLine.text.length);
    this.cursorSymbol = "|";
  }

  removeCharacter() {
    const lastLine = this.getLastLine();
    lastLine.text = lastLine.text.slice(0, -1);
  }

  getLastLine() {
    return this.lines[this.lines.length - 1];
  }

  setAutofill(text: string, replace: boolean = false) {
    if (!text) {
      this.autoFill = "";
      this.autoFillReplace = false;
      return;
    }

    this.autoFill = text;
    this.autoFillReplace = replace;
    if (replace) {
      this.cursorX = text.length;
    }
  }

  newLine() {
    const newLine = new Line("", this.currentPath);
    this.lines.push(newLine);
    this.cursorX = 0;
  }

  clear() {
    this.lines = [new Line("", this.currentPath)];
  }

  setPath(path: string) {
    this.currentPath = path;
    console.log(this.currentPath);
  }
}
