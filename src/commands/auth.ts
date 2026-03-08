import { setUser } from "../config.js";
import { createUser } from "../lib/db/queries/users.js";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];

  setUser(userName);
  console.log("user login successful");
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  const user = await createUser(userName);
  if (!user) {
    throw new Error(`user not found`);
  }

  setUser(user.name);
  console.log(`user registration successful`);
}
