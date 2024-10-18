import sqlite3 from "sqlite3";
import { run, get, close } from "./promisified_functions.js";

const db = new sqlite3.Database(":memory:");

run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => run(db, "INSERT INTO books (title) VALUES (?)", ["JavaScript"]))
  .then((lastId) => {
    console.log(lastId);
  })
  .then(() => get(db, "SELECT * FROM books WHERE title = ?", ["JavaScript"]))
  .then((record) => {
    console.log(record);
  })
  .then(() => run(db, "DROP TABLE books"))
  .then(() => close(db));
