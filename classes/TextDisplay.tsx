export class TextDisplay {
  lines: string[] = [""];

  addLine(line: string) {
    this.lines.push(line);
  }
  typeCharacter(letter: string) {
    this.lines[this.lines.length - 1] += letter;
  }
  removeCharacter() {
    this.lines[this.lines.length - 1] = this.lines[this.lines.length - 1].slice(
      0,
      -1
    );
  }
  newLine() {
    this.lines.push("");
    console.log("Adding line: " + this.lines.length);
  }

  renderText() {
    return (
      <div>
        {this.lines.map((line, index) => (
          <div key={index}>{"> " + line}</div>
        ))}
      </div>
    );
  }
}
