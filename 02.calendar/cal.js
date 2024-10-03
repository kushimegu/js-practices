#!/usr/bin/env node

let year, month;
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === "-y") {
    year = process.argv[i + 1];
  } else if (process.argv[i] === "-m") {
    month = process.argv[i + 1];
  }
}
const today = new Date();
month ??= today.getMonth() + 1;
year ??= today.getFullYear();
console.log(`      ${month}月 ${year}`);

console.log("日 月 火 水 木 金 土");

const first_date = new Date(year, month - 1, 1);
const last_date = new Date(year, month, 0);
process.stdout.write("   ".repeat(first_date.getDay()));
for (
  let date = first_date;
  date <= last_date;
  date.setDate(date.getDate() + 1)
) {
  process.stdout.write(date.getDate().toString().padStart(2, " "));
  if (date.getDay() === 6) {
    process.stdout.write("\n");
  } else {
    process.stdout.write(" ");
  }
}
