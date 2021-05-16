import * as Discord from "discord.js";

export default (message: Discord.Message) => {
  switch (true) {
    case message.content.includes("#ping"): {
      console.log("recieved ping");
      message.channel.send("pong");
      break;
    }
    case message.content.includes("#pong"): {
      console.log("recieved ping from dumb user");
      message.channel.send("ping?");
      break;
    }
  }
};
