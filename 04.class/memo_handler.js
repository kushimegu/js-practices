import readline from "readline";
import pkg from "enquirer";

import { Memo } from "./class_memo.js";

const { Select } = pkg;

export class MemoHandler {
  constructor(memoFile) {
    this.memoFile = memoFile;
  }

  #loadMemos() {
    try {
      return this.memoFile.readMemos();
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`無効なファイルです：${error.message}`);
      } else if (error instanceof Error) {
        throw new Error(
          `メモファイルの読み込みに失敗しました：${error.message}`,
        );
      } else {
        throw error;
      }
    }
  }

  createMemo() {
    const memos = this.#loadMemos();
    let writeStream;
    try {
      writeStream = this.memoFile.writeStream();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`ストリームの作成に失敗しました：${error.message}`);
      } else {
        throw error;
      }
    }
    const rl = readline.createInterface({
      input: process.stdin,
      output: writeStream,
    });
    const lines = [];
    rl.on("line", (line) => {
      lines.push(line);
    });
    rl.on("close", () => {
      if (lines.length === 0) {
        lines.push("空のメモ");
      }
      const memo = new Memo(lines);
      memos.push(memo);
      try {
        this.memoFile.writeMemos(memos);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`メモの書き込みに失敗しました：${error.message}`);
        } else {
          throw error;
        }
      }
    });
  }

  listMemos() {
    const memos = this.#loadMemos();
    const memoTitles = memos.map((memo) => memo.content[0]);
    memoTitles.forEach((title) => console.log(title));
  }

  async #selectMemo(prompt) {
    const memos = this.#loadMemos();
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
    return memos.find((memo) => memo.id === answer);
  }

  async showMemo() {
    const memos = this.#loadMemos();
    if (memos.length === 0) {
      throw new Error("メモがありません。");
    }
    const choices = memos.map((memo) => ({
      title: memo.content[0],
      id: memo.id,
    }));
    const prompt = new Select({
      message: "閲覧したいメモを選択してください。",
      choices: choices,
      result() {
        return this.focused.id;
      },
    });
    const selectedMemo = await this.#selectMemo(prompt);
    selectedMemo.content.forEach((line) => console.log(line));
  }

  async deleteMemo() {
    const memos = this.#loadMemos();
    if (memos.length === 0) {
      throw new Error("メモがありません。");
    }
    const choices = memos.map((memo) => ({
      title: memo.content[0],
      id: memo.id,
    }));
    const prompt = new Select({
      message: "削除したいメモを選択してください。",
      choices: choices,
      result() {
        return this.focused.id;
      },
    });
    const selectedMemo = await this.#selectMemo(prompt);
    const filteredMemos = memos.filter((memo) => memo.id !== selectedMemo.id);
    try {
      this.memoFile.saveMemos(filteredMemos);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`残りのメモの保存に失敗しました：${error.message}`);
      } else {
        throw error;
      }
    }
  }
}
