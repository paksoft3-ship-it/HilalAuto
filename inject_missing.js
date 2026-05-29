const fs = require('fs');

const tr = JSON.parse(fs.readFileSync('./src/messages/tr.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('./src/messages/en.json', 'utf8'));

if (!en.howItWorksPage) en.howItWorksPage = {};
if (!tr.howItWorksPage) tr.howItWorksPage = {};
en.howItWorksPage.step1Title = "Fill Out the Form";
en.howItWorksPage.step2Title = "Our Expert Calls You";
en.howItWorksPage.step3Title = "Pickup and Payment";
tr.howItWorksPage.step1Title = "Formu Doldurun";
tr.howItWorksPage.step2Title = "Uzmanımız Arasın";
tr.howItWorksPage.step3Title = "Teslim ve Ödeme";

if (!en.cityPage) en.cityPage = {};
if (!tr.cityPage) tr.cityPage = {};
en.cityPage.formTitle = "Quick Quote Form";
tr.cityPage.formTitle = "Hızlı Teklif Formu";

if (!en.form) en.form = {};
if (!tr.form) tr.form = {};
en.form.damage = "Damage Type";
tr.form.damage = "Hasar Türü";

fs.writeFileSync('./src/messages/tr.json', JSON.stringify(tr, null, 2));
fs.writeFileSync('./src/messages/en.json', JSON.stringify(en, null, 2));

console.log("Missing keys injected!");
