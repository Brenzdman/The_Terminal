"use client";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { textDisplayAtom } from "../constants/atoms";
import { TextDisplay } from "@/classes/TextDisplay";

const UserText = () => {
  const [textDisplay, setTextDisplay] = useAtom(textDisplayAtom);

  const handleKeyDown = (event: KeyboardEvent) => {
    const updatedTextDisplay = new TextDisplay();
    Object.assign(updatedTextDisplay, textDisplay);

    if (event.key.length === 1) {
      updatedTextDisplay.typeCharacter(event.key);
    } else if (event.key === "Backspace") {
      updatedTextDisplay.removeCharacter();
    } else if (event.key === "Enter") {
      getResponseText(textDisplay);
    }

    setTextDisplay(updatedTextDisplay);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [textDisplay]);

  return <div>{}</div>;
};

function getResponseText(textDisplay: TextDisplay) {
  const lastLine = textDisplay.lines[textDisplay.lines.length - 1].text;
  textDisplay.addLines(["You typed " + lastLine]);
}

export default UserText;
