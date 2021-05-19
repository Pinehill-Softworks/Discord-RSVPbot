import { DateTime } from "luxon";
import Store from "../Store";

class ScheduledEvent {
  private _id: number;
  private Server: string;
  Name: string;
  Title: string;
  Description?: string;
  Date?: DateTime;
  ChannelID?: string;

  constructor(values: ScheduledEventConstructor, server: string) {
    if (values.Title) {
      this._id = values.Id || -1;
      // @ts-ignore : TS doesnt have replaceAll?
      this.Name = values.name || values.Title.trim().toLowerCase().replaceAll(" ", "-");
      this.Title = values.Title as string;
      this.Description = values.Description;
      const eventDate = DateTime.fromISO(values.Date || "");
      this.Date = !eventDate.invalidReason ? eventDate : undefined;
      this.ChannelID = values.ChannelID;
      this.Server = server;

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

  commitChanges() {
    if (this.Id <= 0) {
      Store(this.Server)
        .Events.Add(this)
        .then((id) => (this._id = id));
    } else {
      Store(this.Server).Events.Update(this);
    }
  }
}

export interface ScheduledEventConstructor {
  Id?: number;
  Name?: string;
  Title: string;
  Description?: string;
  Date?: string;
  ChannelID?: string;
}

export const GetEventByID = async (server: string, id: number) => await Store(server).Events.GetByID(id);

export const GetEventByName = async (server: string, name: string) => await Store(server).Events.GetByName(name);

export const GetEventByChannelID = async (server: string, id: string) => await Store(server).Events.GetByChannelID(id);

export default ScheduledEvent;