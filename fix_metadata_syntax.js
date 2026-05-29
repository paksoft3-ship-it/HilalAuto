const fs = require('fs');

const files = [
  'src/app/[locale]/kvkk/page.tsx',
  'src/app/[locale]/hakkimizda/page.tsx',
  'src/app/[locale]/nasil-calisir/page.tsx',
  'src/app/[locale]/sehir/page.tsx',
  'src/app/[locale]/arac-turleri/page.tsx',
  'src/app/[locale]/kullanim-kosullari/page.tsx',
  'src/app/[locale]/gizlilik-politikasi/page.tsx',
  'src/app/[locale]/iletisim/page.tsx',
  'src/app/[locale]/sehir/[slug]/page.tsx',
  'src/app/[locale]/hizmet/[slug]/page.tsx',
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    // We have lines like: alternates: { canonical: `${SITE_URL}${getPathname({ locale, href: "/arac-turleri" })}` }/${locale}/arac-turleri` },
    // We want to remove everything from }/ to `, },
    
    // Regex to fix the corrupted lines:
    content = content.replace(/\}`\s*\}\/\$\{locale\}[^\`]*\`\s*\},/g, '}` },');
    
    fs.writeFileSync(f, content);
  }
});

console.log("Syntax fixed!");
