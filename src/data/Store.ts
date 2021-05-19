import sqlite, { Database } from "sqlite3";
import fs from "fs";

import * as constants from "../CONSTANTS";
import Event from "./events/Event";
import ScheduledEvent from "./events/Event";
import EventAccess from "./events/EventAccess";

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
    Events: EventAccess(database, execute),
    RSVPs: () => ({}),
  };
};
