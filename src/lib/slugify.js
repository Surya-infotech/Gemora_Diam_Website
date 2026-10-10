export function slugify(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugifyPolicy(name) {
  return slugify(name);
}
