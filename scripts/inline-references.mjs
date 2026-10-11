import {readFileSync,writeFileSync} from 'node:fs';
let html=readFileSync('dist/index.html','utf8');
for(const name of ['facade','sign','counter']) html=html.replaceAll(new RegExp(`(?:\\./|/)reference/${name}\\.png`,'g'),()=>`data:image/png;base64,${readFileSync(`public/reference/${name}.png`).toString('base64')}`);
writeFileSync('dist/index.html',html);
