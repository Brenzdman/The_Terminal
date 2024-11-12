import { Icon } from "./Icon";

const gridHeight = 8;
const gridWith = 18;

export class IconManager {
  public icons: Icon[];

  // set based on screen size
  public xMult: number = 1;
  public yMult: number = 1;
  public gridHeight: number = gridHeight;
  public gridWidth: number = gridWith;

  constructor(icons: Icon[] = []) {
    this.icons = icons;
  }

  displayIcons() {
    return this.icons.map((icon) =>
      icon.displayIcon(icon.x * this.xMult, icon.y * this.yMult)
    );
  }

  fillArrayWithIcons() {
    for (let i = 0; i < this.gridHeight; i++) {
      for (let j = 0; j < this.gridWidth; j++) {
        this.addIcon(new Icon("page.png", i + " " + j, j, i), j, i);
      }
    }
  }

  addIcon(icon: Icon, x: number, y: number): boolean {
    if (x >= this.gridWidth || y >= this.gridHeight || x < 0 || y < 0) {
      console.error("Icon out of bounds");
      return false;
    }

    const isExistingIcon = this.icons.some(
      (existingIcon) => existingIcon.x === x && existingIcon.y === y
    );

    if (isExistingIcon) {
      return false;
    }

    icon.x = x;
    icon.y = y;
    this.icons.push(icon);

    return true;
  }

  handleIconClick(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;
  }
}
