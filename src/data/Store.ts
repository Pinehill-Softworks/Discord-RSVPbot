import sqlite, { Database } from "sqlite3";
import fs from "fs";

import * as constants from "../CONSTANTS";
import Event from "./Event";
import ScheduledEvent from "./Event";

const generateTables = (db: Database) => {
  db.serialize(() => {
    db.run(
      "CREATE TABLE IF NOT EXISTS Events (Id INTEGER PRIMARY KEY, Name TEXT NOT NULL, Title TEXT NOT NULL, Description TEXT NULL, Date TEXT NULL, ChannelID TEXT NULL)",
      [],
      log("Creating event table.")
    );
  });
};

const log = (message: string): ((err: Error | null) => void) => {
  return (error) => {
    if (error) {
      console.log(JSON.stringify(error));
    }
    console.log(message);
  };
};

export default (database: string) => {
  const path = () => `${constants.DATABASE_FILE_LOCATION}/${database}.db`;

  const execute = (actions: (db: Database, resolve: Function, reject: Function) => void): Promise<any> => {
    return new Promise((resolve, reject) => {
      let shouldGenerate = !fs.existsSync(path());
      const db = new sqlite.Database(path(), log(`Connecting to database for server ${database}`));

      db.serialize(() => {
        if (shouldGenerate) {
          generateTables(db);
        }
        actions(db, resolve, reject);
      });

      db.close(log(`Closed database for server ${database}`));
    });
  };

  return {
    Events: () => ({
      Add: (event: Event): Promise<number> => {
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
    }),
  };
};
