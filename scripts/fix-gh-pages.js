const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const buildDir = path.join(__dirname, '../build');

// Fix main index.html at build root
const indexPath = path.join(buildDir, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Fix favicon path
html = html.replace('href="/favicon.ico"', 'href="/fabritor-web/favicon.ico"');

// Fix route config for GitHub Pages subpath deployment
html = html.replace(
  '"routePath":"/"',
  '"routePath":"/fabritor-web/"'
);
html = html.replace(
  '"/":{"pageConfig"',
  '"/fabritor-web/":{"pageConfig"'
);
html = html.replace(
  '["layout","/"]',
  '["layout","/fabritor-web/"]'
);
html = html.replace(
  '"matchedIds":["layout","/fabritor-web/"],"documentOnly":true,"renderMode":"CSR"}',
  '"matchedIds":["layout","/fabritor-web/"],"documentOnly":true,"renderMode":"CSR","basename":"/fabritor-web/"}'
);
html = html.replace(
  '<script>!(function () {',
  '<script>window.__ICE_BASE_BASE__="/fabritor-web/";</script><script>!(function () {'
);

fs.writeFileSync(indexPath, html, 'utf8');

// Fix route definitions in JS files
const jsFiles = fs.readdirSync(path.join(buildDir, 'js'))
  .filter(f => f.endsWith('.js'));

jsFiles.forEach(file => {
  const jsPath = path.join(buildDir, 'js', file);
  let jsCode = fs.readFileSync(jsPath, 'utf8');

  // Fix route path and IDs
  jsCode = jsCode
    .replace('path:"/"', 'path:"/fabritor-web/"')
    .replace('routeId:"/"', 'routeId:"/fabritor-web/"')
    .replace('id:"/"', 'id:"/fabritor-web/"')
    .replace('basename:"/"', 'basename:"/fabritor-web/"')
    .replace('basename:null', 'basename:"/fabritor-web/"');

  fs.writeFileSync(jsPath, jsCode, 'utf8');
});

// Fix framework.js default basename
const frameworkPath = path.join(buildDir, 'js/framework.js');
let frameworkCode = fs.readFileSync(frameworkPath, 'utf8');
frameworkCode = frameworkCode.replace(
  'e.basename||"/"',
  'e.basename||"/fabritor-web/"'
);
fs.writeFileSync(frameworkPath, frameworkCode, 'utf8');

// Check pre-rendered HTML files exist
const htmlFiles = ['api.html', 'json.html'];
htmlFiles.forEach(file => {
  const filePath = path.join(buildDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✓ HTML file ${file} found in build directory`);
  }
});

console.log('Fixed routes and basename for GitHub Pages deployment');
