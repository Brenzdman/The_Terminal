import React, { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { TextDisplay } from "@/classes/TextDisplay";
import { Line } from "@/classes/Line";
import { DirectoryManager } from "@/classes/DirectoryManager";
import { DIRECTORY_MANAGER } from "./DirectoryAtom";
import { usePopup } from "@/components/AccessProvider";

const TextRenderer: React.FC = () => {
  const [directoryManager, setDirectoryManager] = useAtom(DIRECTORY_MANAGER);
  const textDisplay = directoryManager.textDisplay;
  const { isVisible: AccessBoxIsVisible } = usePopup();

  const [prevLineLength, setPrevLineLength] = useState<number>(
    textDisplay.lines.length
  );

  const [prevScrollHeight, setPrevScrollHeight] = useState<number>(0);

  // ref to scroll
  const scrollRef = useRef<HTMLDivElement>(null);
  // cursor blink
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === " " && event.target instanceof HTMLElement) {
      if (event.target.tagName.toLowerCase() === "input") {
        return; // Do nothing, allow space input
      }

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
        textDisplay.cursorSymbol = textDisplay.cursorSymbol === " " ? "|" : " ";
        const updateDirectory = new DirectoryManager();
        Object.assign(updateDirectory, directoryManager);
        setDirectoryManager(updateDirectory);
      }, 520);
    }

    handleAutoScroll();
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [directoryManager]);

  const formatPath = (path: string): string => {
    // Removes last "/" if not root and replaces "/" with "\"
    return path === "/"
      ? "C:\\"
      : "C:" + path.slice(0, -1).replace(/\//g, "\\");
  };

  const renderStaticLine = (line: Line, index: number): React.ReactElement => {
    let content, path;

    // If line is not user generated, display as is
    if (line.userGenerated) {
      path = formatPath(line.path);
    } else {
      const text = line.getText();
      if (text.trim() === "") {
        return <div key={index}>{<br />}</div>;
      }
    }
    content = <span>{line.getDiv(path)[0]}</span>;
    return <div key={index}>{content}</div>;
  };

  const renderFinalLine = (
    line: Line,
    index: number,
    cursorX: number,
    cursor: string,
    textDisplay: TextDisplay
  ): React.ReactElement => {
    let content;

    const path = formatPath(line.path);
    const pathStart = path + "> ";

    let adjustedCursorX = pathStart.length;

    if (textDisplay.autoFillReplace) {
      line.setText(textDisplay.autoFill);
      adjustedCursorX += textDisplay.autoFill.length;
    } else {
      adjustedCursorX += cursorX;
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

    if (AccessBoxIsVisible) {
      cursor = " ";
    }

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

  const Renderer = () => {
    const cursor = textDisplay.cursorSymbol;
    const cursorX = textDisplay.cursorX;
    const lines = textDisplay.lines;
    let newLines = lines.map((line) => line.copy());
    const finalLine = newLines[newLines.length - 1];
    const staticLines = textDisplay.lines.slice(0, -1);

    return (
      <div ref={scrollRef} style={divStyle}>
        {staticLines.map((line, index) => renderStaticLine(line, index))}
        {renderFinalLine(
          finalLine,
          newLines.length - 1,
          cursorX,
          cursor,
          textDisplay
        )}
      </div>
    );
  };

  return Renderer();
};

export default TextRenderer;

const divStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  position: "fixed",
  zIndex: 1,
  overflow: "auto",
  paddingBottom: "40vh",
};
