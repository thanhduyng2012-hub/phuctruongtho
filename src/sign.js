import * as THREE from 'three';
import {SVGLoader} from 'three/addons/loaders/SVGLoader.js';
import lettering from './assets/sign-lettering.json';

// Dimensions in metres: upper 85 cm, middle 35 cm, lower 20 cm.
// Local +Z is the sign face; the complete assembly faces the street (-Z).
const colors={ivory:'#F5F0E5',red:'#C7191D',wood:'#705642',ink:'#302B25',gold:'#F4CD71'};
const mat=Object.fromEntries(Object.entries(colors).map(([k,color])=>[k,new THREE.MeshStandardMaterial({color,roughness:k==='wood'?.65:.46,metalness:0})]));
function block(parent,w,h,d,x,y,z,material){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function extrude(parent,shape,depth,material,x=0,y=0,z=0){const geo=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:.0015,bevelThickness:.0015,bevelSegments:2,steps:1,curveSegments:10});const mesh=new THREE.Mesh(geo,material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
function rounded(w,h,r){const s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s}
function letters(parent,key,w,h,x,y,z,material){const entry=lettering[key];const svg=`<svg xmlns="http://www.w3.org/2000/svg">${entry.paths.map(d=>`<path d="${d}" fill="#fff"/>`).join('')}</svg>`;const paths=new SVGLoader().parse(svg).paths;const shapes=paths.flatMap(p=>SVGLoader.createShapes(p));const geo=new THREE.ExtrudeGeometry(shapes,{depth:45,bevelEnabled:true,bevelThickness:3,bevelSize:2,bevelSegments:1,curveSegments:5,steps:1});geo.computeBoundingBox();const b=geo.boundingBox,size=new THREE.Vector3();b.getSize(size);geo.translate(-(b.min.x+b.max.x)/2,-(b.min.y+b.max.y)/2,-b.min.z);geo.scale(w/size.x,h/size.y,.01/size.z);const mesh=new THREE.Mesh(geo,material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.label=entry.text;parent.add(mesh);return mesh}
function stroke(parent,points,r,material){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,24,r,6,false),material);mesh.castShadow=true;parent.add(mesh)}
function woodGrain(){if(mat.wood.map)return;const canvas=document.createElement('canvas');canvas.width=256;canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle='#b39e84';ctx.fillRect(0,0,256,128);for(let i=0;i<65;i++){ctx.strokeStyle=`rgba(65,38,17,${.06+(i%5)*.015})`;ctx.lineWidth=.6;ctx.beginPath();for(let x=0;x<=256;x+=4){const y=i*2+Math.sin(x*.032+i)*1.4; x?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()}const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,1);mat.wood.map=t;mat.wood.needsUpdate=true}
export function createSign(width){woodGrain();const g=new THREE.Group();g.name='PTT detailed signage';g.userData.objectId='sign';const w=width;
 block(g,w,1.4,.15,0,.7,-.075,mat.wood);
 block(g,w-.06,.85,.014,0,.975,.007,mat.ivory);
 block(g,w-.06,.35,.014,0,.375,.007,mat.red);
 block(g,w-.06,.20,.014,0,.1,.007,mat.ivory);
 // Continuous 3 cm timber perimeter, projecting 15 mm from the face.
 for(const y of [.015,1.385])block(g,w,.03,.18,0,y,-.06,mat.wood);
 for(const x of [-w/2+.015,w/2-.015])block(g,.03,1.34,.18,x,.7,-.06,mat.wood);
 for(const y of [.2,.55])block(g,w,.025,.175,0,y,-.061,mat.wood);
 const sx=w/6,logoX=-1.38*sx,logoY=.975;
 // Red name plaque and circular bowl emblem are physical raised pieces.
 const plaqueW=2.98*sx;extrude(g,rounded(plaqueW,.57,.065),.022,mat.red,.17*sx,logoY,.028);
 const disc=new THREE.Shape();disc.absarc(0,0,.375,0,Math.PI*2,false);extrude(g,disc,.029,mat.red,logoX,logoY,.025);
 const border=new THREE.Mesh(new THREE.TorusGeometry(.35,.007,8,72),mat.ivory);border.position.set(logoX,logoY,.064);g.add(border);
 letters(g,'brand',2.55*sx,.22,.26*sx,1.055,.06,mat.ivory);
 block(g,2.55*sx,.009,.01,.26*sx,.916,.061,mat.ivory);
 letters(g,'tagline',2.48*sx,.09,.26*sx,.835,.06,mat.gold);
 // Stylised bowl, chopsticks and steam, traced as relief instead of a flat image.
 const bowl=new THREE.Shape();bowl.moveTo(-.18,.035);bowl.lineTo(.18,.035);bowl.quadraticCurveTo(.13,-.115,0,-.135);bowl.quadraticCurveTo(-.13,-.115,-.18,.035);extrude(g,bowl,.01,mat.ivory,logoX,logoY+.06,.065);
 stroke(g,[[-.195,.04,0],[-.11,.015,0],[.09,.015,0],[.195,.04,0]].map(p=>[p[0]+logoX,p[1]+logoY+.06,.079]),.009,mat.ivory);
 block(g,.11,.014,.01,logoX,logoY-.095,.075,mat.ivory);
 for(const shift of [-.012,.012])stroke(g,[[logoX+.035+shift,logoY+.145,.077],[logoX+.245+shift,logoY+.31,.077]],.006,mat.ivory);
 for(const dx of [-.085,0,.085])stroke(g,[[logoX+dx,logoY+.12,.077],[logoX+dx+.018,logoY+.165,.077],[logoX+dx-.012,logoY+.21,.077],[logoX+dx+.009,logoY+.265,.077]],.006,mat.ivory);
 letters(g,'ptt',.24,.105,logoX,logoY-.215,.071,mat.ivory);
 letters(g,'premium',w-.58,.218,0,.374,.019,mat.ivory);
 letters(g,'menu',w-.85,.113,0,.1,.019,mat.ink);
 g.userData.spec={width:w,height:1.4,depth:.15,letterDepth:.01,frameWidth:.03};return g;
}
