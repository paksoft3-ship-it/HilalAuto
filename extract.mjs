import fs from 'fs';
import path from 'path';

const srcDir = './src/app/[locale]';
const trPath = './src/messages/tr.json';
const enPath = './src/messages/en.json';

const trJson = JSON.parse(fs.readFileSync(trPath, 'utf8'));
const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Deep merge helper
function setDeep(obj, pathArr, value) {
  let current = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    if (!current[pathArr[i]]) current[pathArr[i]] = {};
    current = current[pathArr[i]];
  }
  current[pathArr[pathArr.length - 1]] = value;
}

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
      filelist.push(dirFile);
    }
  });
  return filelist;
}

const files = walkSync(srcDir);
const regex = /namespace:\s*["']([^"']+)["']/g;
const tRegex = /t(?:Types)?\(\s*["']([^"']+)["']\s*,\s*\{\s*default:\s*(["'])(.*?)\2\s*\}\s*\)/g;
const tRegexTemplate = /t(?:Types)?\(\s*["']([^"']+)["']\s*,\s*\{\s*default:\s*`([^`]+)`\s*\}\s*\)/g;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Find namespace in file (very basic, assumes 1 or a few namespaces)
  // Actually, we added useTranslations("namespace") or getTranslations({ namespace: "ns" })
  let match;
  let namespaces = [];
  while ((match = regex.exec(content)) !== null) {
    namespaces.push(match[1]);
  }
  const nsRegex = /useTranslations\(\s*["']([^"']+)["']\s*\)/g;
  while ((match = nsRegex.exec(content)) !== null) {
    namespaces.push(match[1]);
  }
  
  // If no namespace found, default to 'common' or just skip if we know we defined them
  const defaultNs = namespaces.length > 0 ? namespaces[0] : 'common';
  
  // Extract t("key", { default: "value" })
  const processMatch = (m, key, val) => {
    // Attempt to guess namespace if multiple exist by looking at `t(` vs `tTypes(`
    // But since this is a quick script, let's just put it in defaultNs
    let ns = defaultNs;
    if (m[0].startsWith('tTypes')) ns = 'vehicleTypes';
    if (key.startsWith('seo') || namespaces.includes('seo') && file.includes('generateMetadata')) ns = 'seo';
    if (file.includes('page.tsx') && file.includes('arac-turleri') && !m[0].startsWith('tTypes')) {
      if (namespaces.includes('seo') && (key.includes('Title') || key.includes('Description') || key.includes('Suffix'))) ns = 'seo';
      else ns = 'vehicleTypesPage';
    }
    if (file.includes('page.tsx') && file.includes('sehir')) {
       if (namespaces.includes('seo') && (key.includes('Title') || key.includes('Description') || key.includes('Suffix'))) ns = 'seo';
       else if (!m[0].startsWith('tTypes')) ns = 'cityPage';
    }
    if (file.includes('page.tsx') && file.includes('hizmet')) {
       if (namespaces.includes('seo') && (key.includes('Title') || key.includes('Description') || key.includes('Suffix'))) ns = 'seo';
       else ns = 'servicePage';
    }
    if (file.includes('kvkk')) ns = 'kvkk';
    if (file.includes('gizlilik')) ns = 'privacy';
    if (file.includes('kullanim')) ns = 'terms';
    
    // Some manual overrides
    if (key === 'schemaTitle' || key === 'badge' || key === 'title' || key === 'subtitle' || key === 'ctaQuote' || key === 'ctaWhatsapp' || key === 'details' || key === 'citiesTitle' || key === 'citiesSubtitle') {
      if (file.includes('arac-turleri')) ns = 'vehicleTypesPage';
    }
    if (file.includes('blog/page.tsx')) ns = 'blogPage';
    if (file.includes('blog/[slug]/page.tsx')) ns = 'blogDetail';
    if (file.includes('satilik-araclar/page.tsx')) ns = 'marketplace';
    if (file.includes('satilik-araclar/[id]/page.tsx')) ns = 'marketplaceDetail';
    if (file.includes('not-found.tsx')) ns = 'notFound';
    if (file.includes('tesekkurler')) ns = 'thankYou';

    if (!trJson[ns]) trJson[ns] = {};
    if (!enJson[ns]) enJson[ns] = {};

    if (!trJson[ns][key]) {
      trJson[ns][key] = val;
    }
    // We put TR value in EN just as placeholder to not crash, and we will translate it next.
    if (!enJson[ns][key]) {
      enJson[ns][key] = val + " (EN)"; // Mark it for translation
    }
  };

  while ((match = tRegex.exec(content)) !== null) {
    processMatch(match, match[1], match[3]);
  }
  while ((match = tRegexTemplate.exec(content)) !== null) {
    processMatch(match, match[1], match[2]);
  }
});

fs.writeFileSync(trPath, JSON.stringify(trJson, null, 2));
fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
console.log('Extraction complete.');
