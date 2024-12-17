import fs from "node:fs";
import readline from "readline";

export default class MemoFile {
  #filePath;

  constructor() {
    this.#filePath = "./memos.jsonl";
  }

  async readMemos() {
    await this.#ensureFileExistence();
    const memos = [];
    const rl = readline.createInterface({
      input: fs.createReadStream(this.#filePath),
    });
    try {
      for await (const line of rl) {
        const memo = JSON.parse(line);
        memos.push(memo);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `メモファイルの読み込みに失敗しました：${error.message}`,
        );
      } else {
        throw error;
      }
    }
    return memos;
  }

  async saveFilteredMemos(memos, selectedMemo) {
    const filteredMemos = memos.filter((memo) => memo.id !== selectedMemo.id);
    let memoLines;
    if (filteredMemos.length === 0) {
      memoLines = "";
    } else {
      memoLines =
      filteredMemos.map((memo) => JSON.stringify(memo)).join("\n") + "\n";
    }
    await fs.promises.writeFile(this.#filePath, memoLines);
  }

  async appendMemo(memo) {
    const memoLine = JSON.stringify(memo) + "\n";
    await fs.promises.appendFile(this.#filePath, memoLine);
  }

  async #ensureFileExistence() {
    try {
      await fs.promises.readFile(this.#filePath, {
        encoding: "utf8",
      });
    } catch (error) {
      if (error instanceof Error && error.code === "ENOENT") {
        await fs.promises.writeFile(this.#filePath, "");
      } else {
        throw error;
      }
    }
  }
}
