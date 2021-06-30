import { Message, MessageReaction, ReactionCollector, User } from "discord.js";

export const RSVPCollectors = new Array<ReactionCollector>();

export const CollectRSVPReactions = (message: Message) => {
  console.log("creating reaction collector");
  const filter = (reaction: MessageReaction, user: User) => {
    console.log(reaction);
    return reaction.emoji.name === "✅" || reaction.emoji.name === "" || reaction.emoji.name === "🛑";
  };

  const collector = message.createReactionCollector(filter);

  collector.on("collect", (reaction: MessageReaction, user: User) => {
    console.log(`collected ${reaction.emoji.name} reaction from ${user.username}`);
  });

  collector.on("end", (collected) => {
    console.log(`collected ${collected.size} items`);
  });

  RSVPCollectors.push(collector);
};
