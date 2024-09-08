import { Directory_Manager } from "@/classes/DirectoryManager";
import { generateDirectory } from "@/functions/generateDirectory";
import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";

// Atoms
const directoryManager = new Directory_Manager();
export const DIRECTORY_MANAGER = atom(directoryManager);

export function DirectoryAtom({ children }: { children: React.ReactNode }) {
  const [directoryManager, setDirectoryManager] = useAtom(DIRECTORY_MANAGER);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const updatedDirectoryManager = generateDirectory();
    setDirectoryManager(updatedDirectoryManager);
    setIsInitialized(true);
  }, []);
  if (!isInitialized) {
    return <span>Loading...</span>;
  } else {
    return <div>{children}</div>;
  }
}
