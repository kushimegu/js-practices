import sqlite3 from "sqlite3";
import { run, get, close } from "./promisified_functions.js";

const db = new sqlite3.Database(":memory:");

promiseOperation();

function promiseOperation() {
  run(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  )
    .then(function () {
      return run(db, "INSERT INTO books(title) VALUES (?)", ["JavaScript"]);
    })
    .then(function (result) {
      console.log(result);
      return get(db, "SELECT * FROM books WHERE title = ?", ["JavaScript"]);
    })
    .then(function (result) {
      console.log(result);
      return run(db, "DROP TABLE books");
    })
    .then(function () {
      return close(db);
    })
}
