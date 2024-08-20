"use client";
import React, { useEffect, useState } from "react";
import asciiText from "../images/ASCII.txt";

const ASCII: React.FC = () => {
  const [text, setText] = useState<string>("Loading...");
  const [fontSize, setFontSize] = useState<number>(16);

  const calculateFontSize = () => {
    const { innerWidth, innerHeight } = window;
    // Example calculation: 1% of the smaller dimension
    const newFontSize = Math.min(innerWidth, innerHeight) * 0.0125;
    setFontSize(newFontSize);
  };

  useEffect(() => {
    setText(asciiText);
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
    color: "#17214f",
  };

  return (
    <div style={containerStyle}>
      <pre>{text}</pre>
    </div>
  );
};

export default ASCII;
