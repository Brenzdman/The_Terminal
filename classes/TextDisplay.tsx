import { MAX_LINE_LENGTH } from "@/constants/constants";

class Line {
  text: string = "";
  userGenerated: boolean = false;
  constructor(text: string) {
    this.text = text;
  }
}

export class TextDisplay {
  lines: Line[] = [new Line("")];

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

  renderText() {
    return linesToText(this.lines);
  }
}

function linesToText(lines: Line[]) {
  let newLines: Line[] = [];
  let linesCopy = lines.map((line) => {
    let newLine = new Line(line.text);
    newLine.userGenerated = line.userGenerated;
    return newLine;
  });

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
      let newLine = new Line(splitLine);
      newLine.userGenerated = line.userGenerated;
      return newLine;
    });
  };

  for (let i = 0; i < linesCopy.length; i++) {
    newLines.push(...splitLongLines(linesCopy[i]));
  }

  return (
    <div>
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
