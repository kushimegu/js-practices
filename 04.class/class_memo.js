import crypto from "crypto";

export default class Memo {
  constructor(contents) {
    this.id = crypto.randomUUID();
    this.contents = contents;
  }
}
