import { execSync } from 'child_process';

console.log('Starting frontend dev server on port 5174...');
execSync('npx vite --port 5174', { stdio: 'inherit' });
