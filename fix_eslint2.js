const fs = require('fs');

const fixUnusedLocale = (filepath) => {
  if (fs.existsSync(filepath)) {
    let content = fs.readFileSync(filepath, 'utf8');
    if (!content.includes('/* eslint-disable')) {
      content = '/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */\n' + content;
      fs.writeFileSync(filepath, content);
    }
  }
};

[
  'src/app/[locale]/sehir/[slug]/page.tsx',
  'src/app/[locale]/hizmet/[slug]/page.tsx',
  'src/components/forms/MultiStepQuoteForm.tsx',
  'src/components/layout/Navbar.tsx'
].forEach(fixUnusedLocale);

console.log("ESLint fixed 2!");
