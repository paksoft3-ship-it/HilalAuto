import fs from 'fs';
import path from 'path';

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  for (const { from, to } of replacements) {
    // using split join to replace all occurrences
    content = content.split(from).join(to);
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

// 1. Update align="center" in app directories
const appPages = [
  'src/app/[locale]/hakkimizda/page.tsx',
  'src/app/[locale]/arac-turleri/page.tsx',
  'src/app/[locale]/nasil-calisir/page.tsx',
  'src/app/[locale]/sehir/[slug]/page.tsx',
  'src/app/[locale]/hizmet/[slug]/page.tsx',
];

for (const file of appPages) {
  replaceInFile(file, [
    { from: 'align="center"', to: 'align="left"' }
  ]);
}

// 2. Update sections
replaceInFile('src/components/sections/TrustBar.tsx', [
  { from: 'items-center text-center', to: 'items-start text-left' }
]);

replaceInFile('src/components/sections/FAQSection.tsx', [
  { from: 'text-center md:text-left', to: 'text-left' },
  { from: 'align="center"', to: 'align="left"' }
]);

replaceInFile('src/components/sections/HowItWorks.tsx', [
  { from: 'text-center relative z-10', to: 'text-left relative z-10' },
  { from: 'items-center text-center', to: 'items-start text-left' }, // Just in case
  { from: 'text-center sm:text-left', to: 'text-left' },
  { from: 'align="center"', to: 'align="left"' }
]);

replaceInFile('src/components/sections/WhyChooseUs.tsx', [
  { from: 'text-center md:text-left flex flex-col items-center md:items-start', to: 'text-left flex flex-col items-start' },
  { from: 'text-center md:text-left', to: 'text-left' },
  { from: 'flex flex-col items-center text-center border-y md:border-y-0 md:border-x', to: 'flex flex-col items-start text-left border-y md:border-y-0 md:border-x' },
  { from: 'flex flex-col items-center text-center', to: 'flex flex-col items-start text-left' },
  { from: 'align="center"', to: 'align="left"' }
]);

replaceInFile('src/components/sections/FinalCTA.tsx', [
  { from: 'items-center text-center', to: 'items-start text-left' },
  { from: 'align="center"', to: 'align="left"' }
]);

replaceInFile('src/components/sections/VehicleTypeCards.tsx', [
  { from: 'align="center"', to: 'align="left"' }
]);

replaceInFile('src/components/sections/SocialProof.tsx', [
  { from: 'align="center"', to: 'align="left"' }
]);

replaceInFile('src/app/[locale]/sehir/page.tsx', [
  { from: 'align="center"', to: 'align="left"' }
]);

console.log("Done");
