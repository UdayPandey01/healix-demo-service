import test from "node:test";
import assert from "node:assert/strict";
import { verifyToken, hasRole } from "../src/auth.js";
import { findUser } from "../src/data.js";

test("a malformed token is rejected", () => {
  assert.equal(verifyToken("garbage"), false);
  assert.equal(verifyToken(""), false);
});

test("a fresh token for a real user is accepted", () => {
  const now = Date.now();
  assert.equal(verifyToken(`1.${now}`, now), true);
});

test("a session is still valid after ten minutes", () => {
  const issued = Date.now();
  const tenMinutesLater = issued + 10 * 60 * 1000;
  assert.equal(verifyToken(`1.${issued}`, tenMinutesLater), true);
});

test("a session is rejected after two hours", () => {
  const issued = Date.now();
  const twoHoursLater = issued + 2 * 60 * 60 * 1000;
  assert.equal(verifyToken(`1.${issued}`, twoHoursLater), false);
});

test("a role is not matched as a substring of another role", () => {
  const edsger = findUser(4);
  assert.equal(hasRole(edsger, "admin"), false);
});

test("a real role still matches", () => {
  assert.equal(hasRole(findUser(1), "admin"), true);
});
