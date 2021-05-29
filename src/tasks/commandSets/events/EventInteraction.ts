import { Message, MessageEmbed, NewsChannel, TextChannel } from "discord.js";
import ScheduledEvent from "../../../data/entities/Event";
import RSVP, { RSVPConstructor } from "../../../data/entities/RSVP";
import Store from "../../../data/Store";
import { GetDiscordUser } from "../../../Environment";
import { EventDetails } from "../../../messaging/EventEmbeds";
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
      break;
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
