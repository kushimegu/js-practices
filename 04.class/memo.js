#!/usr/bin/env node

import { MemoFile } from "./memo_file.js";
import { MemoHandler } from "./memo_handler.js";

class Command {
  constructor(memoHandler, argv) {
    this.memoHandler = memoHandler
    this.argv = argv;
  }

  #checkOption() {
    if (
      this.argv.length >= 2 ||
      !this.argv.every((option) => ["-l", "-r", "-d"].includes(option))
    ) {
      throw new Error("l、r、dからオプションを一つだけ指定してください。");
    }
  }

  async execute() {
    try {
      this.#checkOption()
      if (this.argv.includes("-l")) {
        await this.memoHandler.listMemos();
      } else if (this.argv.includes("-r")) {
        await this.memoHandler.showMemo();
      } else if (this.argv.includes("-d")) {
        await this.memoHandler.deleteMemo();
      } else {
        await this.memoHandler.createMemo();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        throw error;
      }
    }
  }
}

const FILE_PATH = "./memos.json";
const memoFile = new MemoFile(FILE_PATH);
const memoHandler = new MemoHandler(memoFile);
const command = new Command(memoHandler, process.argv.slice(2));
await command.execute();
