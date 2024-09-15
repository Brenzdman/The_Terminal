import { MAX_LINE_LENGTH } from "@/constants/constants";
import { StyledText } from "@/classes/StyledText";
export class Line {
  color: string = "#fff";
  text: StyledText;

  userGenerated: boolean = false;
  path: string;

  constructor(text: string | StyledText, path: string) {
    if (text instanceof StyledText) {
      this.text = text;
    } else {
      this.text = new StyledText(text);
    }

    this.path = path;
  }

  setText(text: string) {
    this.text.setText(text);
  }

  getText(): string {
    return this.text.getText();
  }

  getDiv(path: string = ""): [React.ReactElement, string] {
    let text = this.text;

    let brokenText = addLineBreaks(text.getText());
    if (path) {
      path += "> ";
      brokenText = addLineBreaks(path + text.getText());
    }

    let lineText = new StyledText(brokenText);
    lineText.styles = text.styles;

    if (path) {
      const firstSpaceIndex = lineText.text.indexOf(" ");
      let secondSpaceIndex = lineText.text.indexOf(" ", firstSpaceIndex + 1);

      if (secondSpaceIndex === -1) {
        secondSpaceIndex = lineText.text.length;
      }

      lineText.addStyle(path.length - 1, secondSpaceIndex, "command");
    }
    // subtracts x from the cursor position to account for the line breaks
    // gets last '\n' index

    return [lineText.getStyledTextDiv(), brokenText];
  }

  copy() {
    let newLine = new Line(this.text, this.path);
    newLine.userGenerated = this.userGenerated;
    newLine.color = this.color;
    newLine.path = this.path;
    return newLine;
  }
}

export function addLineBreaks(
  input: string,
  maxLineLength: number = MAX_LINE_LENGTH
): string {
  const lines = input.split("\n");
  let result = "";

  lines.forEach((line, lineIndex) => {
    const words = line.split(" ");

    let currentLine = "";

    words.forEach((word) => {
      // If adding a word would exceed the max line length split the line before adding the word
      if ((currentLine + word).length > maxLineLength) {
        result += currentLine + "\n";
        currentLine = "";
      }
      let segment = word;

      // If the word is longer than the max line length split it
      while (segment.length > maxLineLength) {
        currentLine = segment.slice(0, maxLineLength);
        segment = segment.slice(maxLineLength);
        result += currentLine + "\n";
        currentLine = "";
      }
      currentLine += segment + " ";
    });

    result += currentLine.trim();
    if (lineIndex < lines.length - 1) {
      result += "\n";
    }
  });

  return result;
}
