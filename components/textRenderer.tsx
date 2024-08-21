import React, { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { textDisplayAtom } from "../constants/atoms";
import { Line } from "@/classes/TextDisplay";
import { MAX_LINE_LENGTH } from "@/constants/constants";

const TextDisplayRenderer: React.FC = () => {
  const [textDisplay] = useAtom(textDisplayAtom);
  const lines = textDisplay.lines;

  // ref to scroll
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return <Renderer lines={lines} scrollRef={scrollRef} />;
};

export default TextDisplayRenderer;

const Renderer: React.FC<{
  lines: Line[];
  scrollRef: React.RefObject<HTMLDivElement>;
}> = ({ lines, scrollRef }) => {
  const linesToText = (lines: Line[]) => {
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
            if (line.path !== "/")
              content = (
                <span>
                  {line.path.slice(0, line.path.length - 1) + "> " + line.text}
                </span>
              );
            else content = <span>{line.path + "> " + line.text}</span>;
          } else {
            content = <span>{line.text}</span>;
          }

          return <div key={index}>{content}</div>;
        })}
      </div>
    );
  };

  return linesToText(lines);
};

const divStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  position: "fixed",
  zIndex: 1,
  overflow: "auto",
  paddingBottom: "40vh",
};
