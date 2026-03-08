import { setUser } from "../config";
import { createUser, getUser } from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  const existingUser = await getUser(userName);
  if (!existingUser) {
    throw new Error(`user ${userName} not found`);
  }

  setUser(existingUser.name);
  console.log("🎉 user login successful");
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  const user = await createUser(userName);
  if (!user) {
    throw new Error(`user ${userName} not found`);
  }

  setUser(user.name);
  console.log("🎉 user registration successful");
}
