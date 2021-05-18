import { NewsChannel, TextChannel } from "discord.js";
export declare const AddSiblingChannelToGuild: (sibling: TextChannel | NewsChannel, name: string) => Promise<TextChannel>;
