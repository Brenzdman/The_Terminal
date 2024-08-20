import { Directory } from "@/classes/Directory";
import { TextDisplay } from "@/classes/TextDisplay";
import { atom } from "jotai";

// Atoms
const directories = [atom(new Directory("home"))];

export const textDisplayAtom = atom(new TextDisplay());
export const currentDirectory = atom(directories[0]);
