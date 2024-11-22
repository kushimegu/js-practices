#!/usr/bin/env node

import { Command } from "./command.js";

const command = new Command();
await command.execute();
