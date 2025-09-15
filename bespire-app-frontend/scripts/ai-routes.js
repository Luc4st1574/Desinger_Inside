#!/usr/bin/env node
// Listar páginas y rutas API del App Router (Next.js)
const fs = require('fs');
const path = require('path');

const roots = ['app', 'src/app']; // ajusta si usas src/app
const out = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (p.endsWith(path.join('page.tsx')) || p.endsWith(path.join('page.jsx'))) out.push('PAGE ' + p);
    else if (p.endsWith(path.join('route.ts')) || p.endsWith(path.join('route.js'))) out.push('API  ' + p);
  }
}

for (const r of roots) walk(path.join(process.cwd(), r));
console.log(out.sort().join('\n'));
