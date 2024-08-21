import { MAX_LINE_LENGTH } from "@/constants/constants";
import React, { useEffect, useRef } from "react";

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
    const lastLine = this.lines[this.lines.length - 1];
    lastLine.text += letter;
    lastLine.userGenerated = userGenerated;
    lastLine.path = this.currentPath;
  }

  removeCharacter() {
    const lastLine = this.lines[this.lines.length - 1];
    lastLine.text = lastLine.text.slice(0, -1);
  }

  newLine() {
    const newLine = new Line("", this.currentPath);
    this.lines.push(newLine);
  }

  clear() {
    this.lines = [new Line("", this.currentPath)];
  }

  setPath(path: string) {
    this.currentPath = path;
    console.log(this.currentPath);
  }
}
