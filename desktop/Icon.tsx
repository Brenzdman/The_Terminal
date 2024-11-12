import { ICON_WIDTH } from "@/constants/constants";

export class Icon {
  iconSrc: string = "/page.png";
  name: string;

  // xy in manager grid
  x: number;
  y: number;

  // For display and mouse event handling
  relativeX: number = 0;
  relativeY: number = 0;
  isSelected: boolean = false;

  static ICON_HEIGHT = ICON_WIDTH;

  constructor(icon: string, name: string, x: number, y: number) {
    this.iconSrc = icon;
    this.name = name;
    this.x = x;
    this.y = y;
  }

  inRange(mouseX: number, mouseY: number): boolean {
    // Calculate the effective bounds, adding padding for the selection border
    const padding = 10;
    const left = this.relativeX - padding / 2;
    const right = this.relativeX + ICON_WIDTH + padding * 2;
    const top = this.relativeY - padding / 4;
    const bottom = this.relativeY + Icon.ICON_HEIGHT + padding * 3;

    // Check if the mouse coordinates fall within the calculated bounds
    return (
      mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom
    );
  }

  displayIcon(x: number, y: number) {
    this.relativeX = x;
    this.relativeY = y;
    return (
      <div
        style={{
          position: "absolute",
          top: y,
          left: x,
          width: ICON_WIDTH + 20, // Fixed width for container including padding and border
          height: ICON_WIDTH + 30, // Fixed height for icon and text
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: this.isSelected
            ? "rgba(188, 188, 188, 0.3)"
            : "transparent",
          borderRadius: this.isSelected ? "2px" : "0",
          border: this.isSelected
            ? "2px solid rgba(180, 180, 180, 0.8)"
            : "none",
          transition: "background-color 0.2s, border 0.2s",
        }}
        key={this.x + "" + this.y}
      >
        <div
          style={{
            width: ICON_WIDTH,
            height: ICON_WIDTH,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={this.iconSrc}
            alt={this.name}
            style={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
          />
        </div>
        <div
          style={{
            textAlign: "center",
            color: "white",
            marginTop: "5px", // Space between icon and text
          }}
        >
          {this.name}
        </div>
      </div>
    );
  }
}
