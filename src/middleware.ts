import { CommandHandler } from "./commands/commands.js";
import { readConfig } from "./config.js";
import { getUser } from "./lib/db/queries/users.js";
import { User } from "./lib/db/schema.js";

type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

type MiddlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export function middlewareLoggedIn(handler: UserCommandHandler) {
  return async (cmdName: string, ...args: string[]): Promise<void> => {
    const config = readConfig();
    const { currentUserName } = config;
    if (!currentUserName) {
      throw new Error("User not logged in");
    }

    const user = await getUser(currentUserName);
    if (!user) {
      throw new Error(`user ${currentUserName} not found`);
    }

    await handler(cmdName, user, ...args);
  };
}
