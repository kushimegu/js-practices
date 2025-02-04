import fs from "node:fs";

export default class MemoFile {
  #filePath;

  constructor() {
    this.#filePath = "./memos.jsonl";
  }

  async readMemos() {
    await this.#ensureFileExistence();
    const jsonlMemos = await fs.promises.readFile(this.#filePath, {
      encoding: "utf8",
    });
    const lines = jsonlMemos.split("\n").filter((line) => line !== "");
    const memos = this.#deserializeJsonLines(lines);
    return memos;
  }

  async deleteMemo(memo) {
    const memos = await this.readMemos();
    const filteredMemos = memos.filter((eachMemo) => eachMemo.id !== memo.id);
    const memoLines = this.#serializeToJsonLines(filteredMemos);
    await fs.promises.writeFile(this.#filePath, memoLines);
  }

  async appendMemo(memo) {
    await fs.promises.appendFile(
      this.#filePath,
      this.#serializeToJsonLines([memo]),
    );
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

  #serializeToJsonLines(lines) {
    return lines.map((line) => JSON.stringify(line)).join("\n");
  }
}
