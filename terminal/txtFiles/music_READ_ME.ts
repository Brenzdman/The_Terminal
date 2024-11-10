import { Dir_File } from "@/classes/Directory";
import { StyledText } from "@/classes/StyledText";

const FileContents: string[] = [
    `This will be added once I figure out how to properly record music...`,
];

const READ_ME = new Dir_File("READ_ME", ".txt");
const contents: StyledText[] = FileContents.map((line) => new StyledText(line));

READ_ME.content = contents;

export default READ_ME;
