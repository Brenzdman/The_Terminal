import { Directory_Manager } from "@/classes/Directory";
import { TextDisplay } from "@/classes/TextDisplay";
import { generateDirectory } from "@/functions/generateDirectory";
import { atom } from "jotai";

// Atoms
const DIRECTORY_MANAGER = generateDirectory();
const root = DIRECTORY_MANAGER.currentDirectory;

const welcomeMessage = [
  "Welcome to the Terminal.",
  "Type 'help' to see a list of available commands.",
];

export const textDisplayAtom = atom(new TextDisplay(welcomeMessage));
export const currentDirectoryAtom = atom(root);
