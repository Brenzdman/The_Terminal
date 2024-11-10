import { DirectoryManager } from "@/classes/DirectoryManager";
import { usePopup } from "@/terminal/components/AccessProvider";
import { generateDirectory } from "@/terminal/functions/generateDirectory";
import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";

// Atoms
const directoryManager = new DirectoryManager();
export const DIRECTORY_MANAGER = atom(directoryManager);

export function DirectoryAtom({ children }: { children: React.ReactNode }) {
  const [directoryManager, setDirectoryManager] = useAtom(DIRECTORY_MANAGER);
  const [isInitialized, setIsInitialized] = useState(false);
  const { showPopup } = usePopup();

  useEffect(() => {
    const updatedDirectoryManager = generateDirectory(showPopup);
    setDirectoryManager(updatedDirectoryManager);
    setIsInitialized(true);
  }, [setDirectoryManager, showPopup]);
  if (!isInitialized) {
    return <span>Loading...</span>;
  } else {
    return <div>{children}</div>;
  }
}
