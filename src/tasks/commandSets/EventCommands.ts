import * as Discord from "discord.js";
import { DateTime } from "luxon";

import Store from "../../data/Store";
import createEvent from "./events/CreateEvent";

export default async (message: Discord.Message) => {
  const words = message.content.split(" ");

  // user interacting with a specific event
  const eventIndex = words.indexOf("#event");
  if (eventIndex >= 0 && eventIndex + 1 < words.length) {
    const event = await Store((message.channel as Discord.TextChannel | Discord.NewsChannel).guild.id).Events.GetByName(
      words[eventIndex + 1]
    );

    if (event) {
      switch (true) {
        case words.includes("#print"): {
          message.channel.send(JSON.stringify(event));
          break;
        }
        case words.includes("#rename"): {
          break;
        }
      }
    } else {
      console.log("creating new event");
      message.channel.send(createEvent(words, message));
    }
  }

  // user interacting with all events
  // if (words.includes("#events")) {
  //   message.channel.send(JSON.stringify(EVENTS));
  // }
};
