"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Commands_1 = __importDefault(require("./Commands"));
exports.default = (function (client) {
    client.on("message", function (message) {
        if (message.content.includes("#")) {
            Commands_1.default(message);
        }
    });
    //client.on("message", (message) => console.log(message));
});
