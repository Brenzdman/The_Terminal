import { TextDisplay } from "@/classes/TextDisplay";
import { generateDirectory } from "@/functions/generateDirectory";
import { atom } from "jotai";

// Atoms
let home = generateDirectory();

const welcomeMessage = [
  "Welcome to the Terminal.",
  "Type 'help' to see a list of available commands.",
];

export const textDisplayAtom = atom(new TextDisplay(welcomeMessage));
export const currentDirectoryAtom = atom(home);
