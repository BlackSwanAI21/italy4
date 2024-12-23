import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      // Replace .js with .ts in the destination path for TypeScript files
      const finalDestPath = destPath.replace(/\.ts$/, '.js');
      await fs.copyFile(srcPath, finalDestPath);
    }
  }
}

async function main() {
  try {
    // Create dist directories
    await fs.mkdir(path.join(rootDir, 'dist/server'), { recursive: true });
    await fs.mkdir(path.join(rootDir, 'dist/lib'), { recursive: true });

    // Copy server files
    await copyDir(
      path.join(rootDir, 'build/server'),
      path.join(rootDir, 'dist/server')
    );

    // Copy lib files
    await copyDir(
      path.join(rootDir, 'build/lib'),
      path.join(rootDir, 'dist/lib')
    );

    console.log('Server files copied successfully');
  } catch (error) {
    console.error('Error copying server files:', error);
    process.exit(1);
  }
}

main();