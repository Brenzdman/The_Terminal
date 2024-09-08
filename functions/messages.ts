import { Dir_File } from "@/classes/Directory";
import { getColorString, getColor } from "./color";

export function noDirAtPath(path: string): string {
  return getColorString(`No directory found at '${path}'`, getColor("error"));
}

export function noFileAtPath(path: string): string {
  return getColorString(`No file found at '${path}'`, getColor("error"));
}

export function cannotRunFile(file: Dir_File): string {
  return getColorString(
    `File '${file.name}${file.type}' cannot be run`,
    getColor("error")
  );
}

export function noDirOrFileAtPath(path: string): string {
  return getColorString(
    `No directory or file found at '${path}'`,
    getColor("error")
  );
}

export function fileAlreadyExists(file: Dir_File): string {
  return getColorString(
    `File already exists at ${file.name}${file.type}`,
    getColor("error")
  );
}

export function dirAlreadyExists(path: string): string {
  return getColorString(
    `Directory already exists at '${path}'`,
    getColor("error")
  );
}

export function invalidName(name: string): string {
  return getColorString(`Invalid name '${name}'`, getColor("error"));
}

export function invalidPath(path: string): string {
  return getColorString(`Invalid path '${path}'`, getColor("error"));
}

export function accessDenied(): string {
  return getColorString("ACCESS DENIED", getColor("error"));
}

export function invalidFileType(): string {
  return getColorString(
    "This use of the command is only set up for txt files.",
    getColor("error")
  );
}
