import { generateDirectory } from "@/functions/generateDirectory";
import { atom } from "jotai";

// Atoms
const directoryManager = generateDirectory();
export const DIRECTORY_MANAGER = atom(directoryManager);
