const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('MessageCircle')) {
    // Add import if not present
    if (!content.includes("from 'react-icons/fa'") && !content.includes('from "react-icons/fa"')) {
      const lines = content.split('\n');
      const lastImportIndex = lines.map(l => l.trim().startsWith('import ')).lastIndexOf(true);
      lines.splice(lastImportIndex + 1, 0, "import { FaWhatsapp } from 'react-icons/fa';");
      content = lines.join('\n');
    }

    // Handle lucide-react import
    content = content.replace(/import\s+{\s*MessageCircle\s*}\s+from\s+["']lucide-react["'];?\n?/g, '');
    content = content.replace(/,\s*MessageCircle/g, '');
    content = content.replace(/MessageCircle\s*,/g, '');
    content = content.replace(/{\s*MessageCircle\s*}/g, '{}');

    // Replace component usage
    content = content.replace(/<MessageCircle/g, '<FaWhatsapp');
    content = content.replace(/icon:\s*MessageCircle/g, 'icon: FaWhatsapp');
    content = content.replace(/MessageCircle,/g, 'FaWhatsapp,'); // For arrays like in WhyChooseUs

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
