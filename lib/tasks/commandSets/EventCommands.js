"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var luxon_1 = require("luxon");
var Event_1 = __importDefault(require("../../data/Event"));
exports.default = (function (message) {
    var words = message.content.split(" ");
    switch (true) {
        case words.includes("#event"): {
            console.log("creating new event");
            var eventIndex = words.indexOf("#event");
            if (eventIndex + 1 < words.length) {
                var eventEndIndex = words.slice(eventIndex + 1).findIndex(function (i) { return i.includes("#"); });
                if (eventEndIndex < 0) {
                    eventEndIndex = words.length;
                }
                else {
                    eventEndIndex += eventIndex + 1;
                }
                var title = "".concat.apply("", words.slice(eventIndex + 1, eventEndIndex).map(function (i) { return i + " "; })).trim();
                var event_1 = new Event_1.default(title);
                var dateIndex = words.indexOf("#on");
                if (dateIndex >= 0 && dateIndex + 1 < words.length) {
                    var date = luxon_1.DateTime.fromISO(words[dateIndex + 1]);
                    if (date !== null) {
                        event_1.setDate(date);
                    }
                }
                var descriptionIndex = words.indexOf("#for");
                if (descriptionIndex >= 0 && descriptionIndex + 1 < words.length) {
                    var descriptionEndIndex = words.slice(descriptionIndex + 1).findIndex(function (i) { return i.includes("#"); });
                    if (descriptionEndIndex < 0) {
                        descriptionEndIndex = words.length;
                    }
                    else {
                        descriptionEndIndex += descriptionIndex + 1;
                    }
                    var description = ""
                        .concat.apply("", words.slice(descriptionIndex + 1, descriptionEndIndex).map(function (i) { return i + " "; })).trim();
                    event_1.setDescription(description);
                }
                message.channel.send(JSON.stringify(event_1));
            }
            else {
                message.channel.send("Please specify an event to be added or changed.");
            }
            break;
        }
    }
});
