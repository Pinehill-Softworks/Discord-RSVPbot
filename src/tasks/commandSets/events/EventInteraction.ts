import { Message } from "discord.js";
import ScheduledEvent from "../../../data/entities/Event";
import { GetDiscordUser } from "../../../Environment";

export default (words: Array<string>, message: Message, event: ScheduledEvent): string => {
  const results = "";
  switch (true) {
    case words.includes("~details"): {
      return JSON.stringify(event);
    }
    case words.includes("~rename"): {
      break;
    }
    case words.includes("~rsvp"): {
      GetDiscordUser(message.author.id).then((u) => console.log(u));
      break;
    }
  }
  return results;
};
