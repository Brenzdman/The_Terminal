"use client";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { textDisplayAtom } from "../constants";
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
      updatedTextDisplay.newLine();
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

export default UserText;
