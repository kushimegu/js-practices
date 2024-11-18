import fs, { existsSync, writeFileSync } from "fs";

export class MemoFile {
  constructor(filePath) {
    this.filePath = filePath;
  }

  initializeFile() {
    if (
      !existsSync(this.filePath) ||
      fs.readFileSync(this.filePath, "utf8").trim() === ""
    ) {
      writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  readMemos() {
    return JSON.parse(fs.readFileSync(this.filePath, "utf8"));
  }

  writeStream() {
    return fs.createWriteStream(this.filePath, {flags: 'r+'});
  }

  writeMemos(memos) {
    const writeStream = this.writeStream()
    writeStream.write(JSON.stringify(memos, null, 2));
    writeStream.end();
  }

  saveMemos(memos) {
    fs.writeFileSync(this.filePath, JSON.stringify(memos, null, 2));
  }
}
