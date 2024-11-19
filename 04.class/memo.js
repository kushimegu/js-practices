#!/usr/bin/env node

import { MemoFile } from "./memo_file.js";
import { MemoHandler } from "./memo_handler.js";

const FILE_PATH = "./memos.json";
const memoFile = new MemoFile(FILE_PATH);

try {
  await memoFile.initializeFile();
} catch (error) {
  if (error instanceof Error) {
    console.error(`メモファイルの初期化に失敗しました：${error.message}`);
    process.exit(0);
  } else {
    throw error;
  }
}

const memoHandler = new MemoHandler(memoFile);

try {
  const argv = process.argv.slice(2);
  if (
    argv.length >= 2 ||
    !argv.every((option) => ["-l", "-r", "-d"].includes(option))
  ) {
    throw new Error("l、r、dからオプションを一つだけ指定してください。");
  }

  if (argv.includes("-l")) {
    await memoHandler.listMemos();
  } else if (argv.includes("-r")) {
    await memoHandler.showMemo();
  } else if (argv.includes("-d")) {
    await memoHandler.deleteMemo();
  } else {
    await memoHandler.createMemo();
  }
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    throw error;
  }
}
