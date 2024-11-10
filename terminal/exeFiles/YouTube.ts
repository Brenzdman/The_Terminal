import { Dir_File } from "@/classes/Directory";

export const YouTubeEXE = new Dir_File("YouTube", ".exe");
YouTubeEXE.onRun = onRun;

function onRun() {
  window.open("https://www.youtube.com/watch?v=xvFZjo5PgG0", "_blank");
}
