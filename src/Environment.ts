import { Client } from "discord.js";

let CLIENT: Client;

export const DiscordClient = (client?: Client): Client => {
  if (client && !CLIENT) {
    CLIENT = client;
  }
  return CLIENT;
};

export const GetDiscordUser = (id: string) => DiscordClient().users.fetch(id);
