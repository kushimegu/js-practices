import crypto from "crypto";

export default class Memo {
  constructor(content) {
    this.id = crypto.randomUUID();
    this.content = content;
    this.title = content[0]
  }
}
