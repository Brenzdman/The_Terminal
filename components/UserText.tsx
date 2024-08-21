"use client";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { currentDirectoryAtom, textDisplayAtom } from "../constants/atoms";
import { TextDisplay } from "@/classes/TextDisplay";
import { getColor, getColorString } from "@/functions/color";
import { get } from "http";

const UserText = () => {
  const [mainTextDisplay, setTextDisplay] = useAtom(textDisplayAtom);
  const [currentDirectory, setCurrentDirectory] = useAtom(currentDirectoryAtom);
  const textDisplay = new TextDisplay("placeholder");
  Object.assign(textDisplay, mainTextDisplay);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key.length === 1) {
      textDisplay.typeCharacter(event.key, true);
    } else if (event.key === "Backspace") {
      textDisplay.removeCharacter();
    } else if (event.key === "Enter") {
      getResponseText();
    }

    setTextDisplay(textDisplay);
  };

  const getResponseText = () => {
    const lastLine = textDisplay.lines[textDisplay.lines.length - 1].text;
    const text = lastLine.trim();

    let segments = text.split(" ");

    // Messages
    const errorColor = getColor("error");
    const errorMessage = getColorString(
      "Error: Command not found. Type 'help' for a list of available commands.",
      errorColor
    );

    const badCat = (fileName: string) => {
      return getColorString(`cat: file '${fileName}' not found.`, errorColor);
    };

    const badCd = (dirName: string) => {
      return getColorString(
        `cd: no such file or directory: ${dirName}`,
        errorColor
      );
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
    // Commands

    // Help
    if (segments[0] === "help") {
      textDisplay.addLines(helpScreen);

      // List directories and files
    } else if (segments[0] === "ls") {
      textDisplay.addLines(currentDirectory.ls());

      // Change directory
    } else if (segments[0] === "cd") {
      const dir = currentDirectory.cd(segments[1]);
      if (!dir) textDisplay.addLines(badCd(segments[1]));
      else {
        setCurrentDirectory(dir);
        textDisplay.setPath(dir.path);
        console.log(currentDirectory);
        textDisplay.newLine();
      }

      // Display txt file content
    } else if (segments[0] === "cat") {
      const ran = currentDirectory.readFile(segments[1], textDisplay);
      if (!ran) textDisplay.addLines(badCat(segments[1]));

      // Echo text to terminal
    } else if (segments[0] === "echo") {
      textDisplay.addLines([text.slice(5)]);

      // Clear terminal screen
    } else if (segments[0] === "clear") {
      textDisplay.clear();

      // Exit terminal
    } else if (segments[0] === "exit") {
      window.open("about:blank", "_self");
      window.close();

      // Run file
    } else if (segments[0] === "") {
      textDisplay.newLine();
    } else {
      const ran = currentDirectory.runFile(text, textDisplay);
      if (!ran) textDisplay.addLines(errorMessage);
    }
    setTextDisplay(textDisplay);
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
