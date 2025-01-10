import fs from "node:fs";

export default class MemoFile {
  #filePath;

  constructor() {
    this.#filePath = "./memos.jsonl";
  }

  async readMemos() {
    await this.#ensureFileExistence();

    let memoFile;
    try {
      memoFile = await fs.promises.readFile(this.#filePath, {
        encoding: "utf8",
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `メモファイルの読み込みに失敗しました：${error.message}`,
        );
      } else {
        throw error;
      }
    }

    const memos = this.#deserializeJsonLines(
      memoFile.split("\n").filter((line) => line !== ""),
    );
    return memos;
  }

  async deleteMemo(selectedMemo) {
    const memos = await this.readMemos();
    const filteredMemos = memos.filter(
      (memo) => memo.id !== selectedMemo.value,
    );
    const memoLines = this.#serializeToJsonLines(filteredMemos);
    await fs.promises.writeFile(this.#filePath, memoLines);
  }

  async appendMemo(memo) {
    await fs.promises.appendFile(this.#filePath, this.#stringifyLine(memo));
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

  #deserializeJsonLines(lines) {
    return lines.map((line) => JSON.parse(line));
  }

  #stringifyLine(line) {
    return JSON.stringify(line) + "\n";
  }

  #serializeToJsonLines(lines) {
    return lines.map(this.#stringifyLine).join("");
  }
}
