// Handles the styling of text in the terminal.

export class StyledText {
  private text: string = "";
  private styles: Style[] = [];
  constructor(text: string) {
    this.addText(text);
  }

  // TODO modif all cmds
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

  getStyledText(): React.ReactElement {
    const cmdList = this.styles.sort((a, b) => a.indexStart - b.indexStart);

    return <div>{this.text}</div>;
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
