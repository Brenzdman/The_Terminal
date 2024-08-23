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

  const formatPath = (path: string): string => {
    // Removes last "/" if not root and replaces "/" with "\"
    return path === "/"
      ? "C:\\"
      : "C:" + path.slice(0, -1).replace(/\//g, "\\");
  };

  const formatLineText = (lineText: string): string => {
    const firstSpace = lineText.indexOf(" ");
    const firstSegment =
      firstSpace !== -1 ? lineText.slice(0, firstSpace) : lineText;
    return (
      getColorString(firstSegment, getColor("function")) +
      lineText.slice(firstSegment.length)
    );
  };

  const renderLastLine = (
    path: string,
    lineText: string,
    cursorX: number,
    cursor: string,
    autoFillReplace: boolean,
    autoFill: string
  ): string => {
    // Adjusts cursor position for color codes
    const adjustedCursorX = cursorX + 9;

    if (autoFillReplace) {
      lineText = autoFill;
    }

    let firstSpace = lineText.indexOf(" ");
    firstSpace = firstSpace === -1 ? lineText.length : firstSpace;
    // Checks if color code needs to be modified for cursor
    if (cursorX < firstSpace - 8) {
      let firstSegment = lineText.slice(0, firstSpace);
      firstSegment = insertColorString(firstSegment, cursor, cursorX);
      const remainingText = lineText.slice(firstSpace);

      lineText = firstSegment + remainingText;
    } else {
      lineText =
        lineText.slice(0, adjustedCursorX) +
        cursor +
        lineText.slice(adjustedCursorX);
    }

    return path + "> " + lineText;
  };

  const renderLineContent = (
    line: Line, // Replace 'any' with the appropriate type
    index: number,
    cursorX: number,
    cursor: string,
    textDisplay: TextDisplay, // Replace 'any' with the appropriate type
    newLines: Line[] // Replace 'any[]' with the appropriate type
  ): React.ReactElement => {
    let content;

    if (line.text === " " && !line.userGenerated) {
      content = <br />;
    } else if (line.userGenerated || line.text === "") {
      const path = formatPath(line.path);
      let lineText = formatLineText(line.text);
      let text = path + "> " + lineText;

      if (index === newLines.length - 1) {
        text = renderLastLine(
          path,
          lineText,
          cursorX,
          cursor,
          textDisplay.autoFillReplace,
          textDisplay.autoFill
        );
      }

      content = <span>{getColorDiv(text)}</span>;
    } else {
      content = <span>{getColorDiv(line.text)}</span>;
    }

    return <div key={index}>{content}</div>;
  };

  return (
    <div ref={scrollRef} style={divStyle}>
      {newLines.map((line, index) =>
        renderLineContent(line, index, cursorX, cursor, textDisplay, newLines)
      )}
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
