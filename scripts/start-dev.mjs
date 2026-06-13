import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MAX_ATTEMPTS = 3;

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(rootDir, "node_modules/next/dist/bin/next");

/**
 * @param {string} command
 * @param {string[]} args
 * @returns {Promise<number | null>}
 */
function runCommand(command, args) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      stdio: "inherit",
      env: process.env
    });

    child.on("exit", (code) => resolve(code));
  });
}

/**
 * @returns {Promise<{ code: number | null; ecanceled: boolean }>}
 */
function startNextDev() {
  return new Promise((resolve) => {
    let output = "";

    const child = spawn(process.execPath, [nextBin, "dev"], {
      cwd: rootDir,
      env: process.env,
      stdio: ["inherit", "pipe", "pipe"]
    });

    child.stdout?.on("data", (chunk) => {
      output += chunk.toString();
      process.stdout.write(chunk);
    });

    child.stderr?.on("data", (chunk) => {
      output += chunk.toString();
      process.stderr.write(chunk);
    });

    child.on("exit", (code) => {
      const ecanceled =
        output.includes("ECANCELED") ||
        output.includes("operation canceled, read");

      resolve({ code, ecanceled });
    });
  });
}

function clearNextCache() {
  fs.rmSync(path.join(rootDir, ".next"), { recursive: true, force: true });
}

const bundleCode = await runCommand(process.execPath, [
  path.join(rootDir, "scripts/bundle-legacy-html.mjs")
]);

if (bundleCode !== 0) {
  process.exit(bundleCode ?? 1);
}

const verifyCode = await runCommand(process.execPath, [
  path.join(rootDir, "scripts/verify-startup.mjs")
]);

if (verifyCode !== 0) {
  process.exit(verifyCode ?? 1);
}

for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
  const result = await startNextDev();

  if (result.code === 0) {
    process.exit(0);
  }

  if (result.ecanceled && attempt < MAX_ATTEMPTS) {
    console.warn(
      `[start-dev] ECANCELED during startup (attempt ${attempt}/${MAX_ATTEMPTS}). Clearing .next and retrying...`
    );
    clearNextCache();
    continue;
  }

  process.exit(result.code ?? 1);
}
