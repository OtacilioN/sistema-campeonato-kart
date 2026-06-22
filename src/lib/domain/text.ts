export function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\.\.\./g, "...")
    .replace(/[^\p{L}\p{N}. ]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function namesMatch(expected: string, extracted: string) {
  const expectedName = normalizeName(expected);
  const extractedName = normalizeName(extracted);

  if (!expectedName || !extractedName) {
    return false;
  }

  if (extractedName.includes("...")) {
    const prefix = extractedName.split("...")[0]?.trim() ?? "";
    return prefix.length > 0 && expectedName.startsWith(prefix);
  }

  if (expectedName.includes("...")) {
    const prefix = expectedName.split("...")[0]?.trim() ?? "";
    return prefix.length > 0 && extractedName.startsWith(prefix);
  }

  return expectedName === extractedName;
}

export function slugify(value: string) {
  return normalizeName(value)
    .replace(/\.\.\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function pilotSlug(fullName: string) {
  return slugify(fullName);
}
