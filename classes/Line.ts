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

export function addLineBreaks(
  input: string,
  maxLineLength: number = 50
): string {
  const words = input.split(" ");
  let result = "";
  let currentLine = "";

  words.forEach((word) => {
    // If adding the word to the current line exceeds the max length, add a line break
    if ((currentLine + word).length > maxLineLength) {
      // If the word is longer than maxLineLength, split the word itself
      if (word.length > maxLineLength) {
        // First, complete the current line
        if (currentLine.length > 0) {
          result += currentLine + "\n";
          currentLine = "";
        }
        // Split the long word into chunks and add them with line breaks
        const chunks =
          word.match(new RegExp(`.{1,${maxLineLength}}`, "g")) || [];
        result += chunks.join("\n") + " ";
      } else {
        // Add current line to result and start a new line with the current word
        result += currentLine + "\n";
        currentLine = word + " ";
      }
    } else {
      // If current word fits in the line, just add it to the current line
      currentLine += word + " ";
    }
  });

  // Add the last line to the result
  result += currentLine.trim();

  return result;
}