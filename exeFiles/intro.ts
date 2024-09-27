import { Dir_File } from "@/classes/Directory";
import { DirectoryManager } from "@/classes/DirectoryManager";
import { VERSION } from "@/constants/constants";

export const introEXE = new Dir_File("intro", ".exe");

export function getOnRun(
  dm: DirectoryManager,
  showPopup: (arg0: any, arg1: any) => void
) {
  return async function (): Promise<void> {
    dm.textDisplay.addLines("Welcome to the Terminal.");

    const onComplete = () => {
      const textDisplay = dm.textDisplay;
      textDisplay.addLines([
        "Congratulations! You have successfully decoded the ASCII message.",
        "This is all I have for you right now. See you in a future update.",
        "",
        `${VERSION}`,
      ]);
      textDisplay.newUserLine();
    };

    showPopup("ASCII", onComplete);
  };
}