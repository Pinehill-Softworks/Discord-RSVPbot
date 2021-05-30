import { Message, MessageEmbed, NewsChannel, TextChannel } from "discord.js";
import ScheduledEvent from "../../../data/entities/Event";
import RSVP, { RSVPConstructor } from "../../../data/entities/RSVP";
import Store from "../../../data/Store";
import { GetDiscordUser } from "../../../Environment";
import { EventDetails, EventDetailsUpdate } from "../../../messaging/EventEmbeds";
import { GuestList } from "../../../messaging/RSVPEmbeds";

export default async (
  words: Array<string>,
  message: Message,
  event: ScheduledEvent
): Promise<string | MessageEmbed> => {
  const results = "";
  switch (true) {
    case words.includes("~details"): {
      message.delete({ reason: "Replacing with requested event details." });
      return EventDetails(event);
    }
    case words.includes("~rename"): {
      const eventIndex = words.indexOf("~rename");
      let eventEndIndex = words.slice(eventIndex + 1).findIndex((i) => i.includes("~"));
      if (eventEndIndex < 0) {
        eventEndIndex = words.length;
      } else {
        eventEndIndex += eventIndex + 1;
      }
      const title = "".concat(...words.slice(eventIndex + 1, eventEndIndex).map((i) => i + " ")).trim();
      event.setTitle(title);
      message.delete({ reason: "Replacing with renamed event details." });
      return EventDetailsUpdate(event, "Title", message.author, event.Title);
    }
    case words.includes("~on"): {
      const dateIndex = words.indexOf("~on");
      if (dateIndex >= 0 && dateIndex + 1 < words.length) {
        if (words[dateIndex + 1] !== null) {
          event.setDate(words[dateIndex + 1]);
        }
      }
      message.delete({ reason: "Replacing with renamed event details." });
      return EventDetailsUpdate(event, "Date", message.author, event.Date?.toFormat("DDDD") || "TBD");
    }
    case words.includes("~for"): {
      const descriptionIndex = words.indexOf("~for");
      let description = "";
      if (descriptionIndex >= 0 && descriptionIndex + 1 < words.length) {
        let descriptionEndIndex = words.slice(descriptionIndex + 1).findIndex((i) => i.includes("~"));
        if (descriptionEndIndex < 0) {
          descriptionEndIndex = words.length;
        } else {
          descriptionEndIndex += descriptionIndex + 1;
        }
        description = "".concat(...words.slice(descriptionIndex + 1, descriptionEndIndex).map((i) => i + " ")).trim();
        event.setDescription(description);
      }
      message.delete({ reason: "Replacing with renamed event details." });
      return EventDetailsUpdate(event, "Description", message.author, description);
    }
    case words.includes("~guests"): {
      return GuestList(
        event,
        await Store((message.channel as TextChannel | NewsChannel).guild.id).RSVPs.GetByEventID(event.Id)
      );
    }
    case words.includes("~rsvp"): {
      const user = await GetDiscordUser(message.author.id);
      const rsvp = new RSVP(
        { Event: event, AttendeeUserID: user.id },
        (message.channel as TextChannel | NewsChannel).guild.id
      );
      return JSON.stringify(rsvp);
    }
  }
  return results;
};
