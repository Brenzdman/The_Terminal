import { Dir_File } from "@/classes/Directory";
import { StyledText } from "@/classes/StyledText";

const FileContents: string[] = [
  "Isolation 2020",
  "",
  "I turn on the shower, as hot as it will go, it’s all too much.",
  "Each drop a pinprick of pain, a tiny dagger driven into my flesh.",
  "Each condemning thought, brought effortlessly into my mind.",
  "Reckless, Heartless, Meaningless.",
  "",
  "To be washed away with all my worries,",
  "To drift seamlessly down into the current below.",
  "To be cleansed of all that I am, of all that I’ve done.",
  "Liar, Cheater, Manipulator.",
  "",
  "To merely bathe in this stolen warmth forever,",
  "To bask in the bliss of self-condemnation.",
  "But this is no way to exist. This is not how I will stay.",
  "Melting, Shifting, Growing...",
  "",
  "Tomorrow I will start again.",
];

const poem = new Dir_File("poem2", ".txt");
const contents: StyledText[] = FileContents.map((line) => new StyledText(line));
contents[0].addStyle(0, contents[0].getText().length, "bold", "bold");
contents[5].addStyle(0, contents[5].getText().length, "italic", "italic");
contents[10].addStyle(0, contents[10].getText().length, "italic", "italic");
contents[15].addStyle(0, contents[15].getText().length, "italic", "italic");

poem.content = contents;

export default poem;
