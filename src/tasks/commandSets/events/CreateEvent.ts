import { DMChannel, Message, NewsChannel, TextChannel } from "discord.js";

import ScheduledEvent, { ScheduledEventConstructor } from "../../../data/events/Event";
import { AddSiblingChannelToGuild } from "../../ChannelManagement";

export default (words: Array<string>, message: Message): string => {
  if (!(message.channel as DMChannel).recipient) {
    console.log("attempting to create new event");
    const eventIndex = words.indexOf("#event");
    if (eventIndex + 1 < words.length) {
      let eventEndIndex = words.slice(eventIndex + 1).findIndex((i) => i.includes("#"));
      if (eventEndIndex < 0) {
        eventEndIndex = words.length;
      } else {
        eventEndIndex += eventIndex + 1;
      }
      const title = "".concat(...words.slice(eventIndex + 1, eventEndIndex).map((i) => i + " ")).trim();
      const event: ScheduledEventConstructor = { Title: title };

      const dateIndex = words.indexOf("#on");
      if (dateIndex >= 0 && dateIndex + 1 < words.length) {
        if (words[dateIndex + 1] !== null) {
          event.Date = words[dateIndex + 1];
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
        event.Description = description;
      }

      console.log("event details to be added");
      const eventEntity = new ScheduledEvent(event, (message.channel as TextChannel | NewsChannel).guild.id);

      if (words.includes("#channel")) {
        console.log("attempting to create text channel for event");
        // create channel for event
        if (!(message.channel as DMChannel).recipient) {
          const eventChannel = AddSiblingChannelToGuild(
            message.channel as TextChannel | NewsChannel,
            eventEntity.getChannelName()
          ).then((channel) => {
            console.log("generated channel: " + channel);
            eventEntity.setChannelID(channel.id);
          });
        }
      }
      return JSON.stringify(event);
    } else {
      return "Please specify an event to be added or changed.";
    }
  } else {
    return "Events cannot be created in a DM channel.";
  }
};
