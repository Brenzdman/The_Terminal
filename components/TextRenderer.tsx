import React, { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { TextDisplay } from "@/classes/TextDisplay";
import { Line } from "@/classes/Line";
import { Directory_Manager } from "@/classes/DirectoryManager";
import { DIRECTORY_MANAGER } from "./DirectoryAtom";

const TextRenderer: React.FC = () => {
  const [directoryManager, setDirectoryManager] = useAtom(DIRECTORY_MANAGER);
  const textDisplay = directoryManager.textDisplay;

  const [prevLineLength, setPrevLineLength] = useState<number>(
    textDisplay.lines.length
  );

  const [prevScrollHeight, setPrevScrollHeight] = useState<number>(0);

  // ref to scroll
  const scrollRef = useRef<HTMLDivElement>(null);
  // cursor blink
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

      scrollRef.current.scrollTop = prevScrollHeight - window.innerHeight * 0.4;
      setPrevScrollHeight(scrollRef.current.scrollHeight);
      // Re-enable smooth scrolling after updating scrollTop
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.style.scrollBehavior = "smooth";
        }
      });
    }
  };

  useEffect(() => {
    if (intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        if (textDisplay.cursorSymbol === " ") {
          textDisplay.cursorSymbol = "|";
        } else {
          textDisplay.cursorSymbol = " ";
        }
        const updateDirectory = new Directory_Manager();
        Object.assign(updateDirectory, directoryManager);
        setDirectoryManager(updateDirectory);
      }, 550);
    }

    handleAutoScroll();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [directoryManager]);

  return <Renderer textDisplay={textDisplay} scrollRef={scrollRef} />;
};

export default TextRenderer;

const Renderer: React.FC<{
  textDisplay: TextDisplay;
  scrollRef: React.RefObject<HTMLDivElement>;
}> = ({ textDisplay, scrollRef }) => {
  const cursor = textDisplay.cursorSymbol;
  const cursorX = textDisplay.cursorX;
  const lines = textDisplay.lines;
  let newLines = lines.map((line) => line.copy());

  const formatPath = (path: string): string => {
    // Removes last "/" if not root and replaces "/" with "\"
    return path === "/"
      ? "C:\\"
      : "C:" + path.slice(0, -1).replace(/\//g, "\\");
  };

  const renderLineContent = (
    line: Line,
    index: number,
    cursorX: number,
    cursor: string,
    textDisplay: TextDisplay,
    newLines: Line[]
  ): React.ReactElement => {
    let content;

    // If line is not user generated, display as is
    if (!line.userGenerated) {
      // const text = addLineBreaks(line.text);
      const text = line.getText();
      // If line is empty, create empty space
      if (text.trim() === "") {
        content = <br />;
      } else {
        content = <span>{line.getDiv()[0]}</span>;
      }
      return <div key={index}>{content}</div>;
    }

    const path = formatPath(line.path);
    const pathStart = path + "> ";
    let adjustedCursorX = cursorX + pathStart.length;

    // If not last line:
    if (index !== newLines.length - 1) {
      content = <span>{line.getDiv(path)[0]}</span>;
      return <div key={index}>{content}</div>;
    }

    // If last line, and autoFill is set, replace line text with autoFill
    if (textDisplay.autoFillReplace) {
      line.setText(textDisplay.autoFill);
      adjustedCursorX = pathStart.length + textDisplay.autoFill.length;
    }

    const [mainDiv, text] = line.getDiv(path);

    // Gets relative cursor position based on line breaks.
    let cursorText = "";
    let numBreaks = 0;
    for (let i = 0; i < adjustedCursorX + numBreaks; i++) {
      cursorText += text[i];
      if (text[i] === "\n") {
        numBreaks++;
      }
    }

    const lastLineBreak = cursorText.lastIndexOf("\n");

    let adjustedCursorY = numBreaks;
    adjustedCursorX -= lastLineBreak - numBreaks + 1;

    content = (
      <div style={{ position: "relative" }}>
        <span>{mainDiv}</span>
        <span
          style={{
            position: "absolute",
            top: adjustedCursorY * 1.5 + "em",
            left: adjustedCursorX + "ch",
            zIndex: 1,
            transform: "translateX(-50%) scaleX(0.5)",
            display: "inline-block",
            color: "#ffffff",
          }}
        >
          {cursor}
        </span>
      </div>
    );

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
