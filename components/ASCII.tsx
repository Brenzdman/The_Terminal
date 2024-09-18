import { ASCIIimg } from "@/images/ASCII";
import React, { useEffect, useState, useRef } from "react";

const ASCII: React.FC = () => {
  const [text, setText] = useState<string>("Loading...");
  const [fontSize, setFontSize] = useState<number>(16);
  const hasEncoded = useRef(false); // Ref to track if encoding has been done

  const calculateFontSize = () => {
    const { innerWidth, innerHeight } = window;
    // Example calculation: 1% of the smaller dimension
    const newFontSize = Math.min(innerWidth, innerHeight) * 0.0125;
    setFontSize(newFontSize);
  };

  useEffect(() => {
    // Prevent encoding if already done
    async function encodeImage() {
      const ASCII_CODE = process.env.NEXT_PUBLIC_ASCII_CODE;

      if (!ASCII_CODE) {
        throw new Error(`ASCII code not found`);
      }

      const codeLength = ASCII_CODE.length;

      let lines = ASCIIimg;
      let totalLines = lines.length;

      // Determine the number of lines to skip to get evenly spaced ones
      let lineSkip = Math.max(1, Math.floor(totalLines / codeLength));
      // gets the lines that will have encoded chars
      let encodedLines: number[] = Array.from(
        { length: codeLength },
        (_, i) => i * lineSkip
      );

      if (encodedLines.length < codeLength) {
        throw new Error(`Not enough lines to encode ASCII code`);
      }

      function getRandom0InString(str: string): number {
        if (!str.includes("0")) {
          throw new Error(`No 0 in string`);
        }

        let index = Math.floor(Math.random() * str.length);
        return str[index] === "0" ? index : getRandom0InString(str);
      }

      for (let i = 0; i < codeLength; i++) {
        let line = encodedLines[i];
        let encodedChar = ASCII_CODE[i];
        let encodedLine = lines[line];
        let encodedIndex = getRandom0InString(encodedLine);
        lines[line] =
          encodedLine.slice(0, encodedIndex) +
          encodedChar +
          encodedLine.slice(encodedIndex + 1);
      }

      setText(lines.join("\n"));
    }

    if (!hasEncoded.current) {
      hasEncoded.current = true;
      encodeImage();
    }
    calculateFontSize(); // Set initial font size

    const handleResize = () => {
      calculateFontSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const containerStyle: React.CSSProperties = {
    zIndex: -1,
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    textAlign: "center",
    fontFamily: "monospace",
    fontSize: `${fontSize}px`,
    whiteSpace: "pre-wrap",
    backgroundColor: "#000",
    color: "#3d3680",
    userSelect: "none",
    left: "-5px",
  };

  return (
    <div style={containerStyle}>
      <pre>{text}</pre>
    </div>
  );
};

export default ASCII;
