import { MAX_LINE_LENGTH } from "@/constants/constants";
import { StyledText } from "./StyledText";

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

  getDiv(path: string = ""): React.ReactElement {
    let text = this.text;
    if (path) {
      text = new StyledText(path + "> " + this.text.getText());
    }
    return text.getStyledText();
  }

  copy() {
    let newLine = new Line(this.text, this.path);
    newLine.userGenerated = this.userGenerated;
    newLine.color = this.color;
    newLine.path = this.path;
    return newLine;
  }
}

export function numColorCodes(text: string): number {
  return (text.match(/\[#[0-9a-fA-F]{6}\]/g) || []).length;
}

export function addLineBreaks(
  input: string,
  maxLineLength: number = MAX_LINE_LENGTH
): string {
  return input;
  // const lines = input.split("\n");
  // let result = "";

  // lines.forEach((line, lineIndex) => {
  //   const words = line.split(" ");
  //   let currentLine = "";

  //   words.forEach((word) => {
  //     // For each color code in string, add length modifier of 8
  //     let lengthModifier = numColorCodes(word) * 8;

  //     // If adding a word would exceed the max line length split the line before adding the word
  //     if ((currentLine + word).length > maxLineLength + lengthModifier) {
  //       result += currentLine + "\n";
  //       currentLine = "";
  //     }
  //     let segment = word;

  //     // If the word is longer than the max line length split it
  //     while (segment.length > maxLineLength + numColorCodes(segment) * 8) {
  //       currentLine = segment.slice(0, maxLineLength);
  //       segment = segment.slice(maxLineLength);
  //       result += currentLine + "\n";
  //       currentLine = "";
  //     }
  //     currentLine += segment + " ";

  //     // If it's the last word, add it to the result
  //     // if (wordIndex === words.length - 1) {
  //     //   result += currentLine;
  //     // }
  //   });

  //   result += currentLine.trim();
  //   if (lineIndex < lines.length - 1) {
  //     result += "\n";
  //   }
  // });

  // // console.log(result);
  // return result;
}
