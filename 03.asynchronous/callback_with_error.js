import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  function (error) {
    db.run("INSERT INTO books(title) VALUES (?)", function (error) {
      if (error) {
        return console.log(error);
      }
      console.log(this.lastID);
      db.get(
        "SELECT * FROM table WHERE title = ?",
        "JavaScript",
        function (error, row) {
          if (error) {
            return console.log(error);
          }
          console.log(row);
          db.run("DROP TABLE books");
          db.close();
        },
      );
    });
  },
);
