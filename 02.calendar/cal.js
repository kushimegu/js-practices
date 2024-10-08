#!/usr/bin/env node

const today = new Date();
let month = today.getMonth() + 1;
let year = today.getFullYear();

for (let i = 2; i < process.argv.length; i++) {
  if (
    process.argv[i] === "-m" &&
    Number.isInteger(parseInt(process.argv[i + 1]))
  ) {
    month = parseInt(process.argv[i + 1]);
  } else if (
    process.argv[i] === "-y" &&
    Number.isInteger(parseInt(process.argv[i + 1]))
  ) {
    year = parseInt(process.argv[i + 1]);
  }
}

console.log(`      ${month}月 ${year}`);
console.log("日 月 火 水 木 金 土");

const firstDate = new Date(year, month - 1, 1);
const lastDate = new Date(year, month, 0);
process.stdout.write("   ".repeat(firstDate.getDay()));
for (
  const date = new Date(firstDate);
  date <= lastDate;
  date.setDate(date.getDate() + 1)
) {
  process.stdout.write(date.getDate().toString().padStart(2));
  if (date.getDay() === 6 || date.getDate() === lastDate.getDate()) {
    process.stdout.write("\n");
  } else {
    process.stdout.write(" ");
  }
}
