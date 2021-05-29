import { MessageEmbed } from "discord.js";
import ScheduledEvent from "../data/entities/Event";
import * as colors from "../settings/MessageEmbedColors";

export const EventDetails = (event: ScheduledEvent): MessageEmbed => {
  const embed = new MessageEmbed();
  embed.setTitle(event.Title);
  embed.setColor(colors.PRIMARRY);
  embed.setDescription(event.Description);
  return embed;
};
