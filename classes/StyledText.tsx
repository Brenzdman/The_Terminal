// Handles the styling of text in the terminal.

import { blendColors, getColor, textColor } from "@/functions/color";

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

  addStyle(
    indexStart: number,
    indexEnd: number,
    modifier: string,
    type: string = "color"
  ): void {
    if (
      indexStart < 0 ||
      indexStart > this.text.length ||
      indexEnd < 0 ||
      indexEnd > this.text.length
    ) {
      throw new Error(
        `Index out of bounds in addStyle: ${indexStart} , ${indexEnd} for text ${this.text}`
      );
    }

    if (indexStart > indexEnd) {
      throw new Error(`Invalid range in addStyle: ${indexStart} - ${indexEnd}`);
    }

    this.styles.push(new Style(indexStart, indexEnd, modifier, type));
  }

  getStyledTextDiv(): React.ReactElement {
    const textLength = this.text.length;
    const colorArray: string[] = new Array(textLength).fill("");
    const textTypeArray: string[] = new Array(textLength).fill("");

    this.styles.forEach((cmd) => {
      if (cmd.styleType === "color") {
        const endingColor = getColor(cmd.modifier);

        for (let i = cmd.indexStart; i < cmd.indexEnd; i++) {
          const startingColor = colorArray[i];

          // Only blend if the starting color is different
          if (!startingColor) {
            colorArray[i] = endingColor;
          } else if (startingColor !== endingColor) {
            colorArray[i] =
              startingColor === textColor
                ? endingColor
                : blendColors(startingColor, endingColor);
          }
        }
      } else if (cmd.styleType === "bold") {
        for (let i = cmd.indexStart; i < cmd.indexEnd; i++) {
          textTypeArray[i] = "bold";
        }
      } else if (cmd.styleType === "italic") {
        for (let i = cmd.indexStart; i < cmd.indexEnd; i++) {
          textTypeArray[i] = "italic";
        }
      }
    });

    // Reduce number of React elements by grouping consecutive characters with the same style
    const divArray = [];
    let lastColor = colorArray[0];
    let lastStyle = textTypeArray[0];
    let currentText = this.text[0];

    for (let i = 1; i < textLength; i++) {
      if (colorArray[i] === lastColor && textTypeArray[i] === lastStyle) {
        currentText += this.text[i];
      } else {
        divArray.push(
          <span
            key={divArray.length}
            style={{
              color: lastColor,
              fontStyle: lastStyle === "italic" ? "italic" : "normal",
              fontWeight: lastStyle === "bold" ? "bold" : "normal",
            }}
          >
            {currentText}
          </span>
        );
        lastColor = colorArray[i];
        lastStyle = textTypeArray[i];
        currentText = this.text[i];
      }
    }

    // Push the last accumulated text
    divArray.push(
      <span
        key={divArray.length}
        style={{
          color: lastColor,
          fontStyle: lastStyle === "italic" ? "italic" : "normal",
          fontWeight: lastStyle === "bold" ? "bold" : "normal",
        }}
      >
        {currentText}
      </span>
    );

    return <div>{divArray}</div>;
  }
}

// Handles modifier input commands
class Style {
  public indexStart: number;
  public indexEnd: number;
  public styleType: string;
  public modifier: string;

  constructor(
    indexStart: number,
    indexEnd: number,
    modifier: string,
    styleType: string,
  ) {
    this.indexStart = indexStart;
    this.indexEnd = indexEnd;
    this.modifier = modifier;
    this.styleType = styleType;
  }
}
