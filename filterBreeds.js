#!/usr/bin/env node
/**
 * filterBreeds.js
 * Node.js v18+ (uses built-in fetch)
 *
 * Usage:
 *   node filterBreeds.js            // defaults to letter "b"
 *   node filterBreeds.js m          // filters breeds starting with "m"
 */

const API_URL = "https://dog.ceo/api/breeds/list/all";

// Pretty-print a breed/sub-breed in Title Case (handles hyphens)
function titleCase(str) {
  return str
    .split("-")
    .map(s => (s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s))
    .join("-");
}

async function main() {
  const rawArg = process.argv[2];
  const letter = (rawArg?.[0] ?? "b").toLowerCase();

  if (!/^[a-z]$/.test(letter)) {
    console.error(
      `Error: expected a single letter A–Z (e.g., "node filterBreeds.js m"). Got: "${rawArg ?? ""}"`
    );
    process.exit(1);
  }

  // Simple timeout for fetch (10s)
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} when fetching ${API_URL}`);
    }

    const data = await res.json();
    if (data.status !== "success" || !data.message || typeof data.message !== "object") {
      throw new Error("Unexpected API shape.");
    }

    const breedsObj = data.message; // { breed: [subBreed, ...], ... }
    const collator = new Intl.Collator("en", { sensitivity: "base" });

    // Filter by starting letter and sort
    const matchedBreeds = Object.keys(breedsObj)
      .filter(breed => breed.startsWith(letter))
      .sort((a, b) => collator.compare(a, b));

    if (matchedBreeds.length === 0) {
      console.log(`No breeds found starting with "${letter}".`);
      return;
    }

    // Build formatted output lines
    const lines = [];
    matchedBreeds.forEach((breed, idx) => {
      const subs = Array.isArray(breedsObj[breed]) ? breedsObj[breed] : [];
      const prettyBreed = titleCase(breed);

      if (subs.length > 0) {
        const prettySubs = subs
          .slice()
          .sort((a, b) => collator.compare(a, b))
          .map(titleCase)
          .join(", ");
        lines.push(`${idx + 1}. ${prettyBreed} (sub-breeds: ${prettySubs})`);
      } else {
        lines.push(`${idx + 1}. ${prettyBreed}`);
      }
    });

    console.log(lines.join("\n"));
  } catch (err) {
    if (err.name === "AbortError") {
      console.error("Request timed out. Please try again.");
    } else {
      console.error(`Error: ${err.message}`);
    }
    process.exit(1);
  }
}

main();
