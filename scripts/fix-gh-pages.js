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

// Add basename to the app context in the inline script
fixedHtml = fixedHtml.replace(
  '"matchedIds":["layout","/fabritor-web/"],"documentOnly":true,"renderMode":"CSR"}',
  '"matchedIds":["layout","/fabritor-web/"],"documentOnly":true,"renderMode":"CSR","basename":"/fabritor-web/"}'
);

fs.writeFileSync(indexPath, fixedHtml, 'utf8');

// Also need to add basename config to framework.js
// Ice framework needs to know basename for routing
const frameworkPath = path.join(__dirname, '../build/js/framework.js');
let frameworkCode = fs.readFileSync(frameworkPath, 'utf8');

// Add basename configuration before =b;
frameworkCode = frameworkCode.replace(
  'window.__ICE_APP_CONTEXT__=b;',
  'b.basename="/fabritor-web/";window.__ICE_APP_CONTEXT__=b;'
);

fs.writeFileSync(frameworkPath, frameworkCode, 'utf8');

console.log('Fixed routePath, loaderData, matchedIds, and added basename for GitHub Pages deployment');
