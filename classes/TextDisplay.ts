import { DirectoryManager } from "./DirectoryManager";
import { Line } from "./Line";
import { StyledText } from "./StyledText";
export class TextDisplay {
  lines: Line[] = [];
  cursorX: number = 0;
  cursorSymbol: string = "|";
  autoFill: string = "";
  autoFillReplace: boolean = false;
  directoryManager: DirectoryManager;
  suppressDialog: boolean = false;

  constructor(directoryManager: DirectoryManager, lines?: string[]) {
    this.directoryManager = directoryManager;
    if (lines) {
      this.addLines(lines);
    }
    this.lines.push(new Line("", this.directoryManager.currentPath));
    this.newUserLine();
  }

  addLines(lines: string[] | string | StyledText[] | StyledText): Line[] {
    if (this.suppressDialog) {
      return [];
    }

    const path = this.directoryManager.currentPath;
    if (typeof lines === "string") {
      lines = lines.split("\n");
    }

    if (lines instanceof StyledText) {
      lines = [lines];
    }

    let newLines: Line[] = [];

    lines.forEach((line) => {
      newLines.push(new Line(line, path));
    });

    this.lines = this.lines.concat(newLines);
    return newLines;
  }

  typeCharacter(letter: string, userGenerated: boolean = true) {
    const lastLine = this.getLastLine();

    // Checks if using a prev cmd
    if (this.autoFill && this.autoFillReplace) {
      lastLine.setText(this.autoFill);
      this.autoFill = "";
      this.autoFillReplace = false;
      this.cursorX = lastLine.getText().length;
    }

    const text = lastLine.getText();
    lastLine.setText(
      text.slice(0, this.cursorX) + letter + text.slice(this.cursorX)
    );

    // lastLine.setText(newText);
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
      this.cursorX = Math.min(this.cursorX + 1, lastLine.getText().length);
    }

    this.cursorSymbol = "|";
  }

  setTextToAutofill() {
    const lastLine = this.getLastLine();
    lastLine.userGenerated = true;
    lastLine.setText(this.autoFill);
    this.cursorX = lastLine.getText().length;
    this.autoFill = "";
    this.autoFillReplace = false;
  }

  removeCharacter() {
    if (this.cursorX <= 0) {
      return;
    }

    const lastLine = this.getLastLine();
    const text = lastLine.getText();
    lastLine.setText(
      text.slice(0, this.cursorX - 1) + text.slice(this.cursorX)
    );

    this.moveCursorLeft();
  }

  deleteCharacter() {
    const lastLine = this.getLastLine();

    const text = lastLine.getText();
    lastLine.setText(
      text.slice(0, this.cursorX) + text.slice(this.cursorX + 1)
    );

    this.cursorSymbol = "|";
  }

  setLastLine(text: string, userGenerated: boolean = false) {
    const lastLine = this.getLastLine();
    lastLine.setText(text);
    lastLine.userGenerated = userGenerated;
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
        const char = lastLine.getText()[this.cursorX - 1];
        if (breakList.includes(char)) {
          break;
        }
      }
    } else if (direction === "Right") {
      while (this.cursorX < lastLine.getText().length) {
        if (deleteChar) {
          this.deleteCharacter();
        } else {
          this.moveCursorRight();
        }
        const char = lastLine.getText()[this.cursorX];
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

  newUserLine() {
    if (this.suppressDialog) {
      return;
    }

    const lastLine = this.getLastLine();

    // Sets 'empty' line
    if (lastLine.getText().trim() != "") {
      this.lines.push(new Line("", this.directoryManager.currentPath));
    }

    // if statement prevents consecutive 'input' lines
    if (!lastLine.userGenerated || lastLine.getText().trim() != "") {
      const newLine = new Line("", this.directoryManager.currentPath);
      newLine.userGenerated = true;
      this.lines.push(newLine);
    }

    this.cursorX = 0;
  }

  clear() {
    this.lines = [new Line("", this.directoryManager.currentPath)];
  }
}
