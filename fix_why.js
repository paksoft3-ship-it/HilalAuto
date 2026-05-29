const fs = require('fs');

const tr = JSON.parse(fs.readFileSync('./src/messages/tr.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('./src/messages/en.json', 'utf8'));

// Copy items from whyUs to whyChooseUs
const keysToCopy = [
  'item1Title', 'item1Desc',
  'item2Title', 'item2Desc',
  'item3Title', 'item3Desc',
  'item4Title', 'item4Desc'
];

keysToCopy.forEach(key => {
  if (tr.whyUs && tr.whyUs[key]) {
    tr.whyChooseUs[key] = tr.whyUs[key];
  }
  if (en.whyUs && en.whyUs[key]) {
    en.whyChooseUs[key] = en.whyUs[key];
  }
});

fs.writeFileSync('./src/messages/tr.json', JSON.stringify(tr, null, 2));
fs.writeFileSync('./src/messages/en.json', JSON.stringify(en, null, 2));

console.log("whyChooseUs fixed!");
