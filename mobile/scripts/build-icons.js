#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
// Renders the Argus brand mark to the three PNGs Expo expects.
// Run after the brand changes: `npm run icons` from mobile/.
//
// `sharp` is intentionally NOT a devDependency — its postinstall step
// fails on EAS's macOS build runners (it tries to compile from source
// when the prebuilt binary download misses), which broke production
// builds. The npm script installs it transiently with --no-save so
// nothing lingers in package.json or the lockfile.

const sharp = require("sharp");
const path = require("node:path");

const ASSETS = path.join(__dirname, "..", "assets");

// Same brand mark used in the web sidebar and login screen.
const iconSvg = `<svg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'>
  <rect width='128' height='128' rx='28' ry='28' fill='#4A7A67'/>
  <rect x='30' y='30' width='68' height='68' rx='14' ry='14' fill='#F2EBDD'/>
  <rect x='62' y='42' width='4' height='14' rx='2' fill='#4A7A67'/>
  <rect x='62' y='72' width='4' height='14' rx='2' fill='#4A7A67'/>
  <circle cx='64' cy='64' r='6' fill='#4A7A67'/>
</svg>`;

// Adaptive icon foreground sits on a 432×432 canvas; Android applies
// the launcher's mask (squircle, circle, etc.) and a colored background
// from app.json. Keeps the cream square + aperture marks within the
// 66% safe zone so the mask never clips them.
const adaptiveSvg = `<svg viewBox='0 0 432 432' xmlns='http://www.w3.org/2000/svg'>
  <rect x='80' y='80' width='272' height='272' rx='60' ry='60' fill='#F2EBDD'/>
  <rect x='208' y='128' width='16' height='56' rx='8' fill='#4A7A67'/>
  <rect x='208' y='248' width='16' height='56' rx='8' fill='#4A7A67'/>
  <circle cx='216' cy='216' r='24' fill='#4A7A67'/>
</svg>`;

// Splash: 1284×2778 covers iPhone Pro Max; Expo scales it to other
// devices via resizeMode: contain.
const splashSvg = `<svg viewBox='0 0 1284 2778' xmlns='http://www.w3.org/2000/svg'>
  <rect width='1284' height='2778' fill='#F2EBDD'/>
  <g transform='translate(514, 1259)'>
    <rect width='256' height='256' rx='56' ry='56' fill='#4A7A67'/>
    <rect x='60' y='60' width='136' height='136' rx='28' ry='28' fill='#F2EBDD'/>
    <rect x='124' y='84' width='8' height='28' rx='4' fill='#4A7A67'/>
    <rect x='124' y='144' width='8' height='28' rx='4' fill='#4A7A67'/>
    <circle cx='128' cy='128' r='12' fill='#4A7A67'/>
  </g>
</svg>`;

(async () => {
  await sharp(Buffer.from(iconSvg)).resize(1024, 1024).png().toFile(path.join(ASSETS, "icon.png"));
  await sharp(Buffer.from(adaptiveSvg)).resize(1024, 1024).png().toFile(path.join(ASSETS, "adaptive-icon.png"));
  await sharp(Buffer.from(splashSvg)).resize(1284, 2778).png().toFile(path.join(ASSETS, "splash.png"));
  console.log("icon.png, adaptive-icon.png, splash.png written to mobile/assets/");
})();
