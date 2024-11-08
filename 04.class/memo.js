#!/usr/bin/env node

import {FileHandler} from "./file_handler.js";
import {MemoHandler} from "./memo_handler.js";

const FILE_PATH = "./memos.json";
const fileHandler = new FileHandler(FILE_PATH);
const memoHandler = new MemoHandler(fileHandler);

const argv = process.argv[2];
if (argv === "-l") {
  memoHandler.listMemos();
} else if (argv === "-r") {
  memoHandler.showMemo();
} else if (argv === "-d") {
  memoHandler.deleteMemo();
} else {
  memoHandler.createMemo();
}
