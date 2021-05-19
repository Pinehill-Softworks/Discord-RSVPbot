import { DMChannel, Message, NewsChannel, TextChannel } from "discord.js";
import { DateTime } from "luxon";

import ScheduledEvent from "../../../data/Event";
import Store from "../../../data/Store";
import { AddSiblingChannelToGuild } from "../../ChannelManagement";

export default (words: Array<string>, message: Message): string => {
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

    if (words.includes("#channel")) {
      // create channel for event
      if (!(message.channel as DMChannel).recipient) {
        const eventChannel = AddSiblingChannelToGuild(
          message.channel as TextChannel | NewsChannel,
          event.getChannelName()
        );
      }
    }

    if (!(message.channel as DMChannel).recipient) {
      Store((message.channel as TextChannel | NewsChannel).guild.id)
        .Events()
        .Add(event);
    }

    return JSON.stringify(event);
  } else {
    return "Please specify an event to be added or changed.";
  }
};
