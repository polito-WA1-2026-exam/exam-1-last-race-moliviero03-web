import sqlite3 from "sqlite3"
import crypto from "crypto"
import { Player, Segment, Line, Event } from "./Models.js"
import { stderr } from "process"

const db = new sqlite3.Database("database.sqlite", (err) => {
    if (err) throw err;
});

export const getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM user WHERE username = ?";
    db.get(sql, [username], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        const user = {id: row.userId, name: row.name, surname: row.surname, username: row.username, bestScore: row.bestScore};
        
        crypto.scrypt(password, row.salt, 64, function(err, hashedPassword) {
          if (err) reject(err);
          if(!crypto.timingSafeEqual(Buffer.from(row.hashedPassword, "hex"), hashedPassword))
            resolve(false);
          else
            resolve(user);
        });
      }
    });
  });
};

export const listPlayers = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT user.username, user.bestScore FROM user`;
        db.all(sql, (err, rows) => {
            if (err){
                reject(err);
            }
            else{
                const players = rows.map((p) => new Player(p.username, p.bestScore));
                resolve(players)
            }
        });
    });
}

export const listStations = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT line.station1, line.station2 FROM line`;
        db.all(sql, (err, rows) => {
            if (err){
                reject(err);
            }
            else{
                const stations = [];
                for (const row of rows){
                    if (!stations.includes(row.station1)){
                        stations.push(row.station1);
                    }
                    if (!stations.includes(row.station2)){
                        stations.push(row.station2);
                    }
                }
                resolve(stations);
            }
        })
    })
}

export const listSegments = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT line.station1, line.station2 FROM line`;
        db.all(sql, (err, rows) => {
            if (err){
                reject(err);
            }
            else{
                const segments = rows.map((s) => new Segment(s.station1, s.station2));
                resolve(segments);
            }
        });
    });
}

const listLineSegments = (lineNumber) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT line.station1, line.station2 FROM line
                    WHERE line.lineNumber = ?
                    ORDER BY line.segIndex ASC`;
        db.all(sql, [lineNumber], (err, rows) => {
            if (err){
                reject(err);
            }
            else{
                const lineSegments = rows.map((ls) => new Segment(ls.station1, ls.station2));
                resolve(lineSegments);
            }
        });
    });
}

export const listLines = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT DISTINCT line.lineNumber FROM line`;
        db.all(sql, async (err, rows) => {
            if (err){
                reject(err);
            }
            else{
                try{
                    const promises = rows.map(async (l) => new Line(l.lineNumber, await listLineSegments(l.lineNumber)));
                    const lines = await Promise.all(promises);
                    resolve(lines);
                }
                catch (error){
                    reject(error);
                }
            }
        });
    });
}

export const listEvents = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT event.description, event.effect FROM event`;
        db.all(sql, (err, rows) => {
            if (err){
                reject(err);
            }
            else{
                const events = rows.map((e) => new Event(e.description, e.effect));
                resolve(events);
            }
        });
    });
}