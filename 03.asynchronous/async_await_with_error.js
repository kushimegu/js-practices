import sqlite3 from "sqlite3";
import { run, get, close } from "./promisified_functions.js";

const db = new sqlite3.Database(":memory:");

await run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
try {
  const rowDetail = await run(db, "INSERT INTO books (title) VALUES (?)", [
    null,
  ]);
  console.log(rowDetail.lastID);
} catch (error) {
  if (error instanceof Error && error.code === "SQLITE_CONSTRAINT") {
    console.error(error.message);
  } else {
    throw error;
  }
}
try {
  const row = await get(db, "SELECT * FROM table WHERE title = ?", [
    "JavaScript",
  ]);
  console.log(row);
} catch (error) {
  if (error instanceof Error && error.code === "SQLITE_ERROR") {
    console.error(error.message);
  } else {
    throw error;
  }
}
await run(db, "DROP TABLE books");
await close(db);
