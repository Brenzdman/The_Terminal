import { Dir_File } from "@/classes/Directory";
import { StyledText } from "@/classes/StyledText";

const FileContents: string[] = [
  `We all make mistakes`,
  `By Brenden Bushman`,
  ``,
  `Our hill was beautiful once.`,
  `Its respite forever clouded by the veil that tears my eyes`,
  `With waves of broken memories I'm pushed ever closer to that fateful cliff`,
  ``,
  `With tempests of forlorn reminders I'm pulled back to a time long lost`,
  `Had I only known this permanence would be the cost`,
  ``,
  `When crimson needles wafted wistfully through the silent air`,
  `Your absence made my heart unravel in despair`,
  ``,
  `My shattered thoughts whir with regrets I can't suppress`,
  `As echoes of your voice call me to join you in eternal rest`,
  ``,
  `For all we ever were, is lost because of me.`,
];

const poem = new Dir_File("poem", ".txt");
const contents: StyledText[] = FileContents.map((line) => new StyledText(line));
contents[0].addStyle(0, contents[0].getText().length, "bold", "bold");
contents[1].addStyle(0, contents[1].getText().length, "italic", "italic");


poem.content = contents;

export default poem;
