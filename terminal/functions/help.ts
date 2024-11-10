const mainHelpScreen = [
  `HELP MENU`,
  ` `,
  `Available commands:`,
  `-------------------`,
  `help  [cmd]                 - Display this help menu or explain a specific command`,
  `dir   [dir]                 - List directories and files in the current directory`,
  `cd    [dir]                 - Change to the specified directory`,
  `mkdir [dir]                 - Create a new directory`,
  `rmdir [dir]                 - Remove a directory`,
  `copy  [file] [newPath]      - Copy a file to a new location`,
  `move  [file] [newPath]      - Move a file to a new location`,
  `del   [file]                - Delete a file`,
  `type  [file]                - Display the content of a text (txt) file`,
  `start [file]                - Run an executable (exe) file`,
  `echo  [text] > [file]       - Output text to the terminal or file`,
  `ren   [file/dir] [newName]  - Rename a file or directory`,
  `cls                         - Clear the terminal screen`,
  `exit                        - Close the terminal`,
];

export function getDetailedHelp(
  command: string | undefined
): string[] | string {
  if (!command) {
    return mainHelpScreen;
  }

  let help;
  if (command === "help") {
    help = {
      description: "Display this help menu or explain a specific command.",
      aliases: [], // `help` doesn't have standard aliases
      usage: "help [cmd]",
      examples: ["help dir", "help echo"],
    };
  } else if (command === "dir" || command === "ls") {
    help = {
      description: "List directories and files in the current directory.",
      aliases: ["dir", "ls"],
      usage: "dir",
      examples: ["dir", "dir /path/to/dir"],
    };
  } else if (command === "cd" || command === "chdir") {
    help = {
      description: "Change to the specified directory.",
      aliases: ["cd", "chdir"],
      usage: "cd [dir]",
      examples: ["cd Documents", "cd /path/to/dir", "cd ..", "cd ~"],
    };
  } else if (command === "mkdir" || command === "md") {
    help = {
      description: "Create a new directory.",
      aliases: ["mkdir", "md"],
      usage: "mkdir [dir]",
      examples: ["mkdir new_dir", "mkdir /path/to/new_dir"],
    };
  } else if (command === "rmdir" || command === "rd") {
    help = {
      description: "Remove a directory.",
      aliases: ["rmdir", "rd"],
      usage: "rmdir [dir]",
      examples: ["rmdir dir", "rmdir /path/to/dir"],
    };
  } else if (command === "copy") {
    help = {
      description: "Copy a file to a new location.",
      aliases: [], // `copy` does not have standard aliases
      usage: "copy [file] [newPath]",
      examples: ["copy file.txt newFile.txt", "copy file.txt new_dir"],
    };
  } else if (command === "move") {
    help = {
      description: "Move a file to a new location.",
      aliases: [], // `move` does not have standard aliases
      usage: "move [file] [newPath]",
      examples: ["move file.txt newFile.txt", "move file.txt new_dir"],
    };
  } else if (command === "del") {
    help = {
      description: "Delete a file.",
      aliases: [], // `del` does not have standard aliases
      usage: "del [file]",
      examples: ["del file.txt", "del /path/to/file.txt"],
    };
  } else if (command === "type") {
    help = {
      description: "Display the content of a text file.",
      aliases: [], // `type` does not have standard aliases
      usage: "type [file]",
      examples: ["type file.txt", "type /path/to/file.txt"],
    };
  } else if (command === "start") {
    help = {
      description: "Run an executable file.",
      aliases: [], // `start` does not have standard aliases
      usage: "start [file]",
      examples: ["start program.exe", "start /path/to/program.exe"],
    };
  } else if (command === "echo") {
    help = {
      description: "Output text to the terminal.",
      aliases: [], // `echo` does not have standard aliases
      usage: "echo [text]",
      examples: ["echo Hello world!", "echo testing > file.txt"],
    };
  } else if (command === "ren" || command === "rename") {
    help = {
      description: "Rename a file or directory.",
      aliases: ["ren", "rename"],
      usage: "ren [file/dir] [newName]",
      examples: ["ren path/to/dir name", "ren file name"],
    };
  } else if (command === "cls" || command === "clear") {
    help = {
      description: "Clear the terminal screen.",
      aliases: ["cls", "clear"],
      usage: "cls",
      examples: ["cls"],
    };
  } else if (command === "exit") {
    help = {
      description: "Close the terminal.",
      aliases: [], // `exit` does not have standard aliases
      usage: "exit",
      examples: ["exit"],
    };
  }

  if (help) {
    return `
${command.toUpperCase()} Command:
----------------------------
Description: ${help.description}
Aliases: ${help.aliases.join(", ")}
Usage: ${help.usage}
Examples:
  ${help.examples.join("\n  ")}
    `;
  } else {
    return `"${command}" is not a recognized command. Type "help" for a list of available commands.`;
  }
}
