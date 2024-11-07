#!/usr/bin/env node

import fs, { existsSync, writeFileSync } from "fs";
import readline from "readline";
import crypto from "crypto";
import Enquirer from "enquirer";

const FILE_PATH = "./memos.json";

if (!existsSync(FILE_PATH) || fs.readFileSync(FILE_PATH, "utf8") === "") {
  writeFileSync(FILE_PATH, JSON.stringify([], null, 2));
}

const memos = JSON.parse(fs.readFileSync(FILE_PATH));
if (process.argv[2] === "-l") {
  const memoTitles = memos.map((memo) => memo.content[0]);
  memoTitles.forEach((memo) => console.log(memo))
} else if (process.argv[2] === "-r") {
  const memoTitles = memos.map((memo) => memo.content[0]);
  const question = {
    type: "select",
    name: "memo",
    message: "Choose a memo you want to see:",
    choices: memoTitles,
  };
  const answer = await Enquirer.prompt(question)
  const selectedMemo = memos.find((memo) => memo.content[0] === answer.memo)
  selectedMemo.content.forEach((line) => console.log(line));
} else if (process.argv[2] === "-d") {
  const memoTitles = memos.map((memo) => memo.content[0]);
  const question = {
    type: "select",
    name: "memo",
    message: "Choose a memo you want to delete",
    choices: memoTitles,
  };
  const answer = await Enquirer.prompt(question)

  const filteredMemos = memos.filter((memo) => memo.content[0] !== answer.memo)
  writeFileSync(FILE_PATH, JSON.stringify(filteredMemos, null, 2))
} else {
  let rl = readline.createInterface({
    input: process.stdin,
  });
  const writeStream = fs.createWriteStream(FILE_PATH);
  const lines = [];
  rl.on("line", (line) => {
    lines.push(line);
  });
  rl.on("close", () => {
    const memo = { id: crypto.randomUUID(), content: lines };
    memos.push(memo);
    writeStream.write(JSON.stringify(memos, null, 2));
    writeStream.end();
  });
  rl.close;
}
