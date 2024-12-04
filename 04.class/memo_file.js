import fs from "node:fs";

export default class MemoFile {
  #filePath

  constructor() {
    this.#filePath = "./memos.json";
  }

  async readMemos() {
    await this.#createFile();
    const fileContents = await fs.promises.readFile(this.#filePath, {
      encoding: "utf8",
    });
    return JSON.parse(fileContents);
  }

  writeStream() {
    return fs.createWriteStream(this.#filePath, { flags: "r+" });
  }

  writeMemos(memos) {
    return new Promise((resolve, reject) => {
      const writeStream = this.writeStream();
      writeStream.write(JSON.stringify(memos, null, 2));
      writeStream.end();
      writeStream.on("error", (error) => {
        reject(error);
      });
      writeStream.on("finish", () => {
        resolve();
      });
    });
  }

  async saveMemos(memos) {
    await fs.promises.writeFile(this.#filePath, JSON.stringify(memos, null, 2));
  }

  async #createFile() {
    try {
      await fs.promises.readFile(this.#filePath, {
        encoding: "utf8",
      });
    } catch (error) {
      if (error instanceof Error && error.code === "ENOENT") {
        await fs.promises.writeFile(this.#filePath, JSON.stringify([], null, 2));
      } else {
        throw error;
      }
    }
  }
}
