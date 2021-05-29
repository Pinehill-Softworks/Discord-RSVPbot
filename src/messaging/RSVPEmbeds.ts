import { MessageEmbed } from "discord.js";
import ScheduledEvent from "../data/entities/Event";
import RSVP from "../data/entities/RSVP";
import * as colors from "../settings/MessageEmbedColors";

export const GuestList = async (event: ScheduledEvent, guests: Array<RSVP>) => {
  const embed = new MessageEmbed();
  embed.setColor(colors.PRIMARRY);
  embed.setTitle(`Expected Attendees for ${event.Title}`);
  const list = await Promise.all(
    guests.map((i) =>
      i
        .getAttendee()
        .then((user) => `${user.username} ${i.AdditionalAttendees > 0 ? `(+${i.AdditionalAttendees})` : ""}`.trim())
    )
  );
  embed.setDescription(list.join("\n"));
  return embed;
};
