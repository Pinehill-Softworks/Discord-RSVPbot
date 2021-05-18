import { DateTime } from "luxon";
declare class ScheduledEvent {
    Name: string;
    Title: string;
    Description: string;
    Date?: DateTime;
    ChannelID?: string;
    constructor(title: string, description?: string, date?: DateTime);
    setTitle(title: string): void;
    setDescription(description: string): void;
    setDate(date: DateTime): void;
    setChannelID(id: string): void;
    getChannelName(): string;
}
export default ScheduledEvent;
