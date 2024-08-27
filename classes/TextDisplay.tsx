import { Directory_Manager } from "./DirectoryManager";
import { Line } from "./Line";
export class TextDisplay {
  lines: Line[] = [];
  cursorX: number = 0;
  cursorSymbol: string = "|";
  autoFill: string = "";
  autoFillReplace: boolean = false;
  directoryManager: Directory_Manager;

  constructor(directoryManager: Directory_Manager, lines?: string[]) {
    this.directoryManager = directoryManager;
    if (lines) {
      this.addLines(lines);
    } else {
      this.lines.push(new Line("", this.directoryManager.currentPath));
    }
  }

  addLines(lines: string[] | string) {
    const path = this.directoryManager.currentPath;
    if (typeof lines === "string") {
      lines = lines.split("\n");
    }

    if (lines[lines.length - 1] === "") {
      lines.pop();
    }

    lines.forEach((line) => {
      this.lines.push(new Line(line, path));
    });

    this.lines.push(new Line(" ", path));
    this.lines.push(new Line("", path));
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
    lastLine.path = this.directoryManager.currentPath;

    for (let i = 0; i < letter.length; i++) {
      this.moveCursorRight();
    }
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

  deleteCharacter() {
    const lastLine = this.getLastLine();
    lastLine.text =
      lastLine.text.slice(0, this.cursorX) +
      lastLine.text.slice(this.cursorX + 1);
    this.cursorSymbol = "|";
  }

  ctrlDelete(direction: string, deleteChar = true) {
    const lastLine = this.getLastLine();

    const breakList = [" ", "/", ".", "-", "_"];

    if (direction === "Left") {
      while (this.cursorX > 0) {
        if (deleteChar) {
          this.removeCharacter();
        } else {
          this.moveCursorLeft();
        }
        const char = lastLine.text[this.cursorX - 1];
        if (breakList.includes(char)) {
          break;        }
      }
    } else if (direction === "Right") {
      while (this.cursorX < lastLine.text.length) {
        if (deleteChar) {
          this.deleteCharacter();
        } else {
          this.moveCursorRight();
        }
        const char = lastLine.text[this.cursorX];
        if (breakList.includes(char)) {
          break;
        }
      }
    }
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
    const newLine = new Line("", this.directoryManager.currentPath);
    this.lines.push(newLine);
    this.cursorX = 0;
  }

  clear() {
    this.lines = [new Line("", this.directoryManager.currentPath)];
  }
}
