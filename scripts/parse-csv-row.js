/**
 * Parse one CSV row that may contain quoted fields with newlines.
 * Returns array of field values or null if row is incomplete (multiline).
 */
function parseRow(line, buffer = "") {
  const full = buffer ? buffer + "\n" + line : line;
  const fields = [];
  let i = 0;
  let field = "";

  while (i < full.length) {
    if (full[i] === '"') {
      i++;
      while (i < full.length) {
        if (full[i] === '"') {
          i++;
          if (full[i] === '"') {
            field += '"';
            i++;
          } else {
            break;
          }
        } else {
          field += full[i];
          i++;
        }
      }
      fields.push(field);
      field = "";
      if (i < full.length && full[i] === ",") i++;
      continue;
    }
    // unquoted
    while (i < full.length && full[i] !== ",") {
      field += full[i];
      i++;
    }
    fields.push(field.trim());
    field = "";
    if (i < full.length) i++;
  }

  return fields;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/\.\.\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function main() {
  const fs = await import("fs");
  const path = await import("path");
  const csvPath = process.argv[2] || path.join(process.cwd(), "data", "officialtoplists.csv");
  const outPath = path.join(process.cwd(), "data", "lists.json");

  let content;
  try {
    content = fs.readFileSync(csvPath, "utf-8");
  } catch (e) {
    console.error("Could not read CSV:", csvPath, e.message);
    process.exit(1);
  }

  const lines = content.split(/\r?\n/);
  const header = lines[0];
  if (!header.startsWith("name,")) {
    console.error("Unexpected CSV header:", header.slice(0, 50));
    process.exit(1);
  }

  const lists = [];
  let buffer = "";
  for (let i = 1; i < lines.length; i++) {
    const row = parseRow(lines[i], buffer);
    if (row.length < 5) {
      buffer = buffer ? buffer + "\n" + lines[i] : lines[i];
      continue;
    }
    buffer = "";
    const [name, description, _fc, _dc, url] = row;
    if (!name || !name.trim()) continue;
    const slug = slugify(name) || "list-" + lists.length;
    lists.push({
      id: slug,
      name: name.replace(/^"|"$/g, "").trim(),
      slug,
      source: "icheckmovies",
      description: (description || "").replace(/^"|"$/g, "").trim(),
      sourceUrl: (url || "").trim() || undefined,
    });
  }

  fs.writeFileSync(outPath, JSON.stringify(lists, null, 2), "utf-8");
  console.log("Wrote", lists.length, "lists to", outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
