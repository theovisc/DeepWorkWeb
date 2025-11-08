import { createCanvas } from "canvas";
import fs from "fs";
import { exec } from "child_process";

const size = 1024;
const padding = 80; // pour ne pas coller les bords

// Une seule police (Helvetica ou Arial)
const font = "Helvetica";

const canvas = createCanvas(size, size);
const ctx = canvas.getContext("2d");

// --- Dégradé violet premium ---
const gradient = ctx.createLinearGradient(0, 0, size, size);
gradient.addColorStop(0, "#b892ff"); // violet clair
gradient.addColorStop(0.5, "#9f6bff");
gradient.addColorStop(1, "#6a00ff"); // violet foncé

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, size, size);

// --- Ombre sous le texte ---
ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
ctx.shadowBlur = 40;
ctx.shadowOffsetY = 18;

// --- Texte Deep Work (2 lignes) ---
ctx.fillStyle = "white";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

// Taille du texte (équilibrée pour 1024px)
const fontSize = size * 0.28; // ~285px
ctx.font = `900 ${fontSize}px "${font}"`;

// Position des lignes
const centerY = size / 2;
const lineSpacing = fontSize * 0.6; // ajuste l'écart

// DEEP
ctx.fillText("DEEP", size / 2, centerY - lineSpacing);

// WORK
ctx.fillText("WORK", size / 2, centerY + lineSpacing);

// --- Sauvegarde ---
const filename = "./icon.png";
fs.writeFileSync(filename, canvas.toBuffer("image/png"));
console.log(`✅ Icône générée → ${filename}`);

// --- Ouvre automatiquement l'image (Windows uniquement) ---
exec(`start ${filename}`);
