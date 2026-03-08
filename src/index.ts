import { readConfig, setUser } from "./config.js";

function main() {
  setUser("Derrick");
  const config = readConfig();

  console.log(config);
}

main();
