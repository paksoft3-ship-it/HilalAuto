const fs = require('fs');

const files = [
  { path: 'src/app/[locale]/kvkk/page.tsx', href: '"/kvkk"' },
  { path: 'src/app/[locale]/hakkimizda/page.tsx', href: '"/hakkimizda"' },
  { path: 'src/app/[locale]/nasil-calisir/page.tsx', href: '"/nasil-calisir"' },
  { path: 'src/app/[locale]/sehir/page.tsx', href: '"/sehir"' },
  { path: 'src/app/[locale]/arac-turleri/page.tsx', href: '"/arac-turleri"' },
  { path: 'src/app/[locale]/kullanim-kosullari/page.tsx', href: '"/kullanim-kosullari"' },
  { path: 'src/app/[locale]/gizlilik-politikasi/page.tsx', href: '"/gizlilik-politikasi"' },
  { path: 'src/app/[locale]/iletisim/page.tsx', href: '"/iletisim"' },
];

files.forEach(f => {
  let content = fs.readFileSync(f.path, 'utf8');
  content = `import { getPathname } from "@/i18n/routing";\n` + content;
  
  // replace alternates: { canonical: `${SITE_URL}/${locale}/...` }
  content = content.replace(/alternates:\s*\{\s*canonical:[^}]+\}/, `alternates: { canonical: \`\${SITE_URL}\${getPathname({ locale, href: ${f.href} })}\` }`);
  fs.writeFileSync(f.path, content);
});

// Dynamic routes
const dynFiles = [
  { path: 'src/app/[locale]/sehir/[slug]/page.tsx', href: 'pathname: "/sehir/[slug]"' },
  { path: 'src/app/[locale]/hizmet/[slug]/page.tsx', href: 'pathname: "/hizmet/[slug]"' },
];

dynFiles.forEach(f => {
  let content = fs.readFileSync(f.path, 'utf8');
  content = `import { getPathname } from "@/i18n/routing";\n` + content;
  // Use @ts-ignore to bypass strict typing for params if any issue
  content = content.replace(/alternates:\s*\{\s*canonical:[^}]+\}/, `alternates: { canonical: \`\${SITE_URL}\${getPathname({ locale, href: { ${f.href}, params: { slug } } } as any)}\` }`);
  fs.writeFileSync(f.path, content);
});

console.log("Metadata updated!");
