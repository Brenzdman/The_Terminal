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

export const getColorString = (text: string, color: string): string => {
  return `[${color}${text}]`;
};

export const insertColorString = (
  text: string,
  insert: string,
  index: number
): string => {
  const colorMatch = text.match(/^\[(#[0-9a-fA-F]{6})/);
  if (!colorMatch) {
    throw new Error("Invalid color string format: " + text);
  }

  const color = colorMatch[1];

  // Calculate the adjusted index based on the format "[#FFFFFF text]"
  const adjustedIndex = index + color.length + 1; // 1 for the '[' character

  if (adjustedIndex < color.length + 1 || adjustedIndex > text.length - 1) {
    console.error("Index out of bounds: " + index + " for text: " + text);
    return text;
  }

  const beforeInsert = text.slice(0, adjustedIndex);
  const afterInsert = text.slice(adjustedIndex, text.length - 1);

  return `${beforeInsert}]${insert}${getColorString(afterInsert, color)}`;
};

export const getColorDiv = (text: string): React.ReactElement => {
  const segments: { text: string; color: string | null }[] = [];

  let string = "";
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    // Check for the beginning of a color code
    if (char === "[" && i + 8 < text.length) {
      const colorCode = text.slice(i + 1, i + 8);
      const isColor = /^#[0-9a-fA-F]{6}$/.test(colorCode);

      // If valid color
      if (isColor) {
        const remainingText = text.slice(i + 8);
        const endBracket = remainingText.indexOf("]");

        if (endBracket !== -1) {
          const coloredText = remainingText.slice(0, endBracket);
          segments.push({ text: string, color: null });
          segments.push({ text: coloredText, color: colorCode });
          string = "";
          // Move past the closing bracket
          i += endBracket + 8 + 1;
          continue;
        }
      }
    }

    // Add characters to the default string
    string += char;
    i++;
  }

  // Push any remaining text
  if (string) {
    segments.push({ text: string, color: null });
  }

  return (
    <div>
      {segments.map(({ text, color }, index) =>
        color ? (
          <span key={`color-${index}`} style={{ color }}>
            {text}
          </span>
        ) : (
          <span key={`text-${index}`}>{text}</span>
        )
      )}
    </div>
  );
};