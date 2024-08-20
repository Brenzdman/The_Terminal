import { Dir_File, Directory } from "@/classes/Directory";
import { start } from "./start";

export function generateDirectory() {
  let home = new Directory("home");

  const startFile = new Dir_File("start", ".exe", start);
  home.addFile(startFile);

  const testFile = new Dir_File("test", ".txt");
  testFile.content = "Hello World!";
  home.addFile(testFile);

  return home;
}
