export const textColor = "#c9c9c9";

const palette = [
  "#5FA8FF", // Function Color (Medium Blue)
  "#7AD7F0", // Text Color (Light Cyan)
  "#9A76FF", // Directory Color (Medium Purple)
  "#66CCFF", // Executable Color (Light Blue)
  "#FF5555", // Error Color (Red)
];

export const commandColor = palette[0];
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
    case "command":
      return commandColor;
    default:
      throw new Error(`Invalid color type: ${type}`);
  }
};

 export function blendColors(colorA: string, colorB: string, amount: number = 0.5) {
   if (!colorA || !colorB) {
     throw new Error(`Invalid color format: ${colorA} or ${colorB}`);
   }
   const matchA = colorA.match(/\w\w/g);
   const matchB = colorB.match(/\w\w/g);

   if (!matchA || !matchB) {
     throw new Error(`Invalid color format: ${colorA} or ${colorB}`);
   }

   const [rA, gA, bA] = matchA.map((c) => parseInt(c, 16));
   const [rB, gB, bB] = matchB.map((c) => parseInt(c, 16));

   const r = Math.round(rA + (rB - rA) * amount)
     .toString(16)
     .padStart(2, "0");
   const g = Math.round(gA + (gB - gA) * amount)
     .toString(16)
     .padStart(2, "0");
   const b = Math.round(bA + (bB - bA) * amount)
     .toString(16)
     .padStart(2, "0");

   return `#${r}${g}${b}`;
 }