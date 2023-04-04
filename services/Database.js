import React from 'react';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("iDiscovery_Db.sqlite3", "1", "Database to store events for discovery app.");

const db_createEvent_tbl = () => {
    return new Promise((resolve, reject) => {
        db.exec([{
            sql: "CREATE TABLE IF NOT EXISTS Events (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, location TEXT, date TEXT, startTime TEXT, stopTime TEXT, category TEXT, reporterName TEXT, description TEXT, timestamp TEXT);",
            args: []
        }], false, (error, response) => {
            resolve(response);
        });
    });
}

export const db_insertEvent = async (payload) => {
    return new Promise((resolve, reject) => {
        db_createEvent_tbl().then(response => {
            db.exec([{
                sql: "INSERT INTO Events (name, location, date, startTime, stopTime, category, reporterName, description, timestamp) VALUES (?,?,?,?,?,?,?,?,?);",
                args: payload
            }], false, (error, results) => {
                if (results.length == 1 && results[0]?.error) {
                    reject(results[0]?.error);
                }
                else {
                    resolve(results[0]);
                }
            });
        });

    });
}

export const db_updateEvent = async (payload) => {
    return new Promise((resolve, reject) => {
        db_createEvent_tbl().then(response => {
            db.exec([{
                sql: `UPDATE Events SET description = '${payload.description}' WHERE id = ${payload.id};`,
                args: []
            }], false, (error, results) => {
                if (results.length == 1 && results[0]?.error) {
                    reject(results[0]?.error);
                }
                else {
                    resolve(results[0]);
                }
            });
        });

    });
}

export const db_deleteEvent = async (id) => {
    return new Promise((resolve, reject) => {
        db_createEvent_tbl().then(response => {
            db.exec([{
                sql: `DELETE FROM Events WHERE id = ${id};`,
                args: []
            }], false, (error, results) => {
                if (results.length == 1 && results[0]?.error) {
                    reject(results[0]?.error);
                }
                else {
                    resolve(results[0]);
                }
            });
        });

    });
}

export const db_deleteAllEvents = async () => {
    return new Promise((resolve, reject) => {
        db_createEvent_tbl().then(response => {
            db.exec([{
                sql: `DELETE FROM Events;`,
                args: []
            }], false, (error, results) => {
                if (results.length == 1 && results[0]?.error) {
                    reject(results[0]?.error);
                }
                else {
                    resolve(results[0]);
                }
            });
        });

    });
}

export const db_getCategoryEvents = async (category) => {
    return new Promise((resolve, reject) => {
        db_createEvent_tbl().then(response => {
            db.exec([{
                sql: `SELECT * FROM Events WHERE category = '${category}';`, args: []
            }], false, (error, results) => {
                if (error) {
                    reject(error);
                }
                else {
                    if (results.length == 1 && results[0]?.error) {
                        reject(results[0]?.error);
                    }
                    else {                        
                        resolve(results[0]?.rows);
                    }
                }
            });
        });
    });
}

export const db_searchEventsByName = async (text) => {
    return new Promise((resolve, reject) => {
        db_createEvent_tbl().then(response => {
            db.exec([{
                sql: `SELECT * FROM Events WHERE name LIKE '%${text}%' OR location LIKE '%${text}%' OR reporterName LIKE '${text}';`,
                args: []
            }], false, (error, results) => {
                if (error) {
                    reject(error);
                }
                else {
                    if (results.length == 1 && results[0]?.error) {
                        reject(results[0]?.error);
                    }
                    else {                        
                        resolve(results[0]?.rows);
                    }
                }
            });
        });
    });
}

export const db_getAllEvents = async () => {
    return new Promise((resolve, reject) => {
        db_createEvent_tbl().then(response => {
            db.exec([{
                sql: 'SELECT * FROM Events;',
                args: []
            }], false, (error, results) => {
                if (error) {
                    reject(error);
                }
                else {
                    if (results.length == 1 && results[0]?.error) {
                        reject(results[0]?.error);
                    }
                    else {                                                
                        resolve(results[0]?.rows);
                    }
                }
            });
        });
    });
}