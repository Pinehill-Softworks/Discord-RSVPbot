import * as Discord from "discord.js";
import { DateTime } from "luxon";

import TestCommands from "./commandSets/Testing";
import EventCommands from "./commandSets/EventCommands";

export default (message: Discord.Message) => {
  TestCommands(message);
  EventCommands(message);

  const words = message.content.split(" ");
  switch (true) {
    case words.includes("~rsvp"): {
      console.log("adding to guest list");
      break;
    }
  }
};
