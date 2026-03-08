const fs = require('fs');
const path = require('path');
const { unified } = require('unified');
const remarkParse = require('remark-parse');
const remarkRehype = require('remark-rehype').default;
const rehypeStringify = require('rehype-stringify').default;
const rehypeSanitize = require('rehype-sanitize').default;

const publicDir = path.join(__dirname, '../public');
const buildDir = path.join(__dirname, '../build');

// List of markdown files to pre-render
const markdownFiles = [
  { source: 'api.md', output: 'api.html' },
  { source: 'json.md', output: 'json.html' }
];

async function preRenderMarkdown() {
  console.log('Pre-rendering Markdown files to HTML...');

  // Ensure build directory exists
  if (!fs.existsSync(buildDir)) {
    console.log('Build directory does not exist. Please run "ice build" first.');
    process.exit(1);
  }

  // Create processor
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSanitize)
    .use(rehypeStringify, { allowDangerousHtml: true });

  for (const { source, output } of markdownFiles) {
    const sourcePath = path.join(publicDir, source);
    const outputPath = path.join(buildDir, output);

    try {
      // Read markdown file
      const markdownContent = fs.readFileSync(sourcePath, 'utf8');

      // Convert to HTML
      const { value: htmlContent } = await processor.process(markdownContent);

      // Write HTML to build directory
      fs.writeFileSync(outputPath, htmlContent, 'utf8');

      console.log(`✓ Converted ${source} → ${output}`);
    } catch (error) {
      console.error(`✗ Failed to convert ${source}:`, error.message);
      process.exit(1);
    }
  }

  console.log('Markdown pre-rendering complete!');
}

preRenderMarkdown().catch((error) => {
  console.error('Error during pre-rendering:', error);
  process.exit(1);
});
