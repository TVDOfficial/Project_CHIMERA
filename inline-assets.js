const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const targetHtmlFile = path.join(distDir, 'chimera_interface.html'); // Changed variable name for clarity

// Ensure dist directory exists (it should after parcel build)
if (!fs.existsSync(distDir)) {
    console.error(`Dist directory not found: ${distDir}. Run parcel build first.`);
    process.exit(1);
}
if (!fs.existsSync(targetHtmlFile)) {
    console.error(`Source HTML file not found: ${targetHtmlFile}. Run parcel build first.`);
    process.exit(1);
}

let htmlContent = fs.readFileSync(targetHtmlFile, 'utf8');
const inlinedFilesToDelete = [];

// Inline CSS
const cssLinkRegex = /<link rel="stylesheet" href="([^"]+)">/g;
let match;
while ((match = cssLinkRegex.exec(htmlContent)) !== null) {
    const cssFileHref = match[1];
    if (cssFileHref.startsWith('http')) { // Don't inline remote CSS
        console.log(`Skipping remote CSS: ${cssFileHref}`);
        continue;
    }
    const cssFilePath = path.join(distDir, cssFileHref);
    if (fs.existsSync(cssFilePath)) {
        const cssContent = fs.readFileSync(cssFilePath, 'utf8');
        htmlContent = htmlContent.replace(match[0], `<style>\n${cssContent}\n</style>`);
        console.log(`Inlined CSS: ${cssFileHref}`);
        inlinedFilesToDelete.push(cssFilePath);
    } else {
        console.warn(`CSS file not found for inlining: ${cssFilePath}`);
    }
}

// Inline JavaScript (targeting the module script)
const jsScriptRegex = /<script type="module" src="([^"]+)"><\/script>/g;
while ((match = jsScriptRegex.exec(htmlContent)) !== null) {
    const jsFileSrc = match[1];
     if (jsFileSrc.startsWith('http')) { // Don't inline remote JS
        console.log(`Skipping remote JS: ${jsFileSrc}`);
        continue;
    }
    const jsFilePath = path.join(distDir, jsFileSrc);
    if (fs.existsSync(jsFilePath)) {
        const jsContent = fs.readFileSync(jsFilePath, 'utf8');
        htmlContent = htmlContent.replace(match[0], `<script type="module">\n// Inlined from ${jsFileSrc}\n${jsContent}\n</script>`);
        console.log(`Inlined JS: ${jsFileSrc}`);
        inlinedFilesToDelete.push(jsFilePath);
    } else {
        console.warn(`JS file not found for inlining: ${jsFilePath}`);
    }
}

fs.writeFileSync(targetHtmlFile, htmlContent, 'utf8');
console.log(`Successfully inlined assets into: ${targetHtmlFile}`);

// Delete the inlined CSS and JS files
if (inlinedFilesToDelete.length > 0) {
    console.log('Cleaning up inlined asset files...');
    inlinedFilesToDelete.forEach(filePath => {
        try {
            fs.unlinkSync(filePath);
            console.log(`Deleted: ${path.basename(filePath)}`);
        } catch (err) {
            console.error(`Error deleting file ${filePath}:`, err);
        }
    });
    console.log('Cleanup complete.');
} else {
    console.log('No local asset files were inlined, so no cleanup needed.');
} 