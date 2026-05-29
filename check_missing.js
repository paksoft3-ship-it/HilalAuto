const fs = require('fs');

const tr = JSON.parse(fs.readFileSync('./src/messages/tr.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('./src/messages/en.json', 'utf8'));

// manually add the missing ones for howItWorksPage
if (!en.howItWorksPage) en.howItWorksPage = {};
if (!tr.howItWorksPage) tr.howItWorksPage = {};

en.howItWorksPage.badge = "Process";
en.howItWorksPage.title = "Selling Your Damaged Vehicle is Now Much Easier";
en.howItWorksPage.subtitle = "We have minimized the complex processes. Fill out the form, get your offer, and receive your payment in cash on the same day.";

tr.howItWorksPage.badge = "Süreç";
tr.howItWorksPage.title = "Hasarlı Aracınızı Satmak Artık Çok Daha Kolay";
tr.howItWorksPage.subtitle = "Karmaşık süreçleri en aza indirdik. Formu doldurun, teklifinizi alın, aynı gün içinde ödemenizi nakit olarak alın.";

// Also check servicePage
if (!en.servicePage) en.servicePage = {};
if (!tr.servicePage) tr.servicePage = {};

en.servicePage.badge = "Service Details";
tr.servicePage.badge = "Hizmet Detayı";

en.servicePage.title = "Service Details";
tr.servicePage.title = "Hizmet Detayı";

en.servicePage.whatsappMessage = "Hello, I want to get information about your services.";
tr.servicePage.whatsappMessage = "Merhaba, hizmetleriniz hakkında bilgi almak istiyorum.";

fs.writeFileSync('./src/messages/tr.json', JSON.stringify(tr, null, 2));
fs.writeFileSync('./src/messages/en.json', JSON.stringify(en, null, 2));

console.log("Missing keys added!");
