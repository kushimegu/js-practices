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
        title: memo.contents[0],
        contents: memo.contents,
      })),
      result() {
        return this.focused.contents;
      },
    });

    let selectedMemoContents;
    try {
      selectedMemoContents = await prompt.run();
    } catch (error) {
      if (error === "") {
        throw new Error("メモの選択が中断されました");
      } else {
        throw error;
      }
    }
    selectedMemoContents.forEach((content) => {
      console.log(content);
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
        id: memo.id,
        title: memo.contents[0],
      })),
      result() {
        return this.focused.id;
      },
    });

    let selectedMemoId;
    try {
      selectedMemoId = await prompt.run();
    } catch (error) {
      if (error === "") {
        throw new Error("メモの選択が中断されました");
      } else {
        throw error;
      }
    }
    await this.#memoFile.deleteMemo(selectedMemoId);
  }

  async createMemo() {
    const rl = readline.createInterface({
      input: process.stdin,
    });
    const contents = [];
    for await (const content of rl) {
      contents.push(content);
    }
    if (contents.length === 0) {
      return;
    }
    const memo = { id: crypto.randomUUID(), contents };
    await this.#memoFile.appendMemo(memo);
  }
}
