"use client";

import AccessBox from "./AccessBox";
import { AccessProvider } from "./AccessProvider";
import ASCII from "./ASCII";
import { DirectoryAtom } from "./DirectoryAtom";
import FullscreenButton from "../../components/FullscreenButton";
import MobileInput from "./MobileInput";
import TextRenderer from "../../components/TextRenderer";
import UserText from "./UserText";
import EventEmitter from "eventemitter3";
import { useEffect, useState } from "react";

const programEventEmitter = new EventEmitter();

export function changeProgram(program: string) {
  console.log("Changing program to", program);
  programEventEmitter.emit("changeProgram", program);
  if (typeof window !== "undefined") {
    localStorage.setItem("program", program);
  }
}

export const ProgramManager = () => {
  const [program, setProgram] = useState("terminal");

  useEffect(() => {
    const storedProgram = localStorage?.getItem("program");
    if (storedProgram) {
      setProgram(storedProgram);
    }

    const handleProgramChange = (newProgram: string) => setProgram(newProgram);

    // Subscribe to the event
    programEventEmitter.on("changeProgram", handleProgramChange);

    if (program === "terminal") {
      document.body.style.backgroundColor = "#000000";
    } else if (program === "desktop") {
      document.body.style.backgroundColor = "#269db5";
    }

    return () => {
      // Clean up the subscription on unmount
      programEventEmitter.off("changeProgram", handleProgramChange);
    };
  }, [program]);

  if (program === "terminal") {
    return (
      <div>
        <AccessProvider>
          <AccessBox />
        </AccessProvider>

        <FullscreenButton />

        <DirectoryAtom>
          <ASCII />
          <UserText />
          <TextRenderer />
          <MobileInput />
        </DirectoryAtom>
      </div>
    );
  } else if (program === "desktop") {
    return (
      <div>
        <FullscreenButton />
      </div>
    );
  } else {
    throw new Error(`Unknown program: ${program}`);
  }
};
