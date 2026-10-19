const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeTitle } = require("./index.js");

test("trims leading/trailing spaces and collapses repeated spaces", () => {
  assert.equal(normalizeTitle("  npm   workspaces  "), "npm workspaces");
});