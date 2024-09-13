export const textColor = "#c9c9c9";

const palette = [
  "#5FA8FF", // Function Color (Medium Blue)
  "#7AD7F0", // Text Color (Light Cyan)
  "#9A76FF", // Directory Color (Medium Purple)
  "#66CCFF", // Executable Color (Light Blue)
  "#FF5555", // Error Color (Red)
];

export const functionColor = palette[0];
export const txtColor = palette[1];
export const dirColor = palette[2];
export const exeColor = palette[3];
export const errorColor = palette[4];

export const getColor = (type: string) => {
  switch (type) {
    case ".exe":
      return exeColor;
    case ".txt":
      return txtColor;
    case "dir":
      return dirColor;
    case "error":
      return errorColor;
    case "function":
      return functionColor;
    default:
      return errorColor;
  }
};
