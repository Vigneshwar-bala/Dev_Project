const fs = require('fs');

const hexToRgb = hex => {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  let num = parseInt(c, 16);
  return `${num >> 16} ${(num >> 8) & 255} ${num & 255}`;
};

const light = {
  'tertiary': '#f3f4f6', 'inverse-primary': '#eff6ff', 'surface-bright': '#ffffff',
  'error': '#ef4444', 'surface-container': '#f9fafb', 'outline-variant': '#e5e7eb',
  'surface-container-low': '#ffffff', 'primary': '#2563eb', 'surface': '#ffffff',
  'primary-fixed': '#1d4ed8', 'surface-variant': '#f3f4f6', 'error-container': '#fee2e2',
  'surface-container-highest': '#e5e7eb', 'surface-container-high': '#f3f4f6',
  'on-surface-variant': '#6b7280', 'on-background': '#111827', 'background': '#f4f5f7',
  'surface-dim': '#ffffff', 'secondary': '#6b7280', 'surface-container-lowest': '#ffffff',
  'secondary-container': '#f3f4f6', 'outline': '#d1d5db', 'surface-tint': '#eff6ff',
  'primary-fixed-dim': '#3b82f6', 'primary-container': '#dbeafe', 'on-primary-container': '#1e3a8a',
  'on-surface': '#1f2937', 'on-primary': '#ffffff'
};

const dark = {
  'tertiary': '#f3f6ff', 'inverse-primary': '#006b5b', 'surface-bright': '#37393d',
  'error': '#ffb4ab', 'surface-container': '#1e2023', 'outline-variant': '#3a4a46',
  'surface-container-low': '#1a1c1f', 'primary': '#d7fff3', 'surface': '#111316',
  'primary-fixed': '#26fedc', 'surface-variant': '#333538', 'error-container': '#93000a',
  'surface-container-highest': '#333538', 'surface-container-high': '#282a2d',
  'on-surface-variant': '#b9cac4', 'on-background': '#e2e2e6', 'background': '#111316',
  'surface-dim': '#111316', 'secondary': '#ffb59c', 'surface-container-lowest': '#0c0e11',
  'secondary-container': '#8e2c01', 'outline': '#83948f', 'surface-tint': '#00dfc1',
  'primary-fixed-dim': '#00dfc1', 'primary-container': '#00f5d4', 'on-primary-container': '#006c5c',
  'on-surface': '#e2e2e6', 'on-primary': '#00382f'
};

let cssContent = fs.readFileSync('./src/index.css', 'utf8');

let rootVars = '';
let darkVars = '';
let twColorsMap = '';

for (let k in light) {
  rootVars += `  --c-${k}: ${hexToRgb(light[k])};\n`;
  darkVars += `  --c-${k}: ${hexToRgb(dark[k])};\n`;
  twColorsMap += `        '${k}': 'rgb(var(--c-${k}) / <alpha-value>)',\n`;
}

// Write TW Colors to file manually or dump them inline.
let twContent = fs.readFileSync('./tailwind.config.js', 'utf8');
twContent = twContent.replace(/colors:\s*\{[\s\S]*?\},/g, `colors: {\n${twColorsMap}      },`);
fs.writeFileSync('./tailwind.config.js', twContent);

// Append vars to index.css safely if they don't exist
if (!cssContent.includes('--c-primary')) {
  cssContent = cssContent + `\n\n:root {\n${rootVars}}\n\n.dark {\n${darkVars}}\n`;
  fs.writeFileSync('./src/index.css', cssContent);
}

console.log("Colors mapped successfully to CSS variables!");
