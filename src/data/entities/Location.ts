import Store from "../Store";

export default class Location {
  private _server: string;
  private _id: number;
  private _stringID: string;
  private _name: string;
  Address?: string;
  Details?: string;

  constructor(location: LocationConstructor, server: string) {
    this._server = server;
    this._id = location.Id || -1;
    if (this._id > 0) {
      this._stringID = location.StringID as string;
    } else {
      this._stringID = location.Name.trim()
        .toLowerCase()
        // @ts-ignore : TS doesnt have replaceAll?
        .replaceAll(/[^\w\s-]/gi, "")
        .replaceAll(" ", "-");
    }
    this._name = location.Name;
    this.Address = location.Address;
    this.Details = location.Details;
  }

  get StringID() {
    return this._stringID;
  }

  get Name() {
    return this._name;
  }

  set Name(name: string) {
    this._name = name;
    this._stringID = name
      .trim()
      .toLowerCase()
      // @ts-ignore : TS doesnt have replaceAll?
      .replaceAll(/[^\w\s-]/gi, "")
      .replaceAll(" ", "-");
  }

  commitChanges() {
    if (this._id <= 0) {
      Store(this._server)
        .Locations.Add(this)
        .then((id) => (this._id = id));
    } else {
      Store(this._server).Locations.Update(this);
    }
  }
}

export interface LocationConstructor {
  Id?: number;
  StringID?: string;
  Name: string;
  Address?: string;
  Details?: string;
}
