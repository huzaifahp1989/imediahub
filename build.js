import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');
const sourceDir = __dirname;

// Create public directory
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

// Files/Extensions to copy
const extensions = ['.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.ico', '.json'];
const excludeFiles = [
    'build.js', 
    'check_duplicates.js', 
    'fix_mosques.js', 
    'server.cjs', 
    'package.json', 
    'package-lock.json', 
    'vercel.json', 
    'firebase.json',
    '.firebaserc',
    '.gitignore'
];
const excludeDirs = ['node_modules', '.git', '.vercel', '.firebase', 'api', 'public'];

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            if (!excludeDirs.includes(entry.name)) {
                copyDir(srcPath, destPath);
            }
        } else {
            const ext = path.extname(entry.name).toLowerCase();
            if (extensions.includes(ext) && !excludeFiles.includes(entry.name)) {
                fs.copyFileSync(srcPath, destPath);
                console.log(`Copied: ${entry.name}`);
            }
        }
    }
}

console.log('Building project to public/ directory...');
copyDir(sourceDir, publicDir);
console.log('Build complete.');
