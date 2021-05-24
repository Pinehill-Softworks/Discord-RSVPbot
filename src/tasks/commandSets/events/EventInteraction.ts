import { Message, NewsChannel, TextChannel } from "discord.js";
import ScheduledEvent from "../../../data/entities/Event";
import RSVP, { RSVPConstructor } from "../../../data/entities/RSVP";
import Store from "../../../data/Store";
import { GetDiscordUser } from "../../../Environment";

export default async (words: Array<string>, message: Message, event: ScheduledEvent): Promise<string> => {
  const results = "";
  switch (true) {
    case words.includes("~details"): {
      return JSON.stringify(event);
    }
    case words.includes("~rename"): {
      break;
    }
    case words.includes("~guests"): {
      return JSON.stringify(
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
