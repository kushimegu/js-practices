import sqlite3 from "sqlite3";
import { run, get, close } from "./promisified_functions.js";

const db = new sqlite3.Database(":memory:");

asyncAwaitOperationWithError();

async function asyncAwaitOperationWithError() {
  await run(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );
  try {
    const lastId = await run(db, "INSERT INTO books(title) VALUES (?)");
    console.log(lastId);
  } catch (error) {
    console.log(error);
  }
  try {
    const record = await get(db, "SELECT * FROM table WHERE title = ?", [
      "JavaScript",
    ]);
    console.log(record);
  } catch (error) {
    console.log(error);
  }
  await run(db, "DROP TABLE books");
  await close(db);
}
