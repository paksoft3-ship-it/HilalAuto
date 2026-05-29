const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Replace import Link from "next/link"
    if (content.includes('import Link from "next/link"')) {
      content = content.replace(/import Link from "next\/link";?/g, 'import { Link } from "@/i18n/routing";');
      changed = true;
    }

    // 2. Replace import { useRouter, usePathname } from "next/navigation"
    // (Be careful: useParams and notFound are still from next/navigation)
    if (content.includes('next/navigation')) {
      if (content.match(/import\s*{[^}]*(useRouter|usePathname)[^}]*}\s*from\s*['"]next\/navigation['"]/)) {
        // We need to extract useRouter and usePathname and move them to @/i18n/routing
        const regex = /import\s*{([^}]+)}\s*from\s*['"]next\/navigation['"];?/g;
        content = content.replace(regex, (match, importsStr) => {
          const imports = importsStr.split(',').map(s => s.trim()).filter(Boolean);
          const nextIntlImports = [];
          const nextNavImports = [];
          
          imports.forEach(imp => {
            if (imp === 'useRouter' || imp === 'usePathname') {
              nextIntlImports.push(imp);
            } else {
              nextNavImports.push(imp);
            }
          });

          let newImports = '';
          if (nextNavImports.length > 0) {
            newImports += `import { ${nextNavImports.join(', ')} } from "next/navigation";\n`;
          }
          if (nextIntlImports.length > 0) {
            newImports += `import { ${nextIntlImports.join(', ')} } from "@/i18n/routing";\n`;
          }
          return newImports.trim();
        });
        changed = true;
      }
    }

    // 3. Remove locale arguments from routes
    const routeMethods = [
      'home', 'quote', 'howItWorks', 'about', 'vehicleTypes', 
      'contact', 'blog', 'blogPost', 'service', 'city', 
      'thankYou', 'kvkk', 'privacy', 'terms'
    ];
    
    routeMethods.forEach(method => {
      // Find `routes.method(locale)` or `routes.method(locale, arg)`
      // The regex finds `routes.method(locale)` and `routes.method(locale, xxx)`
      // Assuming 'locale' is the exact string passed in most places.
      const regex = new RegExp(`routes\\.${method}\\(\\s*locale\\s*(?:,\\s*([^)]+))?\\)`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, (match, arg2) => {
          if (arg2) {
            return `routes.${method}(${arg2})`;
          } else {
            return `routes.${method}()`;
          }
        });
        changed = true;
      }
    });

    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  }
});
