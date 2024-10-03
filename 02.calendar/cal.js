#!/usr/bin/env node

let argv_year, argv_month;
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === "-y") {
    argv_year = process.argv[i + 1];
  } else if (process.argv[i] === "-m") {
    argv_month = process.argv[i + 1];
  }
}
const today = new Date();
const month = (argv_month ||= today.getMonth() + 1);
const year = (argv_year ||= today.getFullYear());
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
