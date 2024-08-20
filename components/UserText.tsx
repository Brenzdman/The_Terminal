"use client";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { currentDirectoryAtom, textDisplayAtom } from "../constants/atoms";
import { TextDisplay } from "@/classes/TextDisplay";
import { Directory } from "@/classes/Directory";

const UserText = () => {
  const [textDisplay, setTextDisplay] = useAtom(textDisplayAtom);
  const [currentDirectory, setCurrentDirectory] = useAtom(currentDirectoryAtom);

  const handleKeyDown = (event: KeyboardEvent) => {
    const updatedTextDisplay = new TextDisplay();
    Object.assign(updatedTextDisplay, textDisplay);

    if (event.key.length === 1) {
      updatedTextDisplay.typeCharacter(event.key);
    } else if (event.key === "Backspace") {
      updatedTextDisplay.removeCharacter();
    } else if (event.key === "Enter") {
      getResponseText(textDisplay, currentDirectory);
    }

    setTextDisplay(updatedTextDisplay);
  };

  const getResponseText = (
    textDisplay: TextDisplay,
    currentDirectory: Directory
  ) => {
    const lastLine = textDisplay.lines[textDisplay.lines.length - 1].text;
    const text = lastLine.trim();

    let segments = text.split(" ");

    // Messages
    const welcomeMessage = [
      "Welcome to [#######] Terminal.",
      "Type 'help' to see a list of available commands.",
    ];

    const errorMessage = [
      "Error: Command not found. Type 'help' for a list of available commands.",
    ];

    const badCat = (fileName: string) => {
      return [`cat: file '${fileName}' not found.`];
    };

    const helpScreen = [
      "HELP MENU",
      " ",
      "Available commands:",
      "-------------------",
      "help         - Display this help menu.",
      "ls           - List available directories and files.",
      "cd [dir]     - Change to specified directory.",
      "cat [file]   - Display the content of a file.",
      "echo [text]  - Output text to the terminal.",
      "clear        - Clear the terminal screen.",
      "exit         - Close the terminal.",
    ];
    // End messages

    if (segments[0] === "help") {
      textDisplay.addLines(helpScreen);
    } else if (segments[0] === "ls") {
      textDisplay.addLines(currentDirectory.ls());
    } else if (segments[0] === "cd") {
      const dir = currentDirectory.cd(segments[1]);
      if (!dir)
        textDisplay.addLines(["cd: no such file or directory: " + segments[1]]);
      else {
        setCurrentDirectory(dir);
        textDisplay.newLine();
      }
    } else if (segments[0] === "cat") {
      const ran = currentDirectory.readFile(segments[1], textDisplay);
      if (!ran) textDisplay.addLines(badCat(segments[1]));
    } else if (segments[0] === "echo") {
      textDisplay.addLines([text.slice(5)]);
    } else if (segments[0] === "clear") {
      textDisplay.clear();
    } else if (segments[0] === "exit") {
      window.open("about:blank", "_self");
      window.close();
    } else if (segments[0] === "") {
      textDisplay.newLine();
    } else {
      const ran = currentDirectory.runFile(text, textDisplay);
      if (!ran) textDisplay.addLines(errorMessage);
    }
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
