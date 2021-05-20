import * as Discord from "discord.js";

import token from "./Token";
import bindHandlers from "./tasks/Handlers";
import { DiscordClient } from "./Environment";

const client = new Discord.Client();

client.on("ready", () => console.log("listening..."));

DiscordClient(client);

bindHandlers(client);

client.login(token);
