const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../build/index.html');
const html = fs.readFileSync(indexPath, 'utf8');

// Replace routePath from "/" to "/fabritor-web/"
let fixedHtml = html.replace(
  '"routePath":"/"',
  '"routePath":"/fabritor-web/"'
);

// Replace loaderData route key from "/" to "/fabritor-web/"
fixedHtml = fixedHtml.replace(
  '"/":{"pageConfig"',
  '"/fabritor-web/":{"pageConfig"'
);

// Replace matchedIds from ["/"] to ["/fabritor-web/"]
fixedHtml = fixedHtml.replace(
  '["layout","/"]',
  '["layout","/fabritor-web/"]'
);

fs.writeFileSync(indexPath, fixedHtml, 'utf8');
console.log('Fixed routePath, loaderData, and matchedIds for GitHub Pages deployment');
