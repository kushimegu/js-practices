import fs, { existsSync, writeFileSync } from "fs";

export class FileHandler {
  constructor(filePath) {
    this.filePath = filePath;
  }

  createFile() {
    if (!existsSync(this.filePath) || fs.readFileSync(this.filePath, "utf8") === "") {
      writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  loadMemos() {
    return JSON.parse(fs.readFileSync(this.filePath));
  }

  writeStream(){
    return fs.createWriteStream(this.filePath);
  }

  saveMemos(memos){
    return fs.writeFileSync(this.filePath, JSON.stringify(memos, null, 2))
  }
}
