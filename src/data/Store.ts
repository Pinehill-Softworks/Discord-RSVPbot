import sqlite, { Database } from "sqlite3";
import fs from "fs";

import * as constants from "../CONSTANTS";
import Event from "./Event";

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

export default (id: string) => {
  const path = () => `${constants.DATABASE_FILE_LOCATION}/${id}.db`;

  const execute = (actions: (db: Database, result: Array<any>) => void) => {
    let shouldGenerate = !fs.existsSync(path());
    const db = new sqlite.Database(path(), log(`Connecting to database for server ${id}`));
    const result: Array<any> = [];

    db.serialize(() => {
      if (shouldGenerate) {
        generateTables(db);
      }
      actions(db, result);
    });

    db.close(log(`Closed database for server ${id}`));

    return result;
  };

  if (!fs.existsSync(path())) {
  }

  return {
    Events: () => ({
      Add: (event: Event) =>
        execute((db, result) => {
          db.run("INSERT INTO Events (Name, Title, Description, Date, ChannelID) VALUES (?1, ?2, ?3, ?4, ?5)", {
            1: event.Name,
            2: event.Title,
            3: event.Description,
            4: event.Date,
            5: event.ChannelID,
          });
        }),
    }),
  };
};
