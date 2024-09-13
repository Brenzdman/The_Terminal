import { Dir_File } from "@/classes/Directory";
import { getColor } from "./color";
import { TextDisplay } from "@/classes/TextDisplay";
import { StyledText } from "@/classes/StyledText";

// Functions here add a message to the end of the text display

export function noDirAtPath(textDisplay: TextDisplay, path: string): void {
  textDisplay.addLines(`No directory found at '${path}'`);
  const text: StyledText = textDisplay.getLastLine().text;
  text.addStyle(0, text.getText().length, "error");
}

export function noFileAtPath(textDisplay: TextDisplay, path: string): void {
  textDisplay.addLines(`No file found at '${path}'`);
  const text: StyledText = textDisplay.getLastLine().text;
  text.addStyle(0, text.getText().length, "error");
}

export function cannotRunFile(textDisplay: TextDisplay, file: Dir_File): void {
  textDisplay.addLines(`File '${file.name}${file.type}' cannot be run`);
  const text: StyledText = textDisplay.getLastLine().text;
  text.addStyle(0, text.getText().length, "error");
}

export function commandNotFound(
  textDisplay: TextDisplay,
  command: string
): void {
  textDisplay.addLines(`Command '${command}' not found`);
  const text: StyledText = textDisplay.getLastLine().text;
  text.addStyle(0, text.getText().length, "error");
}

export function noDirOrFileAtPath(
  textDisplay: TextDisplay,
  path: string
): void {
  textDisplay.addLines(`No directory or file found at '${path}'`);
  const text: StyledText = textDisplay.getLastLine().text;
  text.addStyle(0, text.getText().length, "error");
}

export function fileAlreadyExists(
  textDisplay: TextDisplay,
  file: Dir_File
): void {
  textDisplay.addLines(`File already exists at ${file.name}${file.type}`);
  const text: StyledText = textDisplay.getLastLine().text;
  text.addStyle(0, text.getText().length, "error");
}

export function dirAlreadyExists(textDisplay: TextDisplay, path: string): void {
  textDisplay.addLines(`Directory already exists at '${path}'`);
  const text: StyledText = textDisplay.getLastLine().text;
  text.addStyle(0, text.getText().length, "error");
}

export function invalidName(textDisplay: TextDisplay, name: string): void {
  textDisplay.addLines(`Invalid name '${name}'`);
  const text: StyledText = textDisplay.getLastLine().text;
  text.addStyle(0, text.getText().length, "error");
}

export function invalidPath(textDisplay: TextDisplay, path: string): void {
  textDisplay.addLines(`Invalid path '${path}'`);
  const text: StyledText = textDisplay.getLastLine().text;
  text.addStyle(0, text.getText().length, "error");
}

export function invalidFileType(textDisplay: TextDisplay): void {
  textDisplay.addLines(`This use of the command is only set up for txt files.`);
  const text: StyledText = textDisplay.getLastLine().text;
  text.addStyle(0, text.getText().length, "error");
}

export function accessDenied(textDisplay: TextDisplay): void {
  textDisplay.addLines(`ACCESS DENIED`);
  const text: StyledText = textDisplay.getLastLine().text;
  text.addStyle(0, text.getText().length, "error");
}
