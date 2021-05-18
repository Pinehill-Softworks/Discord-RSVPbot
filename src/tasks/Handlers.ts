import * as Discord from "discord.js";

import executeCommand from "./Commands";

export default (client: Discord.Client) => {
  client.on("message", (message) => {
    if (message.content.includes("#")) {
      executeCommand(message);
    }
  });

  // client.on("message", (message) => console.log(message.channel));
};
