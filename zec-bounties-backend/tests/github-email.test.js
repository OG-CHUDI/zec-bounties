const test = require("node:test");
const assert = require("node:assert/strict");

const { selectVerifiedPrimaryEmail } = require("../helpers/githubEmail");

// The GitHub OAuth callback keys account creation/linking on this email, so it
// must be the account owner's VERIFIED primary — never an unverified address
// (which can belong to someone else → account takeover).

test("rejects an unverified primary email (the takeover case)", () => {
  const emails = [{ email: "victim@corp.com", primary: true, verified: false }];
  assert.equal(selectVerifiedPrimaryEmail(emails), null);
});

test("accepts a verified primary email", () => {
  const emails = [
    { email: "me@noise.com", primary: false, verified: true },
    { email: "me@corp.com", primary: true, verified: true },
  ];
  assert.equal(selectVerifiedPrimaryEmail(emails), "me@corp.com");
});

test("does not fall back to a verified NON-primary when the primary is unverified", () => {
  const emails = [
    { email: "victim@corp.com", primary: true, verified: false },
    { email: "attacker@evil.com", primary: false, verified: true },
  ];
  assert.equal(selectVerifiedPrimaryEmail(emails), null);
});

test("returns null when there is no primary", () => {
  assert.equal(
    selectVerifiedPrimaryEmail([{ email: "x@y.com", primary: false, verified: true }]),
    null,
  );
});

test("handles missing/invalid input", () => {
  assert.equal(selectVerifiedPrimaryEmail(undefined), null);
  assert.equal(selectVerifiedPrimaryEmail(null), null);
  assert.equal(selectVerifiedPrimaryEmail([]), null);
  assert.equal(selectVerifiedPrimaryEmail([{ primary: true, verified: true }]), null);
});
