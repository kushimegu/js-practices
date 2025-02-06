#!/usr/bin/env node

import MemoCommand from "./memo_command.js";

const command = new MemoCommand();
await command.execute();
