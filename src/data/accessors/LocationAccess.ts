import { Database } from "sqlite3";
import Location from "../entities/Location";

export default (
  database: string,
  execute: (actions: (db: Database, resolve: Function, reject: Function) => void) => Promise<any>
) => ({
  Add: (location: Location): Promise<number> => {
    return new Promise<number>((resolve, reject) => {});
  },
  Update: (location: Location) => {},
});
