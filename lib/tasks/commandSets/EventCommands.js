"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Store_1 = require("../../data/Store");
var CreateEvent_1 = __importDefault(require("./events/CreateEvent"));
exports.default = (function (message) {
    var words = message.content.split(" ");
    // user interacting with a specific event
    if (words.includes("#event")) {
        console.log("creating new event");
        message.channel.send(CreateEvent_1.default(words, message));
    }
    // user interacting with all events
    if (words.includes("#events")) {
        message.channel.send(JSON.stringify(Store_1.EVENTS));
    }
});
