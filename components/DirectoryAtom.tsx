import { Directory_Manager } from "@/classes/DirectoryManager";
import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";

// Atoms
const directoryManager = new Directory_Manager(true, true);
export const DIRECTORY_MANAGER = atom(directoryManager);

export function DirectoryAtom({ children }: { children: React.ReactNode }) {
  const [directoryManager, setDirectoryManager] = useAtom(DIRECTORY_MANAGER);
  const [isInitialized, setIsInitialized] = useState(false);

  const generateDirectory = (): Directory_Manager => {
    try {
      if (window.electron) {
        return new Directory_Manager(true, true);
      }
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }

    let directoryManager = new Directory_Manager(true);
    let currentDirectory = directoryManager.currentDirectory;

    if (!currentDirectory) {
      throw new Error("Directory not found!");
    }

    currentDirectory.addFile("start.exe");

    const testFile = currentDirectory.addFile("test.txt");

    if (testFile) {
      testFile.content = ["Hello World!"];
    }

    currentDirectory.makeDirectory("newDir", true, true);

    return directoryManager;
  };

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
