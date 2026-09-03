import test from "node:test";
import assert from "node:assert/strict";

import { buildViewModel } from "./dashboard.js";

const member = {
  pointsThisMonth: 1_500,
  monthlyCap: 100_000,
  streakMonths: 6,
};

test("shows awarded points as a successful payment", () => {
  const view = buildViewModel(
    { pointsAwarded: 1_500, outcome: "AWARDED" },
    member,
  );

  assert.equal(view.title, "1,500 points credited");
  assert.equal(view.tone, "success");
  assert.equal(view.progressPercent, 1.5);
});

test("shows a duplicate event as skipped rather than credited", () => {
  const view = buildViewModel(
    { pointsAwarded: 0, outcome: "DUPLICATE" },
    member,
  );

  assert.equal(view.title, "Duplicate event skipped");
  assert.equal(view.tone, "neutral");
  assert.match(view.description, /already received/);
  assert.match(view.description, /No additional points were credited/);
});

test("shows when the member has reached the monthly cap", () => {
  const view = buildViewModel(
    { pointsAwarded: 0, outcome: "CAPPED" },
    { ...member, pointsThisMonth: 100_000 },
  );

  assert.equal(view.title, "Monthly cap reached");
  assert.equal(view.tone, "warning");
  assert.match(view.description, /No points were credited/);
  assert.match(view.description, /monthly points cap/);
  assert.equal(view.progressPercent, 100);
});

test("shows an award that fills the monthly cap as successful", () => {
  const view = buildViewModel(
    { pointsAwarded: 500, outcome: "AWARDED" },
    { ...member, pointsThisMonth: 100_000 },
  );

  assert.equal(view.title, "500 points credited");
  assert.equal(view.tone, "success");
  assert.equal(view.progressPercent, 100);
});
