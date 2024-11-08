import readline from "readline";
import Enquirer from "enquirer";
import { Memo } from "./memo_class.js";

export class MemoHandler {
  constructor(fileHandler) {
    this.fileHandler = fileHandler;
    this.fileHandler.createFile();
    this.memos = this.fileHandler.loadMemos();
  }

  createMemo() {
    const writeStream = this.fileHandler.writeStream();
    const rl = readline.createInterface({
      input: process.stdin,
      output: writeStream,
    });
    writeStream;
    const lines = [];
    rl.on("line", (line) => {
      lines.push(line);
    });
    rl.on("close", () => {
      const memo = new Memo(lines);
      this.memos.push(memo);
      writeStream.write(JSON.stringify(this.memos, null, 2));
      writeStream.end();
    });
  }

  listMemos() {
    const memoTitles = this.memos.map((memo) => memo.content[0]);
    memoTitles.forEach((memo) => console.log(memo));
  }

  async displayMemo(question) {
    const answer = await Enquirer.prompt(question);
    const selectedMemo = answer.memo;
    const memo = this.memos.find((memo) => memo.content[0] === selectedMemo);
    memo.content.forEach((line) => console.log(line));
  }

  async showMemo() {
    const memoTitles = this.memos.map((memo) => memo.content[0]);
    const question = {
      type: "select",
      name: "memo",
      message: "Choose a memo you want to see:",
      choices: memoTitles,
    };
    await this.displayMemo(question);
  }

  async updateMemos(question) {
    const answer = await Enquirer.prompt(question);
    const selectedMemo = answer.memo;
    const filteredMemos = this.memos.filter(
      (memo) => memo.content[0] !== selectedMemo,
    );
    this.fileHandler.saveMemos(filteredMemos)
  }

  async deleteMemo() {
    const memoTitles = this.memos.map((memo) => memo.content[0]);
    const question = {
      type: "select",
      name: "memo",
      message: "Choose a memo you want to delete:",
      choices: memoTitles,
    };
    await this.updateMemos(question);
  }
}
