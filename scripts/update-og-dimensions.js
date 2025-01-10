import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sizeOf from 'image-size';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const faviconPath = join(projectRoot, 'static', 'favicon.png');
const appHtmlPath = join(projectRoot, 'src', 'app.html');

try {
  // Get image dimensions
  const dimensions = sizeOf(faviconPath);
  
  // Read app.html
  let htmlContent = readFileSync(appHtmlPath, 'utf-8');
  
  // Update dimensions
  htmlContent = htmlContent.replace(
    /<meta property="og:image:width" content="\d+"\/>/,
    `<meta property="og:image:width" content="${dimensions.width}"/>`
  );
  
  htmlContent = htmlContent.replace(
    /<meta property="og:image:height" content="\d+"\/>/,
    `<meta property="og:image:height" content="${dimensions.height}"/>`
  );
  
  // Write back to app.html
  writeFileSync(appHtmlPath, htmlContent);
  
  console.log(`✅ Updated OG dimensions to ${dimensions.width}x${dimensions.height}`);
} catch (error) {
  console.error('❌ Error updating OG dimensions:', error);
  process.exit(1);
} 