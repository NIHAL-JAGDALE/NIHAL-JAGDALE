import fs from "node:fs";

const COLS = 53;
const ROWS = 7;
const CELL = 14;
const GAP = 2;
const PAD = 18;
const TITLE_SPACE = 28;
const FILL_RATIO = 0.60; // 60% filled, always > 50%

const bgColor = "#0d1117";
const emptyColor = "#161b22";
const greenShades = ["#9be9a8", "#40c463", "#30a14e", "#216e39"];

const width = PAD * 2 + COLS * (CELL + GAP) - GAP;
const height = TITLE_SPACE + PAD + ROWS * (CELL + GAP) - GAP + PAD;

// Build all cell positions
const cells = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    cells.push({ r, c });
  }
}

// Shuffle cells randomly
for (let i = cells.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [cells[i], cells[j]] = [cells[j], cells[i]];
}

// Choose exactly 60% of cells to fill
const filledCount = Math.ceil(cells.length * FILL_RATIO);
const filledSet = new Set(
  cells.slice(0, filledCount).map(({ r, c }) => `${r}-${c}`)
);

function randomGreen() {
  return greenShades[Math.floor(Math.random() * greenShades.length)];
}

let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <text x="${PAD}" y="${22}" fill="#ffffff" font-size="16" font-family="Arial, sans-serif" font-weight="700">
    Pacman Contribution Graph
  </text>
`;

for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const x = PAD + c * (CELL + GAP);
    const y = TITLE_SPACE + PAD + r * (CELL + GAP);
    const key = `${r}-${c}`;
    const filled = filledSet.has(key);
    const fill = filled ? randomGreen() : emptyColor;

    svg += `
  <rect
    x="${x}"
    y="${y}"
    width="${CELL}"
    height="${CELL}"
    rx="4"
    fill="${fill}"
    opacity="${filled ? 1 : 0.95}"
  />`;
  }
}

svg += `
</svg>
`;

fs.writeFileSync("pacman-random.svg", svg);
console.log("Generated pacman-random.svg");