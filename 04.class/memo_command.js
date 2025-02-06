import MemoHandler from "./memo_handler.js";

export default class MemoCommand {
  #memoHandler;
  #argv;

  constructor() {
    this.#memoHandler = new MemoHandler();
    this.#argv = process.argv.slice(2);
  }

  async execute() {
    try {
      this.#checkOption();
      if (this.#argv.includes("-l")) {
        await this.#memoHandler.listMemos();
      } else if (this.#argv.includes("-r")) {
        await this.#memoHandler.showMemo();
      } else if (this.#argv.includes("-d")) {
        await this.#memoHandler.deleteMemo();
      } else {
        await this.#memoHandler.createMemo();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        process.exit(1);
      } else {
        throw error;
      }
    }
  }

  #checkOption() {
    const validOptions = ["-l", "-r", "-d"];
    if (this.#argv.length === 0) {
      return;
    }
    if (this.#argv.length === 1 && validOptions.includes(this.#argv[0])) {
      return;
    }
    throw new Error("l、r、dからオプションを一つだけ指定してください。");
  }
}
