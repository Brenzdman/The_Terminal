export function saveCommandList(commands: string[]): void {
  localStorage.setItem("commands", JSON.stringify(commands));
}

export function getCommandList(): string[] {
  const commands = localStorage.getItem("commands");
  if (commands) {
    return JSON.parse(commands);
  }
  return [];
}
