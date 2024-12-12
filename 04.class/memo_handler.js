import readline from "readline";
import enquirer from "enquirer";
import isEqual from "lodash.isequal";

import Memo from "./class_memo.js";
import MemoFile from "./memo_file.js";

export default class MemoHandler {
  #memoFile;

  constructor() {
    this.#memoFile = new MemoFile();
  }

  async listMemos() {
    const memos = await this.#memoFile.readMemos();
    memos.forEach((memo) => {
      console.log(memo.title);
    });
  }

  async showMemo() {
    const memos = await this.#memoFile.readMemos();
    if (memos.length === 0) {
      throw new Error("メモがありません。");
    }
    const prompt = new enquirer.Select({
      type: "select",
      message: "閲覧したいメモを選択してください。",
      choices: memos,
      result() {
        return this.focused;
      },
    });
    let answer;
    try {
      answer = await prompt.run();
    } catch (error) {
      if (error === "") {
        throw new Error("メモの選択が中断されました");
      } else {
        throw error;
      }
    }
    const selectedMemo = memos.find((memo) => isEqual(memo, answer));
    selectedMemo.content.forEach((line) => {
      console.log(line);
    });
  }

  async deleteMemo() {
    const memos = await this.#memoFile.readMemos();
    if (memos.length === 0) {
      throw new Error("メモがありません。");
    }
    const prompt = new enquirer.Select({
      type: "select",
      message: "削除したいメモを選択してください。",
      choices: memos,
      result() {
        return this.focused;
      },
    });
    let answer;
    try {
      answer = await prompt.run();
    } catch (error) {
      if (error === "") {
        throw new Error("メモの選択が中断されました");
      } else {
        throw error;
      }
    }
    const selectedMemo = memos.find((memo) => isEqual(memo, answer));
    try {
      await this.#memoFile.saveFilteredMemos(memos, selectedMemo);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`メモの削除に失敗しました：${error.message}`);
      } else {
        throw error;
      }
    }
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
      lines.push("空のメモ");
    }
    const memo = new Memo(lines);
    try {
      await this.#memoFile.appendMemo(memo);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`メモの書き込みに失敗しました：${error.message}`);
      } else {
        throw error;
      }
    }
  }
}
