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

  async deleteMemo(memos, selectedMemo) {
    await this.#clearFile();
    for (const memo of memos) {
      if (memo.id !== selectedMemo.id) {
        await this.appendMemo(memo);
      }
    }
  }

  async appendMemo(memo) {
    await fs.promises.appendFile(this.#filePath, this.#formatMemo(memo));
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

  async #clearFile() {
    await fs.promises.writeFile(this.#filePath, "");
  }

  #formatMemo(memo) {
    return JSON.stringify(memo) + "\n";
  }
}
