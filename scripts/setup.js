const { execSync } = require('child_process');
const path = require('path');

// Calculate paths
const scriptPath = __filename;
const scriptsDir = path.dirname(scriptPath);
const projectRoot = path.dirname(scriptsDir);
const frontendDir = path.join(projectRoot, 'frontend');

console.log('[v0] Project root:', projectRoot);
console.log('[v0] Frontend directory:', frontendDir);

// Step 1: Install dependencies
console.log('[v0] Installing npm dependencies...');
try {
  execSync('npm install', { 
    cwd: frontendDir, 
    stdio: 'inherit',
    shell: '/bin/bash'
  });
  console.log('[v0] Dependencies installed successfully');
} catch (error) {
  console.error('[v0] Failed to install dependencies:', error.message);
  process.exit(1);
}

// Step 2: Start dev server
console.log('[v0] Starting Vite dev server on port 5173...');
try {
  execSync('npm run dev', { 
    cwd: frontendDir, 
    stdio: 'inherit',
    shell: '/bin/bash'
  });
} catch (error) {
  console.error('[v0] Failed to start dev server:', error.message);
  process.exit(1);
}
