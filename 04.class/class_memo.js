import crypto from "crypto";

export class Memo {
  constructor(content) {
    this.id = crypto.randomUUID();
    this.content = content;
  }
}
