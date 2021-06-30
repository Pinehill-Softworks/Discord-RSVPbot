import { User } from "discord.js";
import { DateTime } from "luxon";
import { GetDiscordUser } from "../../Environment";
import Store from "../Store";
import Location from "../entities/Location";

class ScheduledEvent {
  private _id: number;
  private Server: string;
  Name: string;
  Title: string;
  HostID: string;
  private _host?: User;
  Active: boolean;
  Description?: string;
  Date?: DateTime;
  ChannelID?: string;
  Location?: Location;

  constructor(values: ScheduledEventConstructor, server: string) {
    if (values.Title) {
      this._id = values.Id || -1;
      this.Name =
        values.Name ||
        values.Title.trim()
          .toLowerCase()
          // @ts-ignore : TS doesnt have replaceAll?
          .replaceAll(/[^\w\s-]/gi, "")
          .replaceAll(" ", "-");
      this.Title = values.Title as string;
      if (values.Host) {
        this._host = values.Host;
        this.HostID = values.Host.id;
      } else if (values.HostID) {
        this.HostID = values.HostID;
        this.getHostUserFromDiscord();
      } else {
        throw new Error("The event must have a host user.");
      }
      if (typeof values.Active === "number") this.Active = values.Active === 1 ? true : false;
      else this.Active = values.Active || true;
      this.Description = values.Description;
      const eventDate = DateTime.fromISO(values.Date || "");
      this.Date = !eventDate.invalidReason ? eventDate : undefined;
      this.ChannelID = values.ChannelID;
      this.Server = server;
      console.log(this.Name);
      if (this._id <= 0) {
        this.commitChanges();
      }
    } else {
      throw new Error("event must have a title");
    }
  }

  get Id() {
    return this._id;
  }

  setTitle(title: string) {
    if (title.trim().length > 0) {
      this.Title = title;
      // @ts-ignore : TS doesnt have replaceAll?
      this.Name = title.trim().toLowerCase().replaceAll(" ", "-");
      this.commitChanges();
    }
  }

  setDescription(description: string) {
    this.Description = description;
    this.commitChanges();
  }

  setDate(date: string) {
    const newDate = DateTime.fromISO(date);
    if ((!newDate.invalidReason && newDate > DateTime.now()) || date === null) {
      this.Date = newDate;
      this.commitChanges();
    }
  }

  setChannelID(id: string) {
    this.ChannelID = id;
    this.commitChanges();
  }

  getChannelName() {
    const dateToPrint = this.Date
      ? this.Date.toFormat(`M-d${DateTime.now().year !== this.Date.year ? "-y" : ""}`)
      : null;
    return `${this.Title}${dateToPrint ? `-${dateToPrint}` : ""}`;
  }

  async getHostUser() {
    if (!this._host) {
      await this.getHostUserFromDiscord();
    }
    return this._host;
  }

  commitChanges() {
    if (this.Id <= 0) {
      Store(this.Server)
        .Events.Add(this)
        .then((id) => (this._id = id));
    } else {
      Store(this.Server).Events.Update(this);
    }
  }

  private async getHostUserFromDiscord() {
    this._host = await GetDiscordUser(this.HostID);
  }
}

export interface ScheduledEventConstructor {
  Id?: number;
  Name?: string;
  HostID: string;
  Host?: User;
  Active?: boolean | number;
  Title: string;
  Description?: string;
  Date?: string;
  ChannelID?: string;
  Location?: Location;
}

export const GetEventByID = async (server: string, id: number) => await Store(server).Events.GetByID(id);

export const GetEventByName = async (server: string, name: string) => await Store(server).Events.GetByName(name);

export const GetEventByChannelID = async (server: string, id: string) => await Store(server).Events.GetByChannelID(id);

export default ScheduledEvent;
