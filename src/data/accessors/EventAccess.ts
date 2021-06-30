import { Database } from "sqlite3";
import ScheduledEvent from "../entities/Event";

export default (
  database: string,
  execute: (actions: (db: Database, resolve: Function, reject: Function) => void) => Promise<any>
) => ({
  Add: (event: ScheduledEvent): Promise<number> => {
    return execute((db, resolve, reject) => {
      db.serialize(() => {
        db.run(
          "INSERT INTO Events (Name, Title, HostID, Active, Description, Date, ChannelID) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
          {
            1: event.Name,
            2: event.Title,
            3: event.HostID,
            4: event.Active ? 1 : 0,
            5: event.Description,
            6: event.Date && !event.Date.invalidReason ? event.Date.toISO() : "",
            7: event.ChannelID,
          }
        );
        db.get("SELECT Id FROM Events WHERE Name = ?", [event.Name], (error, row) => {
          if (error) {
            reject(error);
          }
          resolve(row.Id);
        });
      });
    });
  },
  GetAll: (): Promise<Array<ScheduledEvent>> => {
    return execute((db, resolve, reject) => {
      db.all("SELECT * FROM Events", [], (error, rows) => {
        if (error) {
          reject(error);
        }
        resolve(rows);
      });
    });
  },
  GetByName: (name: string): Promise<ScheduledEvent> => {
    return execute((db, resolve, reject) => {
      db.get("SELECT * FROM Events WHERE Name = ?", [name], (error, row) => {
        if (error) {
          reject(error);
        }
        resolve(row ? new ScheduledEvent(row, database) : null);
      });
    });
  },
  GetByID: (id: number): Promise<ScheduledEvent> => {
    return execute((db, resolve, reject) => {
      db.get("SELECT * FROM Events WHERE Id = ?", [id], (error, row) => {
        if (error) {
          reject(error);
        }
        resolve(row ? new ScheduledEvent(row, database) : null);
      });
    });
  },
  GetByChannelID: (id: string): Promise<ScheduledEvent> => {
    return execute((db, resolve, reject) => {
      db.get("SELECT * FROM Events WHERE ChannelID = ?", [id], (error, row) => {
        if (error) {
          reject(error);
        }
        resolve(row ? new ScheduledEvent(row, database) : null);
      });
    });
  },
  Update: (event: ScheduledEvent): Promise<Boolean> => {
    return execute((db, resolve, reject) => {
      db.run(
        "UPDATE Events SET Name = ?1, Title = ?2, Description = ?3, Active = ?4, Date = ?5, ChannelID = ?6 WHERE Id = ?7",
        {
          1: event.Name,
          2: event.Title,
          3: event.Description,
          4: event.Active ? 1 : 0,
          5: event.Date && !event.Date.invalidReason ? event.Date.toISO() : "",
          6: event.ChannelID,
          7: event.Id,
        },
        (error) => {
          if (error) {
            reject(error);
          }
          resolve(true);
        }
      );
    });
  },
});
