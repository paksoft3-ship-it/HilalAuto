const fs = require('fs');

const tr = JSON.parse(fs.readFileSync('./src/messages/tr.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('./src/messages/en.json', 'utf8'));

if (!en.darkCta) en.darkCta = {};
if (!tr.darkCta) tr.darkCta = {};

en.darkCta = {
    badge: "Free Quote",
    title: "Ready to Sell Your Vehicle?",
    subtitle: "Fill out the short form and our expert team will get back to you as soon as possible. Getting a quote is completely free and non-binding.",
    bullet1: "Free and non-binding",
    bullet2: "Response within 1 hour",
    bullet3: "Doorstep pickup support",
    bullet4: "Help with paperwork",
    whatsappMessage: "Hello, I would like to get a quote for my damaged vehicle.",
    whatsapp: "Message on WhatsApp",
    formTitle: "Quick Quote Form",
    formSub: "Non-binding · Fast response"
};

tr.darkCta = {
    badge: "Ücretsiz Teklif",
    title: "Aracınızı Satmaya Hazır mısınız?",
    subtitle: "Kısa formu doldurun, uzman ekibimiz en kısa sürede size dönüş yapsın. Teklif almak tamamen ücretsiz ve bağlayıcı değil.",
    bullet1: "Ücretsiz ve bağlayıcı değil",
    bullet2: "1 saat içinde geri dönüş",
    bullet3: "Yerinden alım desteği",
    bullet4: "Evrak işlemlerinde yardım",
    whatsappMessage: "Merhaba, hasarlı aracım için teklif almak istiyorum.",
    whatsapp: "WhatsApp ile Yaz",
    formTitle: "Hızlı Teklif Formu",
    formSub: "Bağlayıcı değil · Hızlı dönüş"
};

fs.writeFileSync('./src/messages/tr.json', JSON.stringify(tr, null, 2));
fs.writeFileSync('./src/messages/en.json', JSON.stringify(en, null, 2));

console.log("darkCta injected!");
