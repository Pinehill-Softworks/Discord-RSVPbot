"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3_1 = __importDefault(require("sqlite3"));
var fs_1 = __importDefault(require("fs"));
var constants = __importStar(require("../CONSTANTS"));
var generateTables = function (db) {
    db.serialize(function () {
        db.run("CREATE TABLE IF NOT EXISTS Events (Id INTEGER PRIMARY KEY, Name TEXT NOT NULL, Title TEXT NOT NULL, Description TEXT NULL, Date TEXT NULL, ChannelID TEXT NULL)", [], log("Creating event table."));
    });
};
var log = function (message) {
    return function (error) {
        if (error) {
            console.log(JSON.stringify(error));
        }
        console.log(message);
    };
};
exports.default = (function (id) {
    var path = function () { return constants.DATABASE_FILE_LOCATION + "/" + id + ".db"; };
    var execute = function (actions) {
        var shouldGenerate = !fs_1.default.existsSync(path());
        var db = new sqlite3_1.default.Database(path(), log("Connecting to database for server " + id));
        var result = [];
        db.serialize(function () {
            if (shouldGenerate) {
                generateTables(db);
            }
            actions(db, result);
        });
        db.close(log("Closed database for server " + id));
        return result;
    };
    if (!fs_1.default.existsSync(path())) {
    }
    return {
        Events: function () { return ({
            Add: function (event) {
                return execute(function (db, result) {
                    db.run("INSERT INTO Events (Name, Title, Description, Date, ChannelID) VALUES (?1, ?2, ?3, ?4, ?5)", {
                        1: event.Name,
                        2: event.Title,
                        3: event.Description,
                        4: event.Date,
                        5: event.ChannelID,
                    });
                });
            },
        }); },
    };
});
