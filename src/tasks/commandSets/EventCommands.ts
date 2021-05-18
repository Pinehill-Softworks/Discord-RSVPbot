import * as Discord from "discord.js";
import { DateTime } from "luxon";

import { EVENTS } from "../../data/Store";
import createEvent from "./events/CreateEvent";

export default (message: Discord.Message) => {
  const words = message.content.split(" ");

  // user interacting with a specific event
  if (words.includes("#event")) {
    console.log("creating new event");
    message.channel.send(createEvent(words, message));
  }

  // user interacting with all events
  if (words.includes("#events")) {
    message.channel.send(JSON.stringify(EVENTS));
  }
};
