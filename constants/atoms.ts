import { TextDisplay } from "@/classes/TextDisplay";
import { generateDirectory } from "@/functions/generateDirectory";
import { atom } from "jotai";

// Atoms
const DIRECTORY_MANAGER = generateDirectory();
const dir = DIRECTORY_MANAGER.currentDirectory;

const welcomeMessage = [
  "Welcome to the Terminal.",
  "Type 'help' to see a list of available commands.",
];

export const currentDirectoryAtom = atom(dir);

const path = dir.path;
export const textDisplayAtom = atom(new TextDisplay(path, welcomeMessage));
