import sqlite3 from "sqlite3";
import { run, get, close } from "./promisified_functions.js";

const db = new sqlite3.Database(":memory:");

promiseOperationWithError();

function promiseOperationWithError() {
  run(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  )
    .then(function () {
      return run(db, "INSERT INTO books(title) VALUES (?)");
    })
    .then(function (result) {
      console.log(result);
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      return get(db, "SELECT * FROM table WHERE title = ?", ["JavaScript"]);
    })
    .then(function (result) {
      console.log(result);
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      run(db, "DROP TABLE books");
    })
    .then(function () {
      return close(db);
    });
}
