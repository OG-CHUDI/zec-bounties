// GitHub's /user/emails returns objects like { email, primary, verified }.
// A GitHub account can carry an UNVERIFIED address that belongs to someone else,
// so using an email to create or (especially) LINK a local account is only safe
// when GitHub asserts the address is verified. Selecting the primary without
// checking `verified` — or falling back to the public profile email, which has
// no verification signal — is the OAuth account-takeover / pre-account-hijack
// anti-pattern.
//
// Returns the verified primary email address, or null if there is none.
//
// @param {Array<{email?: string, primary?: boolean, verified?: boolean}>} emails
// @returns {string|null}
function selectVerifiedPrimaryEmail(emails) {
  if (!Array.isArray(emails)) return null;
  const match = emails.find((e) => e && e.primary === true && e.verified === true);
  return typeof match?.email === "string" ? match.email : null;
}

module.exports = { selectVerifiedPrimaryEmail };
