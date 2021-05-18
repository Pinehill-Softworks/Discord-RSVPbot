"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var luxon_1 = require("luxon");
var ScheduledEvent = /** @class */ (function () {
    function ScheduledEvent(title, description, date) {
        // @ts-ignore : TS doesnt have replaceAll?
        this.Name = title.trim().toLowerCase().replaceAll(" ", "-");
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
    ScheduledEvent.prototype.setChannelID = function (id) {
        this.ChannelID = id;
    };
    ScheduledEvent.prototype.getChannelName = function () {
        var dateToPrint = this.Date
            ? this.Date.toFormat("M-d" + (luxon_1.DateTime.now().year !== this.Date.year ? "-y" : ""))
            : null;
        return "" + this.Title + (dateToPrint ? "-" + dateToPrint : "");
    };
    return ScheduledEvent;
}());
exports.default = ScheduledEvent;
