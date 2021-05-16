"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Testing_1 = __importDefault(require("./commandSets/Testing"));
var EventCommands_1 = __importDefault(require("./commandSets/EventCommands"));
exports.default = (function (message) {
    Testing_1.default(message);
    EventCommands_1.default(message);
    var words = message.content.split(" ");
    switch (true) {
        case words.includes("#rsvp"): {
            console.log("adding to guest list");
            break;
        }
    }
});
