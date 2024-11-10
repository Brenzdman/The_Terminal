import { Dir_File } from "@/classes/Directory";
import { DirectoryManager } from "@/classes/DirectoryManager";
import { changeProgram } from "@/terminal/components/ProgramManager";
import { VERSION } from "@/constants/constants";

export const introEXE = new Dir_File("intro", ".exe");

export function getOnRun(
  dm: DirectoryManager,
  showPopup: (arg0: any, arg1: any) => void
) {
  return async function (): Promise<void> {
    const onComplete = () => {
      const textDisplay = dm.textDisplay;
      textDisplay.addLines([`${VERSION}`]);
      textDisplay.newUserLine();
      changeProgram("desktop");
    };

    showPopup("ASCII", onComplete);
  };
}
