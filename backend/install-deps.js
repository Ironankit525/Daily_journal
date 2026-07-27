import { execSync } from 'child_process';
import fs from 'fs';

console.log('Running npm install in backend...');
execSync('npm install express mongoose cors dotenv', { stdio: 'inherit' });

const expressPkg = './node_modules/express/package.json';
console.log('Express pkg exists:', fs.existsSync(expressPkg));
