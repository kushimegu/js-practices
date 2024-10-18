import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run("INSERT INTO books (title) VALUES (?)", [null], function (error) {
      if (error) {
        console.error(error.message);
      } else {
        console.log(this.lastID);
      }
      db.get(
        "SELECT * FROM table WHERE title = ?",
        ["JavaScript"],
        function (error, row) {
          if (error) {
            console.error(error.message);
          } else {
            console.log(row);
          }
          db.run("DROP TABLE books", () => {
            db.close();
          });
        },
      );
    });
  },
);
