import * as Discord from "discord.js";
import { GetDiscordUser } from "../../Environment";
import Store from "../Store";
import ScheduledEvent from "./Event";

export default class RSVP {
  private _id: number;
  private server: string;
  private _eventID: number;
  private _event?: ScheduledEvent = undefined;
  private _attendeeUserID: string;
  private _attendee?: Discord.User;
  AdditionalAttendees: number;

  constructor(rsvp: RSVPConstructor, server: string) {
    this.server = server;
    if (rsvp.Event) {
      this._eventID = rsvp.Event.Id;
      this._event = rsvp.Event;
    } else if (rsvp.EventID) {
      this._eventID = -1;
      this.getEventFromDB(rsvp.EventID);
    } else {
      throw new Error("There maust be a specified event linked to the rsvp.");
    }
    this._attendeeUserID = rsvp.AttendeeUserID;
    if (rsvp.Attendee) {
      this._attendee = rsvp.Attendee;
      this._attendeeUserID = rsvp.Attendee.id;
    } else if (rsvp.AttendeeUserID) {
      this._attendeeUserID = rsvp.AttendeeUserID;
      this.getUserFromDiscord(rsvp.AttendeeUserID);
    } else {
      throw new Error("There must be a specified user attending the event.");
    }
    this.AdditionalAttendees = rsvp.AdditionalAttendees || 0;
    this._id = rsvp.Id || -1;
    if (this._id <= 0) {
      this.commitChanges();
    }
  }

  get Id() {
    return this._id;
  }

  async getEvent() {
    if (this._event)
      new Promise((resolve, reject) =>
        resolve(() => {
          return this._event;
        })
      );
    else return await this.getEventFromDB(this._eventID);
  }

  set EventID(id: number | string) {
    this.getEventFromDB(id).then(() => this.commitChanges());
  }

  get EventID() {
    return this._eventID;
  }

  setEvent(event: ScheduledEvent) {
    this._eventID = event.Id;
    this._event = event;
    this.commitChanges();
  }

  async getAttendee(): Promise<Discord.User> {
    if (this._attendee) return new Promise((resolve, reject) => resolve(this._attendee as Discord.User));
    else {
      await this.getUserFromDiscord(this._attendeeUserID);
      // @ts-ignore
      return this._attendee;
    }
  }

  get AttendeeID() {
    return this._attendeeUserID;
  }

  private async getEventFromDB(id: number | string) {
    if (typeof id === "number") {
      this._event = await Store(this.server).Events.GetByID(id);
    } else {
      this._event = await Store(this.server).Events.GetByChannelID(id);
      if (!this._event) {
        this._event = await Store(this.server).Events.GetByName(id);
      }
    }
    this._eventID = this._event.Id;
  }

  private async getUserFromDiscord(id: string) {
    this._attendee = await GetDiscordUser(id);
    this._attendeeUserID = this._attendee.id;
  }

  private commitChanges() {
    if (this.Id <= 0) {
      console.log("here?");
      Store(this.server)
        .RSVPs.Add(this)
        .then((id) => (this._id = id));
    }
    // else {
    //   Store(this.server).Events.Update(this);
    // }
  }
}

export interface RSVPConstructor {
  Id?: number;
  EventID?: number | string;
  Event?: ScheduledEvent;
  AttendeeUserID: string;
  Attendee?: Discord.User;
  AdditionalAttendees?: number;
}
