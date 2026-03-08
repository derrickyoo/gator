import { readConfig } from "../config.js";
import { getUsers } from "../lib/db/queries/users.js";

export async function handlerListUsers(_: string) {
  const users = await getUsers();
  const config = readConfig();

  const { currentUserName } = config;
  for (const user of users) {
    if (user.name === currentUserName) {
      console.log(`* ${user.name} (current)`);
      continue;
    }

    console.log(`* ${user.name}`);
  }
}
