export const exeColor = "#00FFFF";
export const txtColor = "#32CD32";
export const dirColor = "#FFFF00";
export const errorColor = "#FF0000";
export const functionColor = "#FF00FF";

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

    // Accumulate characters into the default string
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
