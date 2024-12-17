import crypto from "crypto";

export default class Memo {
  constructor(contents) {
    this.id = crypto.randomUUID();
    this.content = contents;
    this.title = contents[0];
  }
}
