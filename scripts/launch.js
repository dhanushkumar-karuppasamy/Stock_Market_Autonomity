import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const frontendDir = path.join(projectRoot, 'frontend');

console.log(`[v0] Project root: ${projectRoot}`);
console.log(`[v0] Frontend directory: ${frontendDir}`);

try {
  console.log('[v0] Installing npm dependencies...');
  execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });
  
  console.log('\n[v0] Starting Vite dev server on port 5173...');
  console.log('[v0] Preview will be available at http://localhost:5173');
  
  execSync('npm run dev', { cwd: frontendDir, stdio: 'inherit' });
} catch (error) {
  console.error('[v0] Error:', error.message);
  process.exit(1);
}
