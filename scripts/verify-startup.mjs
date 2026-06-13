import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

/** @type {{ label: string; path: string; kind?: "json" | "import" | "require" }[]} */
const checks = [
  { label: "next.config", path: "next.config.mjs", kind: "import" },
  { label: "legacyPageSources", path: "lib/legacyPageSources.js", kind: "import" },
  { label: "legacyPages", path: "lib/legacyPages.js" },
  {
    label: "next constants",
    path: "node_modules/next/dist/shared/lib/constants.js",
    kind: "require"
  },
  {
    label: "swc interop helper",
    path: "node_modules/@swc/helpers/cjs/_interop_require_default.cjs"
  },
  {
    label: "modern browserslist target",
    path: "node_modules/next/dist/shared/lib/modern-browserslist-target.js"
  },
  { label: "next package.json", path: "node_modules/next/package.json", kind: "json" },
  { label: "styled-jsx package.json", path: "node_modules/styled-jsx/package.json", kind: "json" },
  { label: "caniuse-lite package.json", path: "node_modules/caniuse-lite/package.json", kind: "json" }
];

let failed = false;

for (const check of checks) {
  const absolutePath = path.join(rootDir, check.path);

  try {
    const buffer = fs.readFileSync(absolutePath);
    const text = buffer.toString("utf8");

    if (text.includes("\u0000")) {
      throw new Error("file contains null bytes");
    }

    if (check.kind === "json") {
      JSON.parse(text);
    }

    if (check.kind === "import") {
      await import(pathToFileURL(absolutePath).href);
    }

    if (check.kind === "require") {
      require(absolutePath);
    }

    console.log(`[verify-startup] OK ${check.label} (${buffer.length} bytes)`);
  } catch (error) {
    failed = true;
    const message = error instanceof Error ? error.message : String(error);
    const code = error && typeof error === "object" && "code" in error ? error.code : "UNKNOWN";

    console.error(`[verify-startup] FAIL ${check.label}`);
    console.error(`  file: ${check.path}`);
    console.error(`  code: ${code}`);
    console.error(`  error: ${message}`);
  }
}

if (failed) {
  console.error(
    "\n[verify-startup] Startup preflight failed. Try:\n" +
      "  rm -rf .next node_modules/.cache\n" +
      "  npm ci\n" +
      "  npm run dev\n"
  );
  process.exit(1);
}
