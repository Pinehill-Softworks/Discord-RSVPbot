import { MessageEmbed, User } from "discord.js";
import ScheduledEvent from "../data/entities/Event";
import * as colors from "../settings/MessageEmbedColors";

export const EventDetails = async (event: ScheduledEvent): Promise<MessageEmbed> => {
  const embed = new MessageEmbed();
  embed.setTitle(event.Title);
  embed.setColor(colors.PRIMARRY);
  embed.setAuthor(`Hosted By: @${(await event.getHostUser())?.username}`);
  embed.setDescription(event.Description);
  embed.addField("When", event.Date?.toFormat("DDDD") || "TBD");
  embed.addField("Where", event.Location?.Name || "TBD");
  return embed;
};

export const EventDetailsUpdate = (
  event: ScheduledEvent,
  field: string,
  updatedBy: User,
  newValue: string
): MessageEmbed => {
  const embed = new MessageEmbed();
  embed.setColor(colors.INFO);
  embed.setAuthor(`${updatedBy.username}: Updated ${event.Title}`, updatedBy.avatarURL() || undefined);
  embed.addField(field, newValue);
  return embed;
};

export const Directions = (event: ScheduledEvent): MessageEmbed => {
  const embed = new MessageEmbed();
  const address = "";
  // @ts-ignore : TS doesnt have replaceAll?
  const mapsURL = `https://www.google.com/maps/dir//${address.replaceAll(" ", "+")}`;
  return embed;
};
