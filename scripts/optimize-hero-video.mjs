import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = path.join(rootDir, "public/assets");
const ffmpegPath = path.join(rootDir, "node_modules/ffmpeg-static/ffmpeg");

const sourceVideo = path.join(assetsDir, "hero-video-source-4k.mp4");
const fallbackSource = path.join(assetsDir, "hero-video.mp4");
const inputVideo = fs.existsSync(sourceVideo) ? sourceVideo : fallbackSource;
const posterPath = path.join(assetsDir, "hero-poster.webp");
const mp4Path = path.join(assetsDir, "hero-video.mp4");
const webmPath = path.join(assetsDir, "hero-video.webm");
const tempMp4Path = path.join(assetsDir, "hero-video-optimized.mp4");

if (!fs.existsSync(ffmpegPath)) {
  console.error("ffmpeg-static is not installed. Run: npm install");
  process.exit(1);
}

if (!fs.existsSync(inputVideo)) {
  console.error(`Source video not found: ${inputVideo}`);
  process.exit(1);
}

function runFfmpeg(args) {
  const result = spawnSync(ffmpegPath, ["-hide_banner", ...args], { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("Generating hero poster...");
runFfmpeg([
  "-y",
  "-ss",
  "00:00:00",
  "-i",
  inputVideo,
  "-vframes",
  "1",
  "-vf",
  "scale=1920:-2",
  "-c:v",
  "libwebp",
  "-quality",
  "82",
  posterPath
]);

console.log("Optimizing hero MP4...");
runFfmpeg([
  "-y",
  "-i",
  inputVideo,
  "-vf",
  "scale=1280:-2",
  "-an",
  "-c:v",
  "libx264",
  "-crf",
  "28",
  "-preset",
  "medium",
  "-movflags",
  "+faststart",
  tempMp4Path
]);

console.log("Generating hero WebM...");
runFfmpeg([
  "-y",
  "-i",
  inputVideo,
  "-vf",
  "scale=1280:-2",
  "-an",
  "-c:v",
  "libvpx-vp9",
  "-crf",
  "35",
  "-b:v",
  "0",
  "-row-mt",
  "1",
  webmPath
]);

fs.renameSync(tempMp4Path, mp4Path);

for (const filePath of [posterPath, mp4Path, webmPath]) {
  const { size } = fs.statSync(filePath);
  console.log(`${path.basename(filePath)}: ${(size / 1024 / 1024).toFixed(2)} MB`);
}

console.log("Hero video assets optimized.");
