const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '../components');
const PAGE = path.join(__dirname, '../app/page.tsx');

function removeGlow(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove shadow-[0_XYZ_rgba(...)] and similar manual shadow specs which are usually neon glows
  content = content.replace(/shadow-\[0_.*?\]/g, 'shadow-sm');
  
  // Remove blur modifiers for elements used as background radiant glows
  // Note: look for `<div className="absolute... blur-[1` and remove the whole div to be safe.
  content = content.replace(/<div className="absolute.*?blur-\[1\d{2}px\].*?\/>/g, '');
  content = content.replace(/<div className="absolute.*?blur-2xl.*?\/>/g, '');
  
  // Also remove class blur-[1...] if it's attached to other things
  content = content.replace(/blur-\[1\d{2}px\]/g, '');

  fs.writeFileSync(filePath, content, 'utf8');
}

const files = fs.readdirSync(DIR).map(f => path.join(DIR, f)).filter(f => f.endsWith('.tsx'));
files.push(PAGE);

files.forEach(removeGlow);
console.log('Glows removed successfully.');
