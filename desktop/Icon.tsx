// class that has an icon, a name, on click, and xy position on screen

export class Icon {
  iconSrc: string = "/page.png";
  name: string;
  onClick: () => void;
  x: number;
  y: number;
  isSelected: boolean = false;

  constructor(
    icon: string,
    name: string,
    onClick: () => void,
    x: number,
    y: number
  ) {
    this.iconSrc = icon;
    this.name = name;
    this.onClick = onClick;
    this.x = x;
    this.y = y;
  }

  displayIcon() {
    const handleClick = () => {
      this.isSelected = true;
      this.onClick();
    };

    return (
      <div
        style={{
          position: "absolute",
          top: this.y,
          left: this.x,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 50,
          border: this.isSelected ? "2px solid blue" : "none",
        }}
      >
        <img
          src={this.iconSrc}
          alt={this.name}
          onClick={handleClick}
          style={{
            width: 50,
            height: 50,
            cursor: "pointer",
          }}
        />
        <div style={{ textAlign: "center" }}>{this.name}</div>
      </div>
    );
  }
}
