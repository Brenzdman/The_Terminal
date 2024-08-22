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
      this.cursorX = lastLine.text.length;
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
    this.moveCursor("left");
  }

  moveCursorRight() {
    this.moveCursor("right");
  }

  moveCursor(direction: "left" | "right") {
    if (this.autoFillReplace) {
      this.setTextToAutofill();
    }

    if (direction === "left") {
      this.cursorX = Math.max(0, this.cursorX - 1);
    } else if (direction === "right") {
      const lastLine = this.getLastLine();
      this.cursorX = Math.min(this.cursorX + 1, lastLine.text.length);
    }

    this.cursorSymbol = "|";
  }

  setTextToAutofill() {
    const lastLine = this.getLastLine();
    lastLine.userGenerated = true;
    lastLine.text = this.autoFill;
    this.cursorX = lastLine.text.length;
    this.autoFill = "";
    this.autoFillReplace = false;
  }

  removeCharacter() {
    if (this.cursorX <= 0) {
      return;
    }

    const lastLine = this.getLastLine();
    lastLine.text =
      lastLine.text.slice(0, this.cursorX - 1) +
      lastLine.text.slice(this.cursorX);
    this.moveCursorLeft();
  }

  getLastLine(): Line {
    return this.lines[this.lines.length - 1];
  }

  setAutofill(text: string, replace: boolean = false): void {
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
