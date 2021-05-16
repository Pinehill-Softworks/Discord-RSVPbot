import * as Discord from "discord.js";
import { DateTime } from "luxon";

import ScheduledEvent from "../../data/Event";

export default (message: Discord.Message) => {
  const words = message.content.split(" ");
  switch (true) {
    case words.includes("#event"): {
      console.log("creating new event");
      const eventIndex = words.indexOf("#event");
      if (eventIndex + 1 < words.length) {
        let eventEndIndex = words.slice(eventIndex + 1).findIndex((i) => i.includes("#"));
        if (eventEndIndex < 0) {
          eventEndIndex = words.length;
        } else {
          eventEndIndex += eventIndex + 1;
        }
        const title = "".concat(...words.slice(eventIndex + 1, eventEndIndex).map((i) => i + " ")).trim();
        const event = new ScheduledEvent(title);

        const dateIndex = words.indexOf("#on");
        if (dateIndex >= 0 && dateIndex + 1 < words.length) {
          const date = DateTime.fromISO(words[dateIndex + 1]);
          if (date !== null) {
            event.setDate(date);
          }
        }

        const descriptionIndex = words.indexOf("#for");
        if (descriptionIndex >= 0 && descriptionIndex + 1 < words.length) {
          let descriptionEndIndex = words.slice(descriptionIndex + 1).findIndex((i) => i.includes("#"));
          if (descriptionEndIndex < 0) {
            descriptionEndIndex = words.length;
          } else {
            descriptionEndIndex += descriptionIndex + 1;
          }
          const description = ""
            .concat(...words.slice(descriptionIndex + 1, descriptionEndIndex).map((i) => i + " "))
            .trim();
          event.setDescription(description);
        }
        message.channel.send(JSON.stringify(event));
      } else {
        message.channel.send("Please specify an event to be added or changed.");
      }
      break;
    }
  }
};
