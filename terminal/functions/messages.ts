import { StyledText } from "@/classes/StyledText";
import { TextDisplay } from "@/classes/TextDisplay";

// Functions here add a message to the end of the text display

export function errorMessage(
  textDisplay: TextDisplay,
  type: string,
  string: string
): void {
  let message = `Unknown Error: ${string}`;
  if (type === "noDirAtPath") {
    message = `No directory found at '${string}'`;
  } else if (type === "noFileAtPath") {
    message = `No file found at '${string}'`;
  } else if (type === "noDirOrFileAtPath") {
    message = `No directory or file found at '${string}'`;
  } else if (type === "cannotRunFile") {
    message = `File '${string}' cannot be run`;
  } else if (type === "fileAlreadyExists") {
    message = `File already exists at '${string}'`;
  } else if (type === "dirAlreadyExists") {
    message = `Directory already exists at '${string}'`;
  } else if (type === "invalidName") {
    message = `Invalid name '${string}'`;
  } else if (type === "invalidPath") {
    message = `Invalid path '${string}'`;
  } else if (type === "invalidFileType") {
    message = `This use of the command is only set up for txt files.`;
  } else if (type === "invalidCommand") {
    message = `Invalid command '${string}'`;
  } else if (type === "accessDenied") {
    message = `ACCESS DENIED: '${string}'`;
  }

  const Lines = textDisplay.addLines(message);

  if (Lines.length === 0) {
    return;
  }

  const text: StyledText = Lines[0].text;
  text.addStyle(0, text.getText().length, "error");
}
