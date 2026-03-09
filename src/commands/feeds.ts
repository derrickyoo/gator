export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  if (args.length > 2) {
    throw new Error(`usage: ${cmdName} <name> <url>`);
  }
}
