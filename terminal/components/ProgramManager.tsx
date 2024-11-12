import { useEffect, useState } from "react";
import EventEmitter from "eventemitter3";
import { Icon } from "@/desktop/Icon";
import { IconManager } from "@/desktop/IconManager";
import AccessBox from "./AccessBox";
import { AccessProvider } from "./AccessProvider";
import ASCII from "./ASCII";
import { DirectoryAtom } from "./DirectoryAtom";
import FullscreenButton from "../../components/FullscreenButton";
import MobileInput from "./MobileInput";
import TextRenderer from "../../components/TextRenderer";
import UserText from "./UserText";
import SelectionBox, { selectionAtom } from "@/desktop/SelectionBox";
import { useAtom } from "jotai";
import { ICON_WIDTH } from "@/constants/constants";

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
  const [mainIconManager, setIconManager] = useState(new IconManager());
  const [selectedArea] = useAtom(selectionAtom);
  const [initialized, setInitialized] = useState(false);
  const [render, triggerRender] = useState(false);

  const handleResize = () => {
    if (typeof window !== "undefined") {
      mainIconManager.xMult = window.innerWidth / mainIconManager.gridWidth;
      mainIconManager.yMult = window.innerHeight / mainIconManager.gridHeight;
    }
    triggerRender((prev) => !prev);
  };

  const handleClick = (event: MouseEvent) => {
    mainIconManager.handleIconClick(event);
    triggerRender((prev) => !prev);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Delete") {
      // if save.txt is selected, delete it
      for (let i = 0; i < mainIconManager.icons.length; i++) {
        const icon = mainIconManager.icons[i];

        if (icon.isSelected) {
          mainIconManager.icons.splice(i, 1);
          i--;
          if (icon.name === "save.txt") {
            localStorage.clear();
            window.location.reload();
          }
        }
      }
      triggerRender((prev) => !prev);
    }
  };

  useEffect(() => {
    if (!selectedArea) return;

    const { left: x, top: y, width, height } = selectedArea;

    mainIconManager.icons.forEach((icon) => {
      icon.isSelected = false;
    });

    // Checks if icon is within the selected area
    // Needs to be updated
    mainIconManager.icons.forEach((icon) => {
      if (
        icon.relativeX + ICON_WIDTH >= x &&
        icon.relativeX <= x + width - ICON_WIDTH / 3 &&
        icon.relativeY + ICON_WIDTH >= y &&
        icon.relativeY <= y + height
      ) {
        icon.isSelected = true;
      }
    });
    triggerRender((prev) => !prev);
  }, [selectedArea]);

  const handleProgramChange = (newProgram: string) => setProgram(newProgram);

  if (!initialized) {
    mainIconManager.addIcon(new Icon("page.png", "save.txt", 0, 0), 0, 0);
    mainIconManager.fillArrayWithIcons();
    handleResize();
    setInitialized(true);
  }

  useEffect(() => {
    const storedProgram = localStorage?.getItem("program");
    if (storedProgram) setProgram(storedProgram);

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClick);
    programEventEmitter.on("changeProgram", handleProgramChange);

    document.body.style.backgroundColor =
      program === "terminal" ? "#000000" : "#269db5";

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
      programEventEmitter.off("changeProgram", handleProgramChange);
    };
  }, [program]);

  return (
    <div>
      <AccessProvider>
        <AccessBox />
      </AccessProvider>
      <FullscreenButton />
      <DirectoryAtom>
        {program === "terminal" ? (
          <div style={{ padding: "20px" }}>
            <ASCII />
            <UserText />
            <TextRenderer />
            <MobileInput />
          </div>
        ) : program === "desktop" ? (
          <div>
            {mainIconManager.displayIcons()}
            <SelectionBox />
          </div>
        ) : (
          <div>Invalid program</div>
        )}
      </DirectoryAtom>
    </div>
  );
};
