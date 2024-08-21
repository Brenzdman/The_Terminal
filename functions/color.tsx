export const exeColor = "#00FFFF";
export const txtColor = "#32CD32";
export const dirColor = "#FFFF00";
export const errorColor = "#FF0000";

export const getColor = (type: string) => {
    console.log(type);
  switch (type) {
    case ".exe":
      return exeColor;
    case ".txt":
      return txtColor;
    case "dir":
      return dirColor;
    default:
      return errorColor;
  }
};

export const getColorDiv = (text: string): React.ReactElement => {
  const segments: { text: string; color: string | null }[] = [];

  let i = 0;
  while (i < text.length) {
    if (text[i] === "[") {
      // Find the color code
      const colorCode = text.slice(i + 1, i + 8);
      const color = /^#[0-9a-fA-F]{6}$/.test(colorCode) ? colorCode : "#000000"; // Default to black if invalid
      i += 8; // Skip past the color code
      // Find the closing bracket
      const endBracket = text.indexOf("]", i);
      if (endBracket === -1) break;
      const coloredText = text.slice(i, endBracket);
      segments.push({ text: coloredText, color });
      i = endBracket + 1; // Move past the closing bracket
    } else {
      // Handle text outside of color codes
      const nextBracket = text.indexOf("[", i);
      const segment =
        nextBracket === -1 ? text.slice(i) : text.slice(i, nextBracket);
      if (segment) {
        segments.push({ text: segment, color: null });
      }
      i = nextBracket === -1 ? text.length : nextBracket;
    }
  }

  // Generate React elements
  return (
    <div>
      {segments.map(({ text, color }, index) =>
        color ? (
          <span key={index} style={{ color }}>
            {text}
          </span>
        ) : (
          <span key={index}>{text}</span>
        )
      )}
    </div>
  );
};
