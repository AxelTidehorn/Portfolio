// Generates neutral, clearly labelled placeholder images in mixed aspect ratios.
// Replace them with original photography — see README "Adding photography".
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const files = {
  'src/assets/placeholders/hero.jpg': [3000, 2000, 'HERO PHOTOGRAPH'],
  'src/assets/placeholders/landscape-a.jpg': [2400, 1600, 'LANDSCAPE 3:2'],
  'src/assets/placeholders/landscape-b.jpg': [2400, 1350, 'LANDSCAPE 16:9'],
  'src/assets/placeholders/portrait-a.jpg': [1600, 2400, 'PORTRAIT 2:3'],
  'src/assets/placeholders/portrait-b.jpg': [1600, 2000, 'PORTRAIT 4:5'],
  'src/assets/placeholders/square.jpg': [2000, 2000, 'SQUARE 1:1'],
  'src/assets/placeholders/cad.jpg': [2400, 1500, 'CAD / DIAGRAM'],
  'src/assets/placeholders/screenshot.jpg': [2400, 1500, 'SCREENSHOT'],
};

for (const [path, [w, h, label]] of Object.entries(files)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="100%" height="100%" fill="#d9d5cc"/>
    <rect x="${w * 0.02}" y="${w * 0.02}" width="${w - w * 0.04}" height="${h - w * 0.04}" fill="none" stroke="#a8a398" stroke-width="${w / 600}"/>
    <line x1="0" y1="0" x2="${w}" y2="${h}" stroke="#bdb8ad" stroke-width="${w / 900}"/>
    <line x1="${w}" y1="0" x2="0" y2="${h}" stroke="#bdb8ad" stroke-width="${w / 900}"/>
    <text x="50%" y="50%" text-anchor="middle" font-family="monospace" font-size="${w / 32}" fill="#6e6a62">PLACEHOLDER — ${label}</text>
    <text x="50%" y="${h / 2 + w / 22}" text-anchor="middle" font-family="monospace" font-size="${w / 60}" fill="#8a857b">${w} × ${h}</text>
  </svg>`;
  await mkdir(dirname(path), { recursive: true });
  await sharp(Buffer.from(svg)).jpeg({ quality: 70 }).toFile(path);
  console.log('wrote', path);
}
