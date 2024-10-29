import sqlite3 from "sqlite3";
import { run, get, close } from "./promisified_functions.js";

const db = new sqlite3.Database(":memory:");

await run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
const rowDetail = await run(db, "INSERT INTO books (title) VALUES (?)", [
  "JavaScript",
]);
console.log(rowDetail.lastID);
const row = await get(db, "SELECT * FROM books WHERE title = ?", [
  "JavaScript",
]);
console.log(row);
await run(db, "DROP TABLE books");
await close(db);
