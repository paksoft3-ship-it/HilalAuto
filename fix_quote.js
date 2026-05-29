const fs = require('fs');

const tr = JSON.parse(fs.readFileSync('./src/messages/tr.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('./src/messages/en.json', 'utf8'));

// Keys that were wrongly placed in cityPage but belong to quote:
const quoteKeys = [
    'trust1', 'trust2', 'trust3', 'side1Title', 'side1Desc', 'side2Title', 'side2Desc', 
    'side3Title', 'side3Desc', 'side4Title', 'side4Desc', 'featuresAria', 'whyAria', 
    'whyTitle', 'directContact', 'whatsappAria', 'whatsapp'
];

if (!tr.quote) tr.quote = {};
if (!en.quote) en.quote = {};

for (const key of quoteKeys) {
    if (tr.cityPage && tr.cityPage[key] !== undefined) {
        tr.quote[key] = tr.cityPage[key];
        delete tr.cityPage[key];
    }
    if (en.cityPage && en.cityPage[key] !== undefined) {
        en.quote[key] = en.cityPage[key];
        delete en.cityPage[key];
    }
}

// Add the missing keys for quote
const quoteMissingEn = {
    badge: "Free and non-binding quote",
    title: "Get a quick quote for your damaged vehicle",
    subtitle: "Let us know the condition of your vehicle by completing a few simple steps. Our expert team will offer you the best price quote as soon as possible."
};
const quoteMissingTr = {
    badge: "Ücretsiz ve bağlayıcı olmayan teklif",
    title: "Hasarlı aracınız için hızlı teklif alın",
    subtitle: "Birkaç basit adımı tamamlayarak aracınızın durumunu bize iletin. Uzman ekibimiz en kısa sürede size en iyi fiyat teklifini sunacaktır."
};

Object.assign(en.quote, quoteMissingEn);
Object.assign(tr.quote, quoteMissingTr);

// Write back
fs.writeFileSync('./src/messages/tr.json', JSON.stringify(tr, null, 2));
fs.writeFileSync('./src/messages/en.json', JSON.stringify(en, null, 2));

console.log("quote namespace fixed!");
