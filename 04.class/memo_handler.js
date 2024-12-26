import readline from "readline";
import enquirer from "enquirer";
import crypto from "crypto";

import MemoFile from "./memo_file.js";

export default class MemoHandler {
  #memoFile;

  constructor() {
    this.#memoFile = new MemoFile();
  }

  async listMemos() {
    const memos = await this.#memoFile.readMemos();
    memos.forEach((memo) => {
      console.log(memo.contents[0]);
    });
  }

  async showMemo() {
    const memos = await this.#memoFile.readMemos();
    if (memos.length === 0) {
      console.log("メモがありません。");
      return;
    }
    const prompt = new enquirer.Select({
      type: "select",
      message: "閲覧したいメモを選択してください。",
      choices: memos.map((memo) => ({
        ...memo,
        title: memo.contents[0],
      })),
      result() {
        return this.focused;
      },
    });
    let selectedMemo;
    try {
      selectedMemo = await prompt.run();
    } catch (error) {
      if (error === "") {
        throw new Error("メモの選択が中断されました");
      } else {
        throw error;
      }
    }
    selectedMemo.contents.forEach((line) => {
      console.log(line);
    });
  }

  async deleteMemo() {
    const memos = await this.#memoFile.readMemos();
    if (memos.length === 0) {
      console.log("メモがありません。");
      return;
    }
    const prompt = new enquirer.Select({
      type: "select",
      message: "削除したいメモを選択してください。",
      choices: memos.map((memo) => ({
        ...memo,
        title: memo.contents[0],
      })),
      result() {
        return this.focused;
      },
    });
    let selectedMemo;
    try {
      selectedMemo = await prompt.run();
    } catch (error) {
      if (error === "") {
        throw new Error("メモの選択が中断されました");
      } else {
        throw error;
      }
    }
    await this.#memoFile.deleteMemo(memos, selectedMemo);
  }

  async createMemo() {
    const rl = readline.createInterface({
      input: process.stdin,
    });
    const lines = [];
    for await (const line of rl) {
      lines.push(line);
    }
    if (lines.length === 0) {
      return;
    }
    const memo = { id: crypto.randomUUID(), contents: lines };
    await this.#memoFile.appendMemo(memo);
  }
}
