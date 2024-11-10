// Collaborates heavily with userText.tsx and DirectoryManager.ts
"use client";

import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { DIRECTORY_MANAGER } from "./DirectoryAtom";
import { DirectoryManager } from "@/classes/DirectoryManager";
import { getDetailedHelp } from "@/terminal/functions/help";
import { errorMessage } from "@/terminal/functions/messages";
import { usePopup } from "@/terminal/components/AccessProvider";
import { getCommandList, saveCommandList } from "@/terminal/functions/storage";
import { StyledText } from "@/classes/StyledText";
import { SAVE_PATH } from "@/constants/constants";

const UserText = () => {
  const [directoryManager, setDirectoryManager] = useAtom(DIRECTORY_MANAGER);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIndex, setCmdIndex] = useState<number>(-1);
  const [savedText, setSavedText] = useState<string | null>(null);
  const { isVisible: AccessBoxIsVisible } = usePopup();
  const [hasLoaded, setHasLoaded] = useState(false);

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
    const textDisplay = directoryManager.textDisplay;
    const lastLine = textDisplay.getLastLine();

    if (AccessBoxIsVisible || !lastLine.userGenerated) return;

    if (
      textDisplay.autoFillReplace &&
      event.key !== "ArrowUp" &&
      event.key !== "ArrowDown"
    ) {
      textDisplay.getLastLine().setText(textDisplay.autoFill);
      textDisplay.autoFillReplace = false;
      setSavedText(null);
    }

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
      if (cmdHistory.length == 0) return;

      let newCmdIndex = cmdIndex;

      // Gets the next or previous command
      if (event.key === "ArrowUp") {
        if (cmdIndex === -1 || cmdIndex === cmdHistory.length) {
          setSavedText(lastLine.getText());
        }
        newCmdIndex = Math.max(0, cmdIndex - 1);
      } else if (event.key === "ArrowDown") {
        newCmdIndex = Math.min(cmdHistory.length, cmdIndex + 1);
      }

      // Sets the text to the command
      if (newCmdIndex === cmdHistory.length) {
        textDisplay.setAutofill("");
        if (savedText != null) {
          textDisplay.getLastLine().setText(savedText);
          textDisplay.cursorX = savedText.length;
        }
      } else {
        textDisplay.setAutofill(cmdHistory[newCmdIndex], true);
        textDisplay.cursorX = textDisplay.autoFill.length;
      }

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

  const getResponseText = (altCommand?: string) => {
    const textDisplay = directoryManager.textDisplay;
    let currentDirectory = directoryManager.currentDirectory;
    const lastLine = textDisplay.getLastLine();
    let text = altCommand || lastLine.getText().trim();

    const getSegments = (text: string): string[] => {
      let segments: string[] = [];
      let currentSegment = "";
      let inDoubleQuotes = false;
      let inApostrophes = false;

      for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char === '"' && !inApostrophes) {
          // Toggle double-quote mode
          inDoubleQuotes = !inDoubleQuotes;
          // currentSegment += char;
        } else if (char === "'" && !inDoubleQuotes) {
          // Toggle backtick mode
          inApostrophes = !inApostrophes;
          currentSegment += char;
        } else if (char === " " && !inDoubleQuotes && !inApostrophes) {
          // If we hit a space and we're not inside quotes or backticks, start a new segment
          if (currentSegment.length > 0) {
            segments.push(currentSegment);
            currentSegment = "";
          }
        } else {
          // Add the character to the current segment
          currentSegment += char;
        }

        // Push the last segment if we're at the end of the text
        if (i === text.length - 1 && currentSegment.length > 0) {
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

    let skipSaveCmd = false;

    // Help CMD
    const cmd = segments[0].toLowerCase();
    if (cmd === "help") {
      textDisplay.addLines(getDetailedHelp(segments[1]));

      // List directories and files
    } else if (cmd === "ls" || cmd === "dir") {
      currentDirectory.ls(segments[1]);
      skipSaveCmd = true;

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
      skipSaveCmd = true;

      // Echo text to terminal
    } else if (cmd === "echo") {
      let path = currentDirectory.echo(segments.slice(1));

      console.log("path", path);
      if (path == SAVE_PATH + "save.txt") {
        skipSaveCmd = true;

        let saveFile = directoryManager
          .getDirectory(undefined, SAVE_PATH)
          ?.addFile("save.txt", true);
        let currentContent: string[] =
          saveFile?.content.map((line) => line.text) || [];

        saveCommandList(currentContent);
        window.location.reload();
      }

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
      let path = currentDirectory.deleteFile(segments[1]);

      // if deleting save file, reset system
      if (path == SAVE_PATH + "save.txt") {
        skipSaveCmd = true;

        // refresh page
        localStorage.clear();
        window.location.reload();

        /*
        const newDM = generateDirectory(showPopup);

        const resetDirectoryManager = new DirectoryManager();
        Object.assign(resetDirectoryManager, {
          ...newDM,
          currentDirectory: newDM.currentDirectory,
          currentPath: newDM.currentDirectory.path,
        });

        setDirectoryManager(resetDirectoryManager);
        localStorage.clear();
        directoryManager.textDisplay.newUserLine();
        return;
        */
      }
      // Clear terminal screen
    } else if (cmd === "cls" || cmd === "clear") {
      currentDirectory.clear();
      skipSaveCmd = true;

      // Exit terminal
    } else if (cmd === "exit") {
      window.open("about:blank", "_self");
      window.close();

      // Run file
    } else if (cmd === "start") {
      currentDirectory.runFile(segments[1]);
      skipSaveCmd = true;

      // Default
    } else if (cmd === "") {
      // Do nothing;
      skipSaveCmd = true;
    } else {
      skipSaveCmd = true;
      errorMessage(textDisplay, "invalidCommand", cmd);
    }

    if (!skipSaveCmd) {
      // Updates save file
      const currentSuppression = textDisplay.suppressDialog;
      textDisplay.suppressDialog = true;
      let saveFile = directoryManager
        .getDirectory(undefined, SAVE_PATH)
        ?.addFile("save.txt", true);
      let currentContent: string[] =
        saveFile?.content.map((line) => line.text) || [];

      currentContent.push(text);

      makeSaveFile(currentContent);
      saveCommandList(currentContent);

      textDisplay.suppressDialog = currentSuppression;
    }

    textDisplay.autoFill = "";
    textDisplay.newUserLine();

    const updatedDirectoryManager = new DirectoryManager();
    Object.assign(updatedDirectoryManager, {
      ...directoryManager,
      currentDirectory: currentDirectory,
      currentPath: currentDirectory.path,
    });

    if (!altCommand) {
      setDirectoryManager(updatedDirectoryManager);
    }
  };

  const makeSaveFile = (cmdList: string[]) => {
    // Makes `save file`
    const saveFile = directoryManager
      .getDirectory(undefined, SAVE_PATH)
      ?.addFile("save.txt", true);

    let content: StyledText[] = cmdList.map((cmd) => {
      return new StyledText(cmd);
    });

    saveFile!.content = content;
  };

  if (!hasLoaded) {
    // Load commands from previous sessions
    directoryManager.textDisplay.suppressDialog = true;

    const cmdList = getCommandList();
    cmdList.forEach((cmd) => {
      getResponseText(cmd);
    });
    setHasLoaded(true);
    makeSaveFile(cmdList);
    directoryManager.textDisplay.suppressDialog = false;

    // Force updates last line.
    directoryManager.textDisplay.typeCharacter("", true);
    directoryManager.textDisplay.newUserLine();
  }

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
