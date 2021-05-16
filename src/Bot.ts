import * as Discord from "discord.js";
import bindHandlers from "./tasks/Handlers";

const client = new Discord.Client();

client.on("ready", () => console.log("listening..."));

bindHandlers(client);

client.login("ODQzMjU2MTgwNTY1NjA2NDEw.YKBNhA.Hf-0QthVO-D8CHBxWMTUIGrMHdA");
