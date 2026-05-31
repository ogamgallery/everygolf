const fs = require('fs');
let content = fs.readFileSync('./src/App.tsx', 'utf8');

// Fix TS errors
content = content.replace(/import {([^}]*)Map,([^}]*)} from 'lucide-react';/, "import {$1 $2} from 'lucide-react';");
content = content.replace(/const \[activeBookingFilter, setActiveBookingFilter\] = useState\('전체'\);\n/, '');
content = content.replace(/const currentView = viewStack\[viewStack\.length - 1\];\n/, '');
content = content.replace(/e\.currentTarget\.nextElementSibling\.innerHTML = Number\(e\.target\.value\)\.toLocaleString\(\)\+'원'/g, 
  "if(e.currentTarget.nextElementSibling) e.currentTarget.nextElementSibling.innerHTML = Number(e.target.value).toLocaleString()+'원'");

// One more fix: If Map is imported multiple times, let's just make sure it's clean
content = content.replace(/Map,/g, "");

fs.writeFileSync('./src/App.tsx', content);
console.log('TS errors fixed');
