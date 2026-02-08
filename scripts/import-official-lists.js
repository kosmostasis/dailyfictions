/**
 * Parse CSV with quoted fields (may contain newlines) and output data/lists.json.
 * Usage: node scripts/import-official-lists.js [path/to/officialtoplists.csv]
 * Columns used: name, description, url. Ignored: favouritecount, dislikedcount, favorite, disliked, watchlist.
 */
const fs = require("fs");
const path = require("path");

function parseCsv(content) {
  const rows = [];
  let i = 0;
  if (content.startsWith("name,")) {
    i = content.indexOf("\n") + 1;
  }

  while (i < content.length) {
    const row = [];
    for (let col = 0; col < 8; col++) {
      if (content[i] === '"') {
        i++;
        let field = "";
        while (i < content.length) {
          if (content[i] === '"') {
            i++;
            if (content[i] === '"') {
              field += '"';
              i++;
            } else {
              break;
            }
          } else {
            field += content[i];
            i++;
          }
        }
        row.push(field);
        if (content[i] === ",") i++;
      } else {
        let field = "";
        while (i < content.length && content[i] !== "," && content[i] !== "\n" && content[i] !== "\r") {
          field += content[i];
          i++;
        }
        row.push(field.trim());
        if (content[i] === ",") i++;
      }
    }
    while (content[i] === "\n" || content[i] === "\r") i++;
    if (row.length >= 5 && row[0]) {
      rows.push(row);
    }
  }
  return rows;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/\.\.\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "list";
}

function main() {
  const csvPath = process.argv[2] || path.join(process.cwd(), "data", "officialtoplists.csv");
  const outPath = path.join(process.cwd(), "data", "lists.json");

  let content;
  try {
    content = fs.readFileSync(csvPath, "utf-8");
  } catch (e) {
    console.error("Could not read CSV:", csvPath, e.message);
    process.exit(1);
  }

  const rows = parseCsv(content);
  const lists = rows.map((row, index) => {
    const [name, description, _fc, _dc, url] = row;
    const baseSlug = slugify(name) || "list";
    const slug = baseSlug + (index > 0 ? "-" + index : "");
    return {
      id: slug,
      name: (name || "").trim(),
      slug,
      source: "icheckmovies",
      description: (description || "").trim(),
      sourceUrl: (url || "").trim() || undefined,
    };
  });

  const seen = new Set();
  lists.forEach((l) => {
    let s = l.slug;
    let n = 0;
    while (seen.has(s)) {
      s = l.slug + "-" + (++n);
    }
    seen.add(s);
    l.slug = s;
    l.id = s;
  });

  fs.writeFileSync(outPath, JSON.stringify(lists, null, 2), "utf-8");
  console.log("Wrote", lists.length, "lists to", outPath);
}

main();
