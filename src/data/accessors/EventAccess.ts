import { Database } from "sqlite3";
import ScheduledEvent from "../entities/Event";

export default (
  database: string,
  execute: (actions: (db: Database, resolve: Function, reject: Function) => void) => Promise<any>
) => ({
  Add: (event: ScheduledEvent): Promise<number> => {
    return execute((db, resolve, reject) => {
      db.serialize(() => {
        db.run("INSERT INTO Events (Name, Title, Description, Date, ChannelID) VALUES (?1, ?2, ?3, ?4, ?5)", {
          1: event.Name,
          2: event.Title,
          3: event.Description,
          4: event.Date && !event.Date.invalidReason ? event.Date.toISO() : "",
          5: event.ChannelID,
        });
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
      const result = new Array<ScheduledEvent>();
      db.each(
        "SELECT * FROM Events",
        [],
        (error, row) => {
          if (error) {
            reject(error);
          }
          result.push(new ScheduledEvent(row, database));
        },
        (error, numRows) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
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
        "UPDATE Events SET Name = ?1, Title = ?2, Description = ?3, Date = ?4, ChannelID = ?5 WHERE Id = ?6",
        {
          1: event.Name,
          2: event.Title,
          3: event.Description,
          4: event.Date && !event.Date.invalidReason ? event.Date.toISO() : "",
          5: event.ChannelID,
          6: event.Id,
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
