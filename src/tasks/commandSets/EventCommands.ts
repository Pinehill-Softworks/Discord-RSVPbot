import * as Discord from "discord.js";

import Store from "../../data/Store";
import createEvent from "./events/CreateEvent";
import EventInteraction from "./events/EventInteraction";

export default async (message: Discord.Message) => {
  const server = (message.channel as Discord.TextChannel | Discord.NewsChannel).guild.id;
  const words = message.content.split(" ");

  // user interacting with a specific event
  let event = await Store(server).Events.GetByChannelID(message.channel.id);
  if (event) {
    const result = EventInteraction(words, message, event);
    message.channel.send(result);
  } else {
    const eventIndex = words.indexOf("~event");
    if (eventIndex >= 0 && eventIndex + 1 < words.length) {
      event = await Store(server).Events.GetByName(words[eventIndex + 1]);

      console.log(event);
      console.log(words.indexOf("~new"));
      if (event) {
        const result = EventInteraction(words, message, event);
        message.channel.send(result);
      } else if (words.indexOf("~new") >= 0) {
        console.log("creating new event");
        const result = createEvent(words, message);
        message.channel.send(result);
      } else {
        message.channel.send(
          "Specified name does not amtch any existing event names. use '~events' to list active events or '~new ~event' to create a new event"
        );
      }
    }
  }

  // user interacting with all events
  if (words.includes("~events")) {
    const allEvents = await Store(server).Events.GetAll();
    message.channel.send(JSON.stringify(allEvents));
  }
};
