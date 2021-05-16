import { DateTime } from "luxon";

class ScheduledEvent {
  Name: string;
  Title: string;
  Description: string;
  Date?: DateTime;

  constructor(title: string, description?: string, date?: DateTime) {
    // @ts-ignore
    this.Name = title.trim().replaceAll(" ", "-");
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
}

export default ScheduledEvent;
