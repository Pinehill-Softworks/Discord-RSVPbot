import * as Discord from "discord.js";

import token from "./Token";
import bindHandlers from "./tasks/Handlers";

const client = new Discord.Client();

client.on("ready", () => console.log("listening..."));

bindHandlers(client);

client.login(token);
