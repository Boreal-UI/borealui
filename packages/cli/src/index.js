#!/usr/bin/env node
import { parseArgs } from "./utils/args.js";
import { initCommand } from "./commands/init.js";

// eslint-disable-next-line no-undef
const args = process.argv.slice(2);
const options = await parseArgs(args);

await initCommand(options);
