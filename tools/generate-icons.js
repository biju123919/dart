'use strict';

const path = require('path');
const fs = require('fs');

const customIcons = 'src/assets/icons';
const icons = {};

const files = fs.readdirSync(customIcons);
files.forEach(file => {
  if (file.endsWith('.svg')) {
    const name = file.replace('.svg', '');
    let content = fs.readFileSync(path.join(customIcons, file), 'utf-8');
    content = content.replace('<svg ', `<svg class="ci ci-${name}" `);
    icons[name] = content;
  }
});

const OUTPUT = 'src/assets/icons/icons.json';
fs.writeFileSync(OUTPUT, JSON.stringify(icons, null, 2), { encoding: 'utf-8' });

console.log(`Generated file ${OUTPUT}`);