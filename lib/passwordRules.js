// lib/passwordRules.js — the ONE definition of the password rule.
//
// Rule: at least 8 characters, at least one letter, at least one number.
// Keep this in sync with the Supabase setting (Auth -> Policies ->
// Password requirements). The form uses this for live feedback; Supabase
// enforces it server-side so it can't be bypassed.

export const PASSWORD_MIN = 8;

// Each check returns true when SATISFIED.
export function passwordChecks(pw = "") {
  return {
    length: pw.length >= PASSWORD_MIN,
    letter: /[A-Za-z]/.test(pw),
    number: /[0-9]/.test(pw),
  };
}

export function passwordValid(pw = "") {
  const c = passwordChecks(pw);
  return c.length && c.letter && c.number;
}

// Arabic labels for each rule, for the live checklist under the field.
export const PASSWORD_RULE_LABELS = {
  length: `٨ أحرف على الأقل`,
  letter: `حرف واحد على الأقل`,
  number: `رقم واحد على الأقل`,
};
