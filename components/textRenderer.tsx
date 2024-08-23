import React, { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { textDisplayAtom } from "../constants/atoms";
import { Line, TextDisplay } from "@/classes/TextDisplay";
import { MAX_LINE_LENGTH } from "@/constants/constants";
import {
  getColor,
  getColorDiv,
  getColorString,
  insertColorString,
} from "@/functions/color";

const TextDisplayRenderer: React.FC = () => {
  const [mainTextDisplay, setTextDisplay] = useAtom(textDisplayAtom);
  const [prevLineLength, setPrevLineLength] = useState<number>(
    mainTextDisplay.lines.length
  );

  const textDisplay = new TextDisplay("placeholder");
  Object.assign(textDisplay, mainTextDisplay);
  const cursorX = textDisplay.cursorX;

  // ref to scroll
  const scrollRef = useRef<HTMLDivElement>(null);
  // cursor blink
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault();
      }
    };

    const handleAutoScroll = () => {
      if (scrollRef.current && prevLineLength !== textDisplay.lines.length) {
        setPrevLineLength(textDisplay.lines.length);
        // Temporarily disable smooth scrolling to clear scroll momentum
        scrollRef.current.style.scrollBehavior = "auto";
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;

        // Re-enable smooth scrolling after updating scrollTop
        requestAnimationFrame(() => {
          if (scrollRef.current) {
            scrollRef.current.style.scrollBehavior = "smooth";
          }
        });
      }
    };

    if (intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        if (textDisplay.cursorSymbol === " ") {
          textDisplay.cursorSymbol = "|";
        } else {
          textDisplay.cursorSymbol = " ";
        }
        setTextDisplay(textDisplay);
      }, 550);
    }

    handleAutoScroll();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [textDisplay]);

  return <Renderer textDisplay={textDisplay} scrollRef={scrollRef} />;
};

export default TextDisplayRenderer;

const Renderer: React.FC<{
  textDisplay: TextDisplay;
  scrollRef: React.RefObject<HTMLDivElement>;
}> = ({ textDisplay, scrollRef }) => {
  const cursor = textDisplay.cursorSymbol;
  const cursorX = textDisplay.cursorX;
  const lines = textDisplay.lines;
  let newLines: Line[] = [];
  let linesCopy = lines.map((line) => line.copy());

  const splitLongLines = (line: Line): Line[] => {
    let text = line.text;
    const splitLines: string[] = [];

    while (text.length >= MAX_LINE_LENGTH) {
      const segment = text.slice(0, MAX_LINE_LENGTH);
      const lastSpace = segment.lastIndexOf(" ");

      if (lastSpace > -1) {
        splitLines.push(segment.slice(0, lastSpace));
        text = text.slice(lastSpace + 1);
      } else {
        splitLines.push(segment);
        text = text.slice(MAX_LINE_LENGTH);
      }
    }

    splitLines.push(text);
    return splitLines.map((splitText) => {
      const newLine = new Line(splitText, line.path);
      newLine.userGenerated = line.userGenerated;
      return newLine;
    });
  };

  linesCopy.forEach((line) => {
    newLines = newLines.concat(splitLongLines(line));
  });

  return (
    <div ref={scrollRef} style={divStyle}>
      {newLines.map((line, index) => {
        let content;
        if (line.text === " " && !line.userGenerated) {
          content = <br />;
        } else if (line.userGenerated || line.text === "") {
          let path = line.path;
          // Removes last "/" if not root
          if (line.path !== "/") {
            path = line.path.slice(0, line.path.length - 1);
          }

          // \ instead of /
          path = "C:" + path.replace(/\//g, "\\");

          let lineText = line.text;

          const firstSpace = lineText.indexOf(" "); // Find the first space in the remaining text
          const firstSegment =
            firstSpace !== -1 ? lineText.slice(0, firstSpace) : lineText;

          lineText =
            getColorString(firstSegment, getColor("function")) +
            lineText.slice(firstSegment.length); // Append the rest of the text

          let text = path + "> " + lineText;

          // Last Line
          if (index === newLines.length - 1) {
            // Calculates cursor position relative to full text length
            const adjustedCursorX = cursorX + path.length + 2 + 9;

            if (textDisplay.autoFillReplace) {
              lineText = textDisplay.autoFill;
              text = path + "> " + lineText;
            }

            // Adds cursor to last Line

            if (cursorX < lineText.length - 9) {
              console.log("cursorX", cursorX);
              console.log("lineText", lineText);
              lineText = insertColorString(lineText, cursor, cursorX);
              text = path + "> " + lineText;
            } else {
              text =
                text.slice(0, adjustedCursorX) +
                cursor +
                text.slice(adjustedCursorX);
            }
          }

          content = <span>{getColorDiv(text)}</span>;
        } else {
          content = <span>{getColorDiv(line.text)}</span>;
        }

        return <div key={index}>{content}</div>;
      })}
    </div>
  );
};

const divStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  position: "fixed",
  zIndex: 1,
  overflow: "auto",
  paddingBottom: "40vh",
};
