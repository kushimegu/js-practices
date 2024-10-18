import sqlite3 from "sqlite3";
import { run, get, close } from "./promisified_functions.js";

const db = new sqlite3.Database(":memory:");

await run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
try {
  try {
    const result = await run(db, "INSERT INTO books (title) VALUES (?)");
    console.log(result.lastID);
  } catch (error) {
    if (error.code && error.code === "SQLITE_CONSTRAINT") {
      console.error(error.message);
    } else {
      throw error;
    }
  }
  try {
    const record = await get(db, "SELECT * FROM table WHERE title = ?", [
      "JavaScript",
    ]);
    console.log(record);
  } catch (error) {
    if (error.code && error.code === "SQLITE_ERROR") {
      console.error(error.message);
    } else {
      throw error;
    }
  }
} catch (error) {
  console.error(error.message);
}
await run(db, "DROP TABLE books");
await close(db);
