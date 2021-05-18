import { Channel, ChannelResolvable, Guild, GuildCreateChannelOptions, NewsChannel, TextChannel } from "discord.js";

export const AddSiblingChannelToGuild = async (sibling: TextChannel | NewsChannel, name: string) => {
  const createdChannel = await sibling.guild.channels.create(name, {
    type: "text",
    parent: sibling.parentID as ChannelResolvable,
    reason: `Channel auto generated for RSVPs and planning related to ${name} event`,
  });
  return createdChannel;
};
