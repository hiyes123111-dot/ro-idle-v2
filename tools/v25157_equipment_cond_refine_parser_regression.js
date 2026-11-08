#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "js", "engine.js"), "utf8");

// Ensure the equipment condBonus parser uses a digit matcher, not a literal backslash+d.
const equipmentMarker = "const pm = /^per(\\d+)Refine_(.+)$/.exec(bk);";
const cardMarker = "const pm = /^per(\\d+)Refine_(.+)$/.exec(bk);";
const matches = [...src.matchAll(/const pm = \/\^per\((.*?)\)Refine_\(\.\+\)\$\/\.exec\(bk\);/g)];
if (matches.length < 2) throw new Error("expected equipment and card refine parsers");
if (matches[0][1] !== "\\d+") throw new Error(`equipment parser is not digit-based: ${matches[0][1]}`);
if (matches[1][1] !== "\\d+") throw new Error(`card parser is not digit-based: ${matches[1][1]}`);

const parsed = /^per(\d+)Refine_(.+)$/.exec("per3Refine_dex");
if (!parsed || parsed[1] !== "3" || parsed[2] !== "dex")
  throw new Error("perNRefine key example did not parse");
const notParsed = /^per(\\d+)Refine_(.+)$/.exec("per3Refine_dex");
if (notParsed) throw new Error("old over-escaped regex unexpectedly matches");

console.log("v2.5.157 equipment conditional refine parser regression: PASS");
