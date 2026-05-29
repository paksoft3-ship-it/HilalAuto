import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        results = results.concat(walk(filePath));
      }
    } else {
      if (
        filePath.endsWith('.tsx') || 
        filePath.endsWith('.ts') || 
        filePath.endsWith('.json') || 
        filePath.endsWith('.md')
      ) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  content = content.replace(/HazarAl/g, 'Oto Grade');
  content = content.replace(/Hazaral/g, 'Oto Grade');
  content = content.replace(/hazaral\.com/g, 'otograde.com');
  content = content.replace(/@hazaral/g, '@otograde');
  content = content.replace(/hazaral/g, 'otograde'); // lowercase instances like route names, except we have to be careful about supabase tables?
  // Actually wait, supabase table is 'hazaral_leads'. Let's not replace lowercase 'hazaral' globally to avoid breaking 'hazaral_leads'.
  // I will revert the lowercase hazaral replacement and be specific.
  
  // Revert and do careful replacement
  content = original;
  content = content.replace(/HazarAl/g, 'Oto Grade');
  content = content.replace(/Hazaral/g, 'Oto Grade');
  content = content.replace(/hazaral\.com/g, 'otograde.com');
  content = content.replace(/@hazaral/g, '@otograde');
  content = content.replace(/"hazaral"/g, '"otograde"'); 
  content = content.replace(/Hazar\s*Al/g, 'Oto Grade'); // Handle "Hazar Al" if any

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', file);
  }
});
