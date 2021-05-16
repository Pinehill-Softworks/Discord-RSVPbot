"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var luxon_1 = require("luxon");
var ScheduledEvent = /** @class */ (function () {
    function ScheduledEvent(title, description, date) {
        // @ts-ignore
        this.Name = title.trim().replaceAll(" ", "-");
        this.Title = title;
        this.Description = description || "";
        this.Date = date || undefined;
    }
    ScheduledEvent.prototype.setTitle = function (title) {
        if (title.trim().length > 0) {
            this.Title = title;
        }
    };
    ScheduledEvent.prototype.setDescription = function (description) {
        this.Description = description;
    };
    ScheduledEvent.prototype.setDate = function (date) {
        if (date > luxon_1.DateTime.now() || date === null) {
            this.Date = date;
        }
    };
    return ScheduledEvent;
}());
exports.default = ScheduledEvent;
