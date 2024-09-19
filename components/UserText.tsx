// Collaborates heavily with userText.tsx and DirectoryManager.ts
"use client";

import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { DIRECTORY_MANAGER } from "./DirectoryAtom";
import { DirectoryManager } from "@/classes/DirectoryManager";
import { getDetailedHelp } from "@/functions/help";
import { errorMessage } from "@/functions/messages";
import { usePopup } from "@/components/AccessProvider";

const UserText = () => {
  const [directoryManager, setDirectoryManager] = useAtom(DIRECTORY_MANAGER);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIndex, setCmdIndex] = useState<number>(-1);
  const { isVisible: AccessBoxIsVisible } = usePopup();

  const handleRightClick = (event: MouseEvent) => {
    event.preventDefault();
    if (AccessBoxIsVisible) return;

    const pasteText = navigator.clipboard.readText();
    pasteText.then((text) => {
      const textDisplay = directoryManager.textDisplay;
      textDisplay.typeCharacter(text, true);

      const updatedDirectoryManager = new DirectoryManager();
      Object.assign(updatedDirectoryManager, {
        ...directoryManager,
      });
      setDirectoryManager(updatedDirectoryManager);
    });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (AccessBoxIsVisible) return;

    const textDisplay = directoryManager.textDisplay;
    if (event.key.length === 1 && !event.getModifierState("Control")) {
      textDisplay.typeCharacter(event.key, true);
    } else if (event.key === "Backspace") {
      if (event.getModifierState("Control")) {
        textDisplay.ctrlDelete("Left");
      } else {
        textDisplay.removeCharacter();
      }
    } else if (event.key === "Delete") {
      if (event.getModifierState("Control")) {
        textDisplay.ctrlDelete("Right");
      } else {
        textDisplay.deleteCharacter();
      }
    } else if (event.key === "Enter") {
      if (textDisplay.autoFillReplace) {
        const lastLine = textDisplay.getLastLine();
        lastLine.setText(textDisplay.autoFill);
        lastLine.userGenerated = true;
        textDisplay.autoFillReplace = false;
      }

      const cmd = textDisplay.getLastLine().getText().trim();

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
      if (event.getModifierState("Control")) {
        textDisplay.ctrlDelete("Left", false);
      } else {
        textDisplay.moveCursorLeft();
      }
    } else if (event.key === "ArrowRight") {
      if (event.getModifierState("Control")) {
        textDisplay.ctrlDelete("Right", false);
      } else {
        textDisplay.moveCursorRight();
      }
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

      // Sets the text to the command
      if (newCmdIndex === cmdHistory.length) {
        textDisplay.setAutofill("");
      } else {
        textDisplay.setAutofill(cmdHistory[newCmdIndex], true);
      }

      textDisplay.cursorX = textDisplay.autoFill.length;
      textDisplay.cursorSymbol = "|";

      // Update the index with the new calculated value
      setCmdIndex(newCmdIndex);
    } else {
      setCmdIndex(cmdHistory.length);
    }

    const updatedDirectoryManager = new DirectoryManager();
    Object.assign(updatedDirectoryManager, {
      ...directoryManager,
    });
    setDirectoryManager(updatedDirectoryManager);
  };

  const getResponseText = () => {
    const textDisplay = directoryManager.textDisplay;
    let currentDirectory = directoryManager.currentDirectory;
    const lastLine = textDisplay.getLastLine();
    const text = lastLine.getText().trim();

    const getSegments = (text: string): string[] => {
      let segments: string[] = [];

      let lineBreak = false;
      let currentSegment = "";

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === " " && !lineBreak) {
          segments.push(currentSegment);
          currentSegment = "";
        } else if (char === '"') {
          lineBreak = !lineBreak;
        } else {
          currentSegment += char;
        }

        if (i === text.length - 1) {
          segments.push(currentSegment);
        }
      }

      return segments;
    };

    let segments = getSegments(text);

    if (segments.length === 0) {
      textDisplay.newUserLine();
      return;
    }

    // Messages

    // Help CMD
    const cmd = segments[0].toLowerCase();
    if (cmd === "help") {
      textDisplay.addLines(getDetailedHelp(segments[1]));

      // List directories and files
    } else if (cmd === "ls" || cmd === "dir") {
      currentDirectory.ls(segments[1]);

      // Change directory
    } else if (cmd === "cd" || cmd === "chdir") {
      currentDirectory.cd(segments.slice(1).join(" "));

      // DeSync Fix
      directoryManager.currentDirectory =
        currentDirectory.directoryManager.currentDirectory;

      // Make new directory
    } else if (cmd === "mkdir" || cmd === "md") {
      segments.slice(1).forEach((segment) => {
        currentDirectory.makeDirectory(segment, true);
      });

      // Remove directoryA
    } else if (cmd === "rmdir" || cmd === "rd") {
      segments.slice(1).forEach((segment) => {
        currentDirectory.removeDirectory(segment);
      });

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

      // Move file
    } else if (cmd === "move") {
      currentDirectory.move(segments[1], segments[2]);

      // Delete file
    } else if (cmd === "del") {
      currentDirectory.deleteFile(segments[1]);
      // Clear terminal screen
    } else if (cmd === "cls" || cmd === "clear") {
      currentDirectory.clear();

      // Exit terminal
    } else if (cmd === "exit") {
      window.open("about:blank", "_self");
      window.close();

      // Run file
    } else if (cmd === "start") {
      currentDirectory.runFile(segments[1]);
    

      // Default
    } else if (cmd === "") {
      // Do nothing;
    } else {
      errorMessage(textDisplay, "invalidCommand", cmd);
    }

    textDisplay.autoFill = "";
    textDisplay.newUserLine();

    const updatedDirectoryManager = new DirectoryManager();
    Object.assign(updatedDirectoryManager, {
      ...directoryManager,
      currentDirectory: currentDirectory,
      currentPath: currentDirectory.path,
    });
    setDirectoryManager(updatedDirectoryManager);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleRightClick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleRightClick);
    };
  }, [directoryManager, cmdHistory, cmdIndex]);

  return <div>{}</div>;
};

export default UserText;
