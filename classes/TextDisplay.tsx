import { MAX_LINE_LENGTH } from "@/constants/constants";

class Line {
  color: string = "#fff";
  text: string = "";
  userGenerated: boolean = false;
  constructor(text: string) {
    this.text = text;
  }

  copy() {
    let newLine = new Line(this.text);
    newLine.userGenerated = this.userGenerated;
    newLine.color = this.color;
    return newLine;
  }
}

export class TextDisplay {
  lines: Line[] = [];

  constructor(lines?: string[]) {
    if (lines) {
      this.addLines(lines);
    } else {
      this.lines.push(new Line(""));
    }
  }

  addLines(lines: string[]) {
    if (lines[lines.length - 1] === "") {
      lines.pop();
    }

    lines.forEach((line) => {
      this.lines.push(new Line(line));
    });

    this.lines.push(new Line(" "));
    this.lines.push(new Line(""));
  }

  typeCharacter(letter: string, userGenerated: boolean = true) {
    this.lines[this.lines.length - 1].text += letter;
    this.lines[this.lines.length - 1].userGenerated = userGenerated;
  }

  removeCharacter() {
    this.lines[this.lines.length - 1].text = this.lines[
      this.lines.length - 1
    ].text.slice(0, -1);
  }

  newLine() {
    this.lines.push(new Line(""));
  }

  clear() {
    while (this.lines.length > 0) {
      this.lines.pop();
    }

    this.lines.push(new Line(""));
  }

  renderText() {
    return linesToText(this.lines);
  }
}

function linesToText(lines: Line[]) {
  let newLines: Line[] = [];
  let linesCopy = lines.map((line) => line.copy());

  const splitLongLines = (line: Line): Line[] => {
    let text = line.text;
    const splitLines: string[] = [];

    while (text.length >= MAX_LINE_LENGTH) {
      const segment = text.slice(0, MAX_LINE_LENGTH);
      const lastSpace = segment.lastIndexOf(" ");

      if (lastSpace > -1) {
        splitLines.push(segment.slice(0, lastSpace));
        text = text.slice(lastSpace + 1);
      } else {
        splitLines.push(segment);
        text = text.slice(MAX_LINE_LENGTH);
      }
    }
    splitLines.push(text);

    return splitLines.map((splitLine) => {
      let newLine = line.copy();
      newLine.text = splitLine;
      return newLine;
    });
  };

  for (let i = 0; i < linesCopy.length; i++) {
    newLines.push(...splitLongLines(linesCopy[i]));
  }

  return (
    <div style={divStyle}>
      {newLines.map((line, index) => {
        let content;
        if (line.text === " " && !line.userGenerated) {
          content = <br />;
        } else if (line.userGenerated || line.text === "") {
          content = <span>{"> " + line.text}</span>;
        } else {
          content = <span>{line.text}</span>;
        }

        return <div key={index}>{content}</div>;
      })}
    </div>
  );
}

const divStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  position: "fixed",
  zIndex: 1,
  overflow: "auto",
  paddingBottom: "60vh",
};
