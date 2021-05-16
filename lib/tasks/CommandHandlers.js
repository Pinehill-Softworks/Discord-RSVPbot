"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (client) {
    client.on("message", function (message) {
        if (message.content.includes("#ping")) {
            console.log("recieved ping");
            message.channel.send("pong");
        }
    });
    //client.on("message", (message) => console.log(message));
});
