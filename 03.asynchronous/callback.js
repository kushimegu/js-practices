import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  function () {
    db.run("INSERT INTO books(title) VALUES (?)", "JavaScript", function () {
      console.log(this.lastID);
      db.get(
        "SELECT * FROM books WHERE title = ?",
        ["JavaScript"],
        function (error, row) {
          console.log(row);
          db.run("DROP TABLE books", function () {
            db.close();
          });
        },
      );
    });
  },
);
