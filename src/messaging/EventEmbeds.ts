import { MessageEmbed, User } from "discord.js";
import ScheduledEvent from "../data/entities/Event";
import * as colors from "../settings/MessageEmbedColors";

export const EventDetails = (event: ScheduledEvent): MessageEmbed => {
  const embed = new MessageEmbed();
  embed.setTitle(event.Title);
  embed.setColor(colors.PRIMARRY);
  embed.setDescription(event.Description);
  embed.addField("On", event.Date?.toFormat("DDDD") || "TBD");
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
