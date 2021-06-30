import { MessageEmbed } from "discord.js";
import * as colors from "../settings/MessageEmbedColors";

export const ErrorMessage = (message: string | Error): MessageEmbed => {
  const embed = new MessageEmbed();
  embed.setTitle("Something's not right...");
  embed.setColor(colors.DANGER);
  if (message instanceof Error) {
    embed.setDescription((message as Error).message);
  } else {
    embed.setDescription(message);
  }
  return embed;
};
