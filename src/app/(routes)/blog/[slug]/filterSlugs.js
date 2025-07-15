const fs = require('fs');
const path = require('path');

const slugsPath = path.join(__dirname, 'allslugslist.json');

// Read and parse the JSON file
const fileContent = fs.readFileSync(slugsPath, 'utf-8');
const json = JSON.parse(fileContent);

// Ensure the data is in the expected format
if (!json || !Array.isArray(json.data)) {
  throw new Error('Invalid JSON format: expected an object with a "data" array');
}

const originalSlugs = json.data;
const filteredSlugs = originalSlugs.filter(slug => slug.length <= 240);
const removed = originalSlugs.length - filteredSlugs.length;

// Write back the filtered slugs in the same format
const newJson = { ...json, data: filteredSlugs };
fs.writeFileSync(slugsPath, JSON.stringify(newJson, null, 2));

console.log(`Removed ${removed} slugs with length > 240.`);
console.log(`New total slugs: ${filteredSlugs.length}`);