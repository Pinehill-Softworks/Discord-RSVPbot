import { DateTime } from "luxon";

class ScheduledEvent {
  Name: string;
  Title: string;
  Description: string;
  Date?: DateTime;
  ChannelID?: string;

  constructor(title: string, description?: string, date?: DateTime) {
    // @ts-ignore : TS doesnt have replaceAll?
    this.Name = title.trim().toLowerCase().replaceAll(" ", "-");
    this.Title = title;
    this.Description = description || "";
    this.Date = date || undefined;
  }

  setTitle(title: string) {
    if (title.trim().length > 0) {
      this.Title = title;
    }
  }

  setDescription(description: string) {
    this.Description = description;
  }

  setDate(date: DateTime) {
    if (date > DateTime.now() || date === null) {
      this.Date = date;
    }
  }

  setChannelID(id: string) {
    this.ChannelID = id;
  }

  getChannelName() {
    const dateToPrint = this.Date
      ? this.Date.toFormat(`M-d${DateTime.now().year !== this.Date.year ? "-y" : ""}`)
      : null;
    return `${this.Title}${dateToPrint ? `-${dateToPrint}` : ""}`;
  }
}

export default ScheduledEvent;
