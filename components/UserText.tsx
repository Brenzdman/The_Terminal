// Collaborates heavily with userText.tsx and DirectoryManager.ts

"use client";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { DIRECTORY_MANAGER } from "../constants/atoms";
import { getColor, getColorString } from "@/functions/color";
import { Directory_Manager } from "@/classes/DirectoryManager";
import { getDetailedHelp } from "@/functions/help";

const UserText = () => {
  const [directoryManager, setDirectoryManager] = useAtom(DIRECTORY_MANAGER);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIndex, setCmdIndex] = useState<number>(-1);

  const handleKeyDown = (event: KeyboardEvent) => {
    const textDisplay = directoryManager.textDisplay;
    if (event.key.length === 1) {
      textDisplay.typeCharacter(event.key, true);
    } else if (event.key === "Backspace") {
      textDisplay.removeCharacter();
    } else if (event.key === "Delete") {
      textDisplay.deleteCharacter();
    } else if (event.key === "Enter") {
      if (textDisplay.autoFillReplace) {
        const lastLine = textDisplay.getLastLine();
        lastLine.text = textDisplay.autoFill;
        lastLine.userGenerated = true;
        textDisplay.autoFillReplace = false;
      }

      const cmd = textDisplay.getLastLine().text.trim();

      setCmdHistory((prevHistory) => {
        if (!cmd) return prevHistory;

        const newHistory = [...prevHistory];
        if (newHistory.length >= 100) {
          newHistory.shift();
        }

        if (newHistory.includes(cmd)) {
          newHistory.splice(newHistory.indexOf(cmd), 1);
        }

        newHistory.push(cmd);
        setCmdIndex(newHistory.length);
        return newHistory;
      });

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

    const updatedDirectoryManager = new Directory_Manager();
    Object.assign(updatedDirectoryManager, {
      ...directoryManager,
    });
    setDirectoryManager(updatedDirectoryManager);
  };

  const getResponseText = () => {
    const textDisplay = directoryManager.textDisplay;
    let currentDirectory = directoryManager.currentDirectory;
    const lastLine = textDisplay.getLastLine();
    const text = lastLine.text.trim();

    let segments = text.split(" ");

    // Messages
    const errorColor = getColor("error");
    const errorMessage = getColorString(
      "Error: Command not found. Type 'help' for a list of available commands.",
      errorColor
    );

    // Help
    const cmd = segments[0].toLowerCase();
    if (cmd === "help") {
      textDisplay.addLines(getDetailedHelp(segments[1]));

      // List directories and files
    } else if (cmd === "ls" || cmd === "dir") {
      currentDirectory.ls(segments[1]);

      // Change directory
    } else if (cmd === "cd" || cmd === "chdir") {
      currentDirectory.cd(segments[1]);

      // DeSync Fix
      directoryManager.currentDirectory =
        currentDirectory.directoryManager.currentDirectory;

      // Make new directory
    } else if (cmd === "mkdir" || cmd === "md") {
      currentDirectory.makeDirectory(segments[1], true);

      // Remove directoryA
    } else if (cmd === "rmdir" || cmd === "rd") {
      currentDirectory.removeDirectory(segments[1]);

      // Display txt file content
    } else if (cmd === "type") {
      currentDirectory.readFile(segments[1]);

      // Echo text to terminal
    } else if (cmd === "echo") {
      currentDirectory.echo(segments.slice(1));

      // Rename file
    } else if (cmd === "ren" || cmd === "rename") {
      currentDirectory.rename(segments[1], segments[2]);
      // Copy file
    } else if (cmd === "copy") {
      currentDirectory.copy(segments[1], segments[2]);
      // Clear terminal screen
    } else if (cmd === "cls" || cmd === "clear") {
      textDisplay.clear();

      // Exit terminal
    } else if (cmd === "exit") {
      window.open("about:blank", "_self");
      window.close();

      // Run file
    } else if (cmd === "start") {
      currentDirectory.runFile(segments[1]);

      // Default
    } else if (cmd === "") {
      textDisplay.newLine();
    } else {
      textDisplay.addLines(errorMessage);
    }

    textDisplay.autoFill = "";

    const updatedDirectoryManager = new Directory_Manager();
    Object.assign(updatedDirectoryManager, {
      ...directoryManager,
      currentDirectory: currentDirectory,
      currentPath: currentDirectory.path,
    });
    setDirectoryManager(updatedDirectoryManager);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [directoryManager, cmdHistory, cmdIndex]);

  return <div>{}</div>;
};

export default UserText;
