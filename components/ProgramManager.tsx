"use client";

import AccessBox from "./AccessBox";
import { AccessProvider } from "./AccessProvider";
import ASCII from "./ASCII";
import { DirectoryAtom } from "./DirectoryAtom";
import FullscreenButton from "./FullscreenButton";
import MobileInput from "./MobileInput";
import TextRenderer from "./TextRenderer";
import UserText from "./UserText";
import EventEmitter from "eventemitter3";
import { useEffect, useState } from "react";

const programEventEmitter = new EventEmitter();

export function changeProgram(program: string) {
  console.log("Changing program to", program);
  programEventEmitter.emit("changeProgram", program);
  localStorage.setItem("program", program);
}

export const ProgramManager = () => {
  const storedProgram = localStorage.getItem("program");
  const [program, setProgram] = useState(storedProgram || "terminal");

  console.log("Program is", program);

  useEffect(() => {
    const handleProgramChange = (newProgram: string) => setProgram(newProgram);

    // Subscribe to the event
    programEventEmitter.on("changeProgram", handleProgramChange);

    return () => {
      // Clean up the subscription on unmount
      programEventEmitter.off("changeProgram", handleProgramChange);
    };
  }, []);

  if (program === "terminal") {
    useEffect(() => {
      document.body.style.backgroundColor = "#000000";
    }, []);
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
    useEffect(() => {
      document.body.style.backgroundColor = "#269db5";
    }, []);
    return (
      <div>
        <FullscreenButton />
      </div>
    );
  } else {
    throw new Error(`Unknown program: ${program}`);
  }
};
