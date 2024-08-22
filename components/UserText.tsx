"use client";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { currentDirectoryAtom, textDisplayAtom } from "../constants/atoms";
import { TextDisplay } from "@/classes/TextDisplay";
import { getColor, getColorString } from "@/functions/color";

const UserText = () => {
  const [mainTextDisplay, setTextDisplay] = useAtom(textDisplayAtom);
  const [currentDirectory, setCurrentDirectory] = useAtom(currentDirectoryAtom);
  const textDisplay = new TextDisplay("placeholder");
  Object.assign(textDisplay, mainTextDisplay);

  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIndex, setCmdIndex] = useState<number>(-1);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key.length === 1) {
      textDisplay.typeCharacter(event.key, true);
    } else if (event.key === "Backspace") {
      textDisplay.removeCharacter();
    } else if (event.key === "Enter") {
      if (textDisplay.autoFillReplace) {
        const lastLine = textDisplay.getLastLine();
        lastLine.text = textDisplay.autoFill;
        lastLine.userGenerated = true;
        textDisplay.autoFillReplace = false;
      }

      const cmd = textDisplay.getLastLine().text.trim();

      setCmdHistory((prevHistory) => {
        console.log("cmd", cmd);
        if (!cmd) return prevHistory;

        if (cmdHistory.length >= 100) {
          cmdHistory.shift();
        }

        if (cmdHistory.includes(cmd)) {
          cmdHistory.splice(cmdHistory.indexOf(cmd), 1);
        }

        const newHistory = [...prevHistory, cmd];
        setCmdIndex(newHistory.length);
        return newHistory;
      });

      console.log("cmdHistory", cmdHistory);
      getResponseText();
    } else if (event.key === "ArrowLeft") {
      textDisplay.moveCursorLeft();
    } else if (event.key === "ArrowRight") {
      textDisplay.moveCursorRight();
    }

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      if (cmdIndex < 0) return;

      let newCmdIndex = cmdIndex;

      // Gets the next or previous command
      if (event.key === "ArrowUp") {
        newCmdIndex = Math.max(0, cmdIndex - 1);
      } else if (event.key === "ArrowDown") {
        newCmdIndex = Math.min(cmdHistory.length, cmdIndex + 1);
      }

      console.log("cmdIndex", newCmdIndex);
      // Sets the text to the command
      if (newCmdIndex === cmdHistory.length) {
        textDisplay.setAutofill("");
      } else {
        textDisplay.setAutofill(cmdHistory[newCmdIndex], true);
        console.log(cmdHistory[newCmdIndex]);
      }

      textDisplay.cursorX = textDisplay.autoFill.length;
      textDisplay.cursorSymbol = "|";

      // Update the index with the new calculated value
      setCmdIndex(newCmdIndex);
    } else {
      setCmdIndex(cmdHistory.length);
    }

    setTextDisplay(textDisplay);
  };

  const getResponseText = () => {
    const lastLine = textDisplay.getLastLine();
    const text = lastLine.text.trim();

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

    textDisplay.autoFill = "";
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
