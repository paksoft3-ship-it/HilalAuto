const fs = require('fs');

const tr = JSON.parse(fs.readFileSync('./src/messages/tr.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('./src/messages/en.json', 'utf8'));

const keyMap = {
  about: [
    'stat1', 'stat2', 'stat3Val', 'stat3', 'stat4',
    'val1Title', 'val1Desc', 'val2Title', 'val2Desc', 'val3Title', 'val3Desc', 'val4Title', 'val4Desc',
    'buy1', 'buy2', 'buy3', 'buy4', 'buy5', 'buy6', 'buy7', 'buy8',
    'badge', 'title', 'subtitle', 'ctaQuote', 'ctaWhatsapp',
    'storyTitle', 'storyP1', 'storyP2', 'valuesTitle', 'valuesSubtitle', 'buyTitle', 'buySubtitle'
  ],
  servicePage: [
    'step1Title', 'step2Title', 'step3Title', 'formTitle', 'problemsTitle', 'howTitle', 'faqTitle', 'relatedTitle'
  ],
  contact: [
    'contactTitle', 'contactDescription', 'phoneCta', 'whatsappCta', 'whatsappSub'
  ],
  cityPage: [
    'citiesAria', 'citiesTitle', 'citiesSub', 'heroTitle', 'districtsTitle', 'typesTitle', 'nearbyTitle', 'quoteTitle', 'quoteDescription', 
    'trust1', 'trust2', 'trust3', 'side1Title', 'side1Desc', 'side2Title', 'side2Desc', 'side3Title', 'side3Desc', 'side4Title', 'side4Desc', 
    'featuresAria', 'whyAria', 'whyTitle', 'directContact', 'whatsappAria', 'whatsapp', 'cityTitleSuffix'
  ],
  howItWorksPage: [
    'howItWorksTitle', 'howItWorksDescription', 'step1Desc', 'step1Time', 'step2Desc', 'step2Time', 'step3Desc', 'step3Time', 
    'step4Title', 'step4Desc', 'step4Time', 'step5Title', 'step5Desc', 'step5Time', 'step6Title', 'step6Desc', 'step6Time', 
    'req1', 'req2', 'req3', 'req4', 'req5', 'req6', 'trust1Title', 'trust1Desc', 'trust2Title', 'trust2Desc', 'trust3Title', 'trust3Desc', 'trust4Title', 'trust4Desc', 
    'stepsTitle', 'stepsSubtitle', 'stepsAria', 'reqTitle', 'reqSubtitle', 'trustTitle', 'trustSubtitle'
  ]
};

function reorganize(jsonObj) {
  for (const [namespace, keys] of Object.entries(keyMap)) {
    if (!jsonObj[namespace]) jsonObj[namespace] = {};
    for (const key of keys) {
      if (jsonObj.seo[key] !== undefined) {
        jsonObj[namespace][key] = jsonObj.seo[key];
        delete jsonObj.seo[key];
      }
    }
  }
}

reorganize(tr);
reorganize(en);

fs.writeFileSync('./src/messages/tr.json', JSON.stringify(tr, null, 2));
fs.writeFileSync('./src/messages/en.json', JSON.stringify(en, null, 2));

console.log("Namespaces reorganized successfully!");
