import { Database } from "sqlite3";
import ScheduledEvent from "../entities/Event";
import RSVP from "../entities/RSVP";

export default (
  database: string,
  execute: (actions: (db: Database, resolve: Function, reject: Function) => void) => Promise<any>
) => ({
  Add: (rsvp: RSVP): Promise<number> => {
    return execute((db, resolve, reject) => {
      db.serialize(() => {
        db.run("INSERT INTO RSVPs (EventID, AttendeeUserID, AdditionalAttendees) VALUES (?1, ?2, ?3)", {
          1: rsvp.EventID,
          2: rsvp.AttendeeUserID,
          3: rsvp.AdditionalAttendees,
        });
        db.get(
          "SELECT Id FROM RSVPs WHERE EventID = ?1 AND AttendeeUserID = ?2",
          { 1: rsvp.EventID, 2: rsvp.AttendeeUserID },
          (error, row) => {
            if (error) {
              reject(error);
            }
            resolve(row.Id);
          }
        );
      });
    });
  },
  GetByEventID: (id: number) => {
    return execute((db, resolve, reject) => {
      db.serialize(() => {
        let event: ScheduledEvent;
        db.get("SELECT * FROM Events WHERE Id = ?", [id], (error, row) => {
          if (error) {
            reject(error);
          }
          event = new ScheduledEvent(row, database);
        });
        db.all("SELECT * FROM RSVPs WHERE EventID = ?", [id], (error, rows) => {
          if (error) {
            reject(error);
          }
          resolve(rows.map((i) => new RSVP({ ...i, Event: event }, database)));
        });
      });
    });
  },
});
