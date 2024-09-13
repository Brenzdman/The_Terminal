// Handles the styling of text in the terminal.

import { getColor, textColor } from "@/functions/color";

export class StyledText {
  text: string = "";
  styles: Style[] = [];
  constructor(text: string) {
    this.addText(text);
  }

  addText(text: string, index: number = this.text.length): void {
    if (index < 0 || index > this.text.length) {
      throw new Error(`Index out of bounds in addText: ${index}`);
    }
    this.text = this.text.slice(0, index) + text + this.text.slice(index);
  }

  setText(text: string): void {
    this.text = text;
  }

  getText(): string {
    return this.text;
  }

  addStyle(indexStart: number, indexEnd: number, modifier: string): void {
    if (
      indexStart < 0 ||
      indexStart > this.text.length ||
      indexEnd < 0 ||
      indexEnd > this.text.length
    ) {
      throw new Error(
        `Index out of bounds in addStyle: ${indexStart} , ${indexEnd}`
      );
    }

    if (indexStart > indexEnd) {
      throw new Error(`Invalid range in addStyle: ${indexStart} - ${indexEnd}`);
    }

    this.styles.push(new Style(indexStart, indexEnd, modifier));
  }

  getStyledTextDiv(): React.ReactElement {
    const cmdList = this.styles.sort((a, b) => a.indexStart - b.indexStart);

    // For each cmd style the text in that color, other styles not yet implemented
    let colorArray: string[] = [];

    // each char has it's own div
    for (let i = 0; i < this.text.length; i++) {
      colorArray.push(textColor);
    }

    function blendColors(colorA: string, colorB: string, amount: number = 0.5) {
      const [rA, gA, bA] = colorA.match(/\w\w/g)!.map((c) => parseInt(c, 16));
      const [rB, gB, bB] = colorB.match(/\w\w/g)!.map((c) => parseInt(c, 16));
      const r = Math.round(rA! + (rB - rA!) * amount)
        .toString(16)
        .padStart(2, "0");
      const g = Math.round(gA! + (gB - gA!) * amount)
        .toString(16)
        .padStart(2, "0");
      const b = Math.round(bA! + (bB - bA!) * amount)
        .toString(16)
        .padStart(2, "0");
      return "#" + r + g + b;
    }

    cmdList.forEach((cmd) => {
      if (cmd.styleType === "color") {
        for (let i = cmd.indexStart; i < cmd.indexEnd; i++) {
          const startingColor = colorArray[i];
          const endingColor = getColor(cmd.modifier);
          const blendAmount = 0.5;

          if (startingColor === textColor) {
            colorArray[i] = endingColor;
          } else {
            colorArray[i] = blendColors(
              startingColor,
              endingColor,
              blendAmount
            );
          }
        }
      }
    });

    const divArray = this.text.split("").map((char, index) => {
      const color = colorArray[index];
      return (
        <span key={index} style={{ color: color }}>
          {char}
        </span>
      );
    });

    return <div>{divArray}</div>;
  }
}

// Handles modifier input commands
class Style {
  public indexStart: number;
  public indexEnd: number;
  public styleType: string = "color";
  public modifier: string;

  constructor(indexStart: number, indexEnd: number, modifier: string) {
    this.indexStart = indexStart;
    this.indexEnd = indexEnd;
    this.modifier = modifier;
  }
}
