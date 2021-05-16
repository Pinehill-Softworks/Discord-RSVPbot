"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (message) {
    switch (true) {
        case message.content.includes("#ping"): {
            console.log("recieved ping");
            message.channel.send("pong");
            break;
        }
        case message.content.includes("#pong"): {
            console.log("dumb user");
            message.channel.send("ping?");
            break;
        }
    }
});
