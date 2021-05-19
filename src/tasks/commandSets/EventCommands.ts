import * as Discord from "discord.js";
import { DateTime } from "luxon";

import Store from "../../data/Store";
import createEvent from "./events/CreateEvent";

export default (message: Discord.Message) => {
  const words = message.content.split(" ");

  // user interacting with a specific event
  const eventIndex = words.indexOf("#event");
  if (eventIndex >= 0 && eventIndex + 1 < words.length) {
    Store((message.channel as Discord.TextChannel | Discord.NewsChannel).guild.id)
      .Events()
      .Get(words[eventIndex + 1], (event) => {
        if (event) {
          if (words.includes("#print")) {
            message.channel.send(JSON.stringify(event));
          }
        } else {
          console.log("creating new event");
          message.channel.send(createEvent(words, message));
        }
      });
  }

  // user interacting with all events
  // if (words.includes("#events")) {
  //   message.channel.send(JSON.stringify(EVENTS));
  // }
};
