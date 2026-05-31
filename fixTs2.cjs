const fs = require('fs');
let content = fs.readFileSync('./src/App.tsx', 'utf8');

content = content.replace(/onChange=\{\(e\) => if\(e\.currentTarget\.nextElementSibling\) e\.currentTarget\.nextElementSibling\.innerHTML = Number\(e\.target\.value\)\.toLocaleString\(\)\+'원'\}/g, 
  "onChange={(e) => { if(e.currentTarget.nextElementSibling) e.currentTarget.nextElementSibling.innerHTML = Number(e.target.value).toLocaleString()+'원'; }}");

fs.writeFileSync('./src/App.tsx', content);
console.log('Fixed arrow function braces');
