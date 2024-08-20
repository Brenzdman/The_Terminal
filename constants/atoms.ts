import { Directory } from "@/classes/Directory";
import { TextDisplay } from "@/classes/TextDisplay";
import { atom } from "jotai";

// Atoms
const directories = [atom(new Directory("home"))];

const welcomeMessage = [
  "Welcome to the Terminal.",
  "Type 'help' to see a list of available commands.",
];

export const textDisplayAtom = atom(new TextDisplay(welcomeMessage));


export const currentDirectory = atom(directories[0]);

