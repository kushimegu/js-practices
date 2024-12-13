import fs from "node:fs";
import readline from "readline";
import isEqual from "lodash.isequal";

export default class MemoFile {
  #filePath;

  constructor() {
    this.#filePath = "./memos.jsonl";
  }

  async readMemos() {
    await this.#assureFileExistence();
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
    const filteredMemos = memos.filter((memo) => !isEqual(memo, selectedMemo));
    const memoLines =
      filteredMemos.map((memo) => JSON.stringify(memo)).join("\n") + "\n";
    await fs.promises.writeFile(this.#filePath, memoLines);
  }

  async appendMemo(memo) {
    const memoLine = JSON.stringify(memo) + "\n";
    await fs.promises.appendFile(this.#filePath, memoLine);
  }

  async #assureFileExistence() {
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
