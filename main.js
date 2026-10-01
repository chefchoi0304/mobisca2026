// 비전홀 3D 목업 – three.js 0.160.0
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
const A={"arc": "./assets/arc.jpg", "bizA": "./assets/bizA.jpg", "bizB": "./assets/bizB.jpg", "ca01": "./assets/ca01.jpg", "ca02": "./assets/ca02.jpg", "ca03": "./assets/ca03.jpg", "ca04": "./assets/ca04.jpg", "ca05": "./assets/ca05.jpg", "ca06": "./assets/ca06.jpg", "ca07": "./assets/ca07.jpg", "ca08": "./assets/ca08.jpg", "ca09": "./assets/ca09.jpg", "ca10": "./assets/ca10.jpg", "ca11": "./assets/ca11.jpg", "ca12": "./assets/ca12.jpg", "ca13": "./assets/ca13.jpg", "ca14": "./assets/ca14.jpg", "ca15": "./assets/ca15.jpg", "ca16": "./assets/ca16.jpg", "led": "./assets/led.jpg", "recep_desk": "./assets/recep_desk.jpg", "recep_wall": "./assets/recep_wall.jpg"};
const stage=document.getElementById("stage");
const shot=location.hash.startsWith("#shot");
if(shot) document.body.classList.add("shot");
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=0.92;
stage.prepend(renderer.domElement);
const scene=new THREE.Scene(); scene.background=new THREE.Color(0xdfe3ee);
// soft studio reflections (chrome, polished stone)
const pmrem=new THREE.PMREMGenerator(renderer); scene.environment=pmrem.fromScene(new RoomEnvironment(),0.04).texture;
const camera=new THREE.PerspectiveCamera(45,1,0.1,400);
const controls=new OrbitControls(camera,renderer.domElement); controls.enableDamping=true;
scene.add(new THREE.HemisphereLight(0xffffff,0x8a8f9e,0.6));
const sun=new THREE.DirectionalLight(0xfff6ea,1.5); sun.position.set(30,40,60); sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048); Object.assign(sun.shadow.camera,{left:-35,right:35,top:30,bottom:-30,near:1,far:160}); sun.shadow.bias=-0.0004;
sun.target.position.set(18,0,24); scene.add(sun,sun.target);
const M=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.8,metalness:0,envMapIntensity:.6},o));
function box(w,h,d,mat,x,y,z,parent=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m}
function cyl(r,h,mat,x,y,z,seg=28,parent=scene){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,seg),mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m}
const FONT='"Noto Sans KR","Noto Sans CJK KR","Apple SD Gothic Neo",sans-serif';
try{await Promise.race([Promise.all([document.fonts.load('900 40px "Noto Sans KR"'),document.fonts.load('500 40px "Noto Sans KR"')]),new Promise(r=>setTimeout(r,2500))])}catch(e){}
const texLoader=new THREE.TextureLoader();
const tex=src=>{const t=texLoader.load(src);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t};
// ---------- procedural surface textures (from site photos) ----------
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
function hexRGB(h){return [(h>>16)&255,(h>>8)&255,h&255]}
// stone tiles: texM = metres covered by one texture tile; tw/th = tile size (m)
function stoneTex({texM=4.8,tw=1.2,th=0.6,base=0xb9b4ab,vary=10,grout=0x8e8a84,bond=true,speck=14,px=1024}){
  const c=document.createElement("canvas");c.width=c.height=px;const g=c.getContext("2d");const s=px/texM;const [r,gg,b]=hexRGB(base);
  g.fillStyle=`rgb(${hexRGB(grout)})`;g.fillRect(0,0,px,px);
  const rows=Math.round(texM/th), cols=Math.round(texM/tw);
  for(let j=0;j<rows;j++){const off=bond&&(j%2)?tw/2:0;
    for(let i=-1;i<=cols;i++){const x=(i*tw+off)*s,y=j*th*s,v=(rnd()-.5)*vary;
      g.fillStyle=`rgb(${r+v},${gg+v},${b+v*0.9})`;g.fillRect(x+1,y+1,tw*s-2,th*s-2);
      // soft cloud variation inside tile
      for(let k=0;k<5;k++){const cx=x+rnd()*tw*s,cy=y+rnd()*th*s,rad=(0.15+rnd()*0.3)*s,gr=g.createRadialGradient(cx,cy,0,cx,cy,rad);const dv=(rnd()-.5)*vary*1.2;
        gr.addColorStop(0,`rgba(${r+dv},${gg+dv},${b+dv},.35)`);gr.addColorStop(1,`rgba(${r+dv},${gg+dv},${b+dv},0)`);g.fillStyle=gr;g.save();g.beginPath();g.rect(x+1,y+1,tw*s-2,th*s-2);g.clip();g.fillRect(cx-rad,cy-rad,rad*2,rad*2);g.restore()}}}
  const id=g.getImageData(0,0,px,px),d=id.data;for(let i=0;i<d.length;i+=4){const n=(rnd()-.5)*speck;d[i]+=n;d[i+1]+=n;d[i+2]+=n}g.putImageData(id,0,0);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;t.userData.texM=texM;return t}
function ceilTex({texM=6,base=0xb7b8b6,slot=true,dots=false}){
  const px=1024,c=document.createElement("canvas");c.width=c.height=px;const g=c.getContext("2d");const s=px/texM;
  g.fillStyle=`rgb(${hexRGB(base)})`;g.fillRect(0,0,px,px);
  g.strokeStyle="rgba(0,0,0,.18)";g.lineWidth=2;for(let v=0;v<=texM;v+=0.6){g.beginPath();g.moveTo(v*s,0);g.lineTo(v*s,px);g.stroke();g.beginPath();g.moveTo(0,v*s);g.lineTo(px,v*s);g.stroke()}
  g.fillStyle="rgba(0,0,0,.08)";for(let y=4;y<px;y+=8)for(let x=4;x<px;x+=8)g.fillRect(x,y,2,2);
  if(slot){g.fillStyle="#141518";g.fillRect(0,px/2-0.07*s,px,0.14*s);g.fillStyle="rgba(255,248,230,.9)";g.fillRect(0,px/2-0.025*s,px,0.05*s)}
  if(dots){for(let k=0;k<6;k++){const x=(k+.5)*px/6,y=px/4;g.fillStyle="rgba(255,244,214,.95)";g.beginPath();g.arc(x,y,0.07*s,0,7);g.fill();g.beginPath();g.arc(x,y*3,0.07*s,0,7);g.fill()}}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;t.userData.texM=texM;return t}
// plane with world-scaled UVs (texture keeps its real-world size)
function surf(w,d,tx,mOpts,{x,y,z,rx=-Math.PI/2,ry=0,parent=scene,shadow=true}){
  const geo=new THREE.PlaneGeometry(w,d),uv=geo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*w/tx.userData.texM,uv.getY(i)*d/tx.userData.texM);
  const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial(Object.assign({map:tx,roughness:.45,envMapIntensity:.5},mOpts)));m.rotation.set(rx,ry,0,"YXZ");m.position.set(x,y,z);m.receiveShadow=shadow;parent.add(m);return m}
const tHall=stoneTex({base:0xc4bfb6,vary:7,grout:0xa29d95,speck:10});           // 2025 사진: 밝은 그레이지 대형 타일
const tZone=stoneTex({base:0xa6a49f,vary:12,grout:0x86847f,speck:14,tw:1.2,th:1.2,bond:false}); // 답사: 회색 대형 석재
const tStep=stoneTex({texM:2.4,base:0xbca88b,vary:10,grout:0x9b8a70,tw:1.2,th:0.6});  // 답사: 웜베이지 계단
const tWallZ=stoneTex({texM:4.8,base:0x8e8c88,vary:8,grout:0x75736f,tw:1.2,th:2.4,bond:false,speck:8});
const tWallH=stoneTex({texM:4.8,base:0x45464b,vary:5,grout:0x2f3034,tw:1.2,th:2.4,bond:false,speck:6});
// ---------- levels ----------
const HALL_Y=-1.03, ZC=3.3, HALL_CEIL=HALL_Y+5.0;
const mWall=M(0x8d9098), mWallHall=M(0x45464b), mCol=M(0xeeece6,{roughness:.55}), mDark=M(0x1f2230);
box(36,0.2,23.6,M(0xc4bfb6),18,HALL_Y-0.1,11.8); surf(36,23.6,tHall,{roughness:.32},{x:18,y:HALL_Y+0.002,z:11.8});
box(44,0.2,13.0,M(0xa6a49f),22,-0.1,32.9);      surf(44,13.0,tZone,{roughness:.38},{x:22,y:0.002,z:32.9});
box(8,0.2,2.8,M(0xa6a49f),40,-0.1,25.0);        surf(8,2.8,tZone,{roughness:.38},{x:40,y:0.003,z:25.0});
const steps=6, rise=1.03/steps, run=2.8/steps, mStep=M(0xbca88b,{roughness:.5});
for(let i=0;i<steps;i++){const top=HALL_Y+rise*(i+1);box(30.9,top-HALL_Y,run,mStep,17.75,HALL_Y+(top-HALL_Y)/2,23.6+run*i+run/2);
  surf(30.9,run,tStep,{roughness:.45},{x:17.75,y:top+0.002,z:23.6+run*i+run/2})}
box(2.3,1.03,2.8,mWall,1.15,HALL_Y+0.515,25.0); box(2.8,1.03,2.8,mWall,34.6,HALL_Y+0.515,25.0);
// walls (stone panel faces)
box(36.4,HALL_CEIL-HALL_Y,0.3,mWallHall,18,(HALL_CEIL+HALL_Y)/2,-0.15);
box(0.3,HALL_CEIL-HALL_Y,23.6,mWallHall,-0.15,(HALL_CEIL+HALL_Y)/2,11.8); surf(23.6,HALL_CEIL-HALL_Y,tWallH,{roughness:.6},{x:0.005,y:(HALL_CEIL+HALL_Y)/2,z:11.8,rx:0,ry:Math.PI/2});
const eastWall=box(0.3,HALL_CEIL-HALL_Y,23.6,mWallHall,36.15,(HALL_CEIL+HALL_Y)/2,11.8);
box(0.3,ZC,15.8,mWall,-0.15,ZC/2,31.5); surf(15.8,ZC,tWallZ,{roughness:.6},{x:0.005,y:ZC/2,z:31.5,rx:0,ry:Math.PI/2});
// east lobby walls (north/east) – toggled with ceiling
const lobbyW=new THREE.Group();scene.add(lobbyW);
box(8.6,ZC,0.3,mWall,40.2,ZC/2,23.45,lobbyW); surf(8.6,ZC,tWallZ,{roughness:.6},{x:40.2,y:ZC/2,z:23.61,rx:0,parent:lobbyW});
box(0.3,ZC,16.1,mWall,44.65,ZC/2,31.5,lobbyW); surf(16.1,ZC,tWallZ,{roughness:.6,emissive:0xffffff,emissiveMap:tWallZ,emissiveIntensity:.35},{x:44.49,y:ZC/2,z:31.5,rx:0,ry:-Math.PI/2,parent:lobbyW});
// glass south facade
const glass=new THREE.Mesh(new THREE.PlaneGeometry(44,ZC),new THREE.MeshPhysicalMaterial({color:0xcfe3ea,transparent:true,opacity:.28,roughness:.05}));
glass.position.set(22,ZC/2,39.4); scene.add(glass);
const mull=new THREE.Group();scene.add(mull);for(let x=0;x<=44;x+=1.5) box(0.06,ZC,0.08,M(0x3a3d46),x,ZC/2,39.4,mull);
const trees=new THREE.Group(); scene.add(trees);
for(let i=0;i<14;i++){const x=1.5+i*3.1, s=1+((i*37)%5)/6; cyl(0.12,2.6,M(0x6b5237),x,1.3,42.5,12,trees); const f=new THREE.Mesh(new THREE.SphereGeometry(1.5*s,16,12),M(0x5d8f4e));f.position.set(x,3.2+s*.4,42.5);f.castShadow=true;trees.add(f)}
box(48,0.1,6,M(0x9bb07e),22,-0.2,42.5,trees);
// ceilings (perforated panels + black linear slots / dark hall ceiling with downlights)
const ceil=new THREE.Group(); scene.add(ceil);
const tCz=ceilTex({}), tCh=ceilTex({base:0x2b2c31,slot:false,dots:true});
const cOpt={roughness:.9,emissive:0xffffff,emissiveIntensity:.62};
[[21.8,13,10.9,32.9],[14.9,13,36.55,32.9],[7.3,5.7,25.45,29.25],[7.3,3.3,25.45,37.75]].forEach(([w,d,x,z])=>{const m=surf(w,d,tCz,Object.assign({emissiveMap:tCz},cOpt),{x,y:ZC,z,rx:Math.PI/2,parent:ceil,shadow:false});});
[[8.5,2.8,40.25,25.0]].forEach(([w,d,x,z])=>surf(w,d,tCz,Object.assign({emissiveMap:tCz},cOpt),{x,y:ZC,z,rx:Math.PI/2,parent:ceil,shadow:false}));
surf(36,26.4,tCh,{roughness:.9,emissive:0xffffff,emissiveMap:tCh,emissiveIntensity:.35},{x:18,y:HALL_CEIL,z:13.2,rx:Math.PI/2,parent:ceil,shadow:false});
// columns (matte white plaster)
const colX=[5.88,11.94,17.94,23.94,29.94];
colX.forEach(x=>{[30.2,38.0].forEach(z=>cyl(0.5,ZC,mCol,x,ZC/2,z,40));cyl(0.5,HALL_CEIL-HALL_Y,mCol,x,(HALL_CEIL+HALL_Y)/2,22.4,40)});
// ---------- labels ----------
const areaLabels=[];
function label(text,{x,y,z,size=1,bg="#2e3ed2",fg="#fff",pad=22,fs=48,round=true,area=true}){
  const c=document.createElement("canvas"),g=c.getContext("2d");g.font=`700 ${fs}px ${FONT}`;
  const w=Math.ceil(g.measureText(text).width)+pad*2,h=fs+pad*1.3;c.width=w;c.height=h;
  g.font=`700 ${fs}px ${FONT}`;g.fillStyle=bg;const r=round?h/2:8;g.beginPath();g.roundRect(0,0,w,h,r);g.fill();
  g.fillStyle=fg;g.textBaseline="middle";g.fillText(text,pad,h/2+2);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false,transparent:true}));s.renderOrder=10;
  s.scale.set(size*w/h*0.75,size*0.75,1);s.position.set(x,y,z);scene.add(s);if(area)areaLabels.push(s);return s}
// ---------- booth (CA별 월 템플릿 시안 적용) ----------
const mTable=M(0xfafafa,{roughness:.35}), mFrame=M(0xe9e9ee,{roughness:.5});
function booth({x,z,rot,no,img,biz=false,standby=false,W=1.2,H=2.1,PZW=1.8}){
  const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;scene.add(g);
  box(W,H,0.12,mFrame,0,H/2,0,g);
  const face=new THREE.Mesh(new THREE.PlaneGeometry(W-0.02,H-0.03),new THREE.MeshStandardMaterial({map:tex(img),roughness:.6,envMapIntensity:.3}));face.position.set(0,H/2,0.065);g.add(face);
  box(Math.min(W*0.45,0.9),0.04,0.35,mFrame,0,0.02,-0.12,g);
  if(!biz){box(0.8,0.78,0.8,mTable,0,0.39,0.06+0.4+0.02,g); box(0.84,0.03,0.84,mTable,0,0.795,0.48,g);
    const zone=new THREE.Mesh(new THREE.PlaneGeometry(PZW,1.4),new THREE.MeshStandardMaterial({color:0xc7d1fb,transparent:true,opacity:.35}));zone.rotation.x=-Math.PI/2;zone.position.set(0,0.012,1.58);zone.receiveShadow=true;g.add(zone);}
  if(standby){const s=new THREE.Group();s.position.set(0.85,0,0.5);g.add(s);
    cyl(0.24,0.04,M(0xe2e2e6),0,0.02,0,24,s);cyl(0.03,1.0,M(0xd0d0d6,{metalness:.6,roughness:.3}),0,0.52,0,12,s);
    box(0.63,0.38,0.04,mDark,0,1.15,0.03,s);const sc=new THREE.Mesh(new THREE.PlaneGeometry(0.6,0.35),new THREE.MeshBasicMaterial({color:0x4f67ff}));sc.position.set(0,1.15,0.052);s.add(sc)}
  const tag=label(no,{x:0,y:0,z:0,size:0.55,bg:biz?"#c9414b":"#2a3170",fs:48,area:false});scene.remove(tag);tag.material.depthTest=true;tag.position.set(0,H+0.35,0.1);g.add(tag);
  return g}
// ㅁ자 배치 (CAD 실측) – 기둥 사이 2개씩: 북 01-06(동→서) · 서 07-08 · 남 09-14(서→동) · 계단 서측 끝 15-16
const RX=[2.5,4.35,7.9,9.9,13.95,15.95];
const SB=new Set([1,4,8,12,15]);const nn=i=>String(i).padStart(2,"0");
const mk=(i,o)=>booth(Object.assign({no:nn(i),img:A["ca"+nn(i)],standby:SB.has(i)},o));
[...RX].reverse().forEach((x,i)=>mk(i+1,{x,z:30.32,rot:0}));
mk(7,{x:0.06,z:33.4,rot:Math.PI/2,PZW:1.6}); mk(8,{x:0.06,z:34.6,rot:Math.PI/2,PZW:1.6});
RX.forEach((x,i)=>mk(i+9,{x,z:37.88,rot:Math.PI}));
mk(15,{x:18.4,z:34.6,rot:-Math.PI/2,PZW:1.6}); mk(16,{x:18.4,z:33.4,rot:-Math.PI/2,PZW:1.6});
// 사업장 월 (부스존 북동측, 남향) – 1~2개 검토 중
booth({x:27.9,z:27.25,rot:0,no:"A",img:A.bizA,biz:true,W:2.0,H:2.2});
booth({x:30.4,z:27.25,rot:0,no:"B",img:A.bizB,biz:true,W:2.0,H:2.2});
// archive wall (honeycomb, faces south)
const arc=new THREE.Group();arc.position.set(34.9,0,26.6);scene.add(arc);
box(4.0,2.2,0.3,M(0xf2efe8),0,1.1,0,arc);
const af=new THREE.Mesh(new THREE.PlaneGeometry(4.0,2.2),new THREE.MeshStandardMaterial({map:tex(A.arc),roughness:.75,envMapIntensity:.3}));af.position.set(0,1.1,0.155);arc.add(af);
// VOID stair
const rail=new THREE.MeshPhysicalMaterial({color:0xcfe3ea,transparent:true,opacity:.35});
{const n=26, x0=18.5, x1=30.2, top=4.5, run=(x1-x0)/n, r=top/n, mSt=M(0xd6d3cb,{roughness:.5}), mStr=M(0x7b7e86,{roughness:.4,metalness:.3});
 for(let i=0;i<n;i++){const h=r*(i+1);box(run+0.02,0.06,4.0,mSt,x1-run*i-run/2,h-0.03,34.1)}
 const L=Math.hypot(x1-x0,top), ang=-Math.atan2(top,x1-x0);
 [32.05,36.15].forEach(z=>{const s=new THREE.Mesh(new THREE.BoxGeometry(L,0.32,0.12),mStr);s.position.set((x0+x1)/2,top/2-0.12,z);s.rotation.z=ang;s.castShadow=true;scene.add(s);
   const g=new THREE.Mesh(new THREE.BoxGeometry(L,0.95,0.03),rail);g.position.set((x0+x1)/2,top/2+0.5,z);g.rotation.z=ang;scene.add(g);
   const h=new THREE.Mesh(new THREE.BoxGeometry(L,0.05,0.07),mStr);h.position.set((x0+x1)/2,top/2+1.0,z);h.rotation.z=ang;scene.add(h)});}
// reception (east lobby, faces south) – 키비주얼 기반 시안
{box(3.0,2.4,0.3,M(0x2a3170),39.3,1.2,26.6);
 const f=new THREE.Mesh(new THREE.PlaneGeometry(2.98,2.38),new THREE.MeshStandardMaterial({map:tex(A.recep_wall),roughness:.6,envMapIntensity:.3}));f.position.set(39.3,1.2,26.76);scene.add(f);
 box(4.0,1.0,0.6,M(0x252c6a),39.3,0.5,28.25); box(4.04,0.04,0.66,M(0xf5f5f7,{roughness:.3}),39.3,1.02,28.25);
 const fr=new THREE.Mesh(new THREE.PlaneGeometry(3.98,0.98),new THREE.MeshStandardMaterial({map:tex(A.recep_desk),roughness:.6,envMapIntensity:.3}));fr.position.set(39.3,0.5,28.56);scene.add(fr);
 [38.1,39.3,40.5].forEach(x=>{const ch=new THREE.Group();ch.position.set(x,0,27.5);scene.add(ch);box(0.45,0.05,0.45,M(0x3a3e4a),0,0.62,0,ch);cyl(0.03,0.6,M(0x9a9ea8,{metalness:.7,roughness:.3}),0,0.3,0,8,ch)});
 // pamphlet stacks on desk
 [38.3,40.2].forEach(x=>box(0.21,0.03,0.30,M(0xc9c6d7),x,1.055,28.15));
}
// ---------- main hall ----------
const led=new THREE.Mesh(new THREE.PlaneGeometry(20,4.0),new THREE.MeshBasicMaterial({map:tex(A.led)}));led.position.set(18,HALL_Y+0.2+2.0,0.27);scene.add(led);
box(20.3,4.3,0.25,mDark,18,HALL_Y+2.15,0.12);
box(0.6,1.1,0.5,M(0xdfe3ea,{metalness:.3,roughness:.3}),29.8,HALL_Y+0.55,2.0);
// banquet round table Ø1,800 – floor-length black cloth with folds
const clothGeo=(()=>{const R=0.9,Ht=0.76,pts=[];pts.push(new THREE.Vector2(0,Ht+0.005));pts.push(new THREE.Vector2(R-0.02,Ht+0.005));pts.push(new THREE.Vector2(R+0.005,Ht-0.012));
  for(let i=0;i<=12;i++){const t=i/12;pts.push(new THREE.Vector2(R+0.015+t*0.05,(Ht-0.03)*(1-t)))}
  const g=new THREE.LatheGeometry(pts,120),p=g.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);if(y<Ht-0.03){const t=1-y/(Ht-0.03),a=Math.atan2(z,x),k=1+t*(0.022*Math.sin(a*22)+0.01*Math.sin(a*9+1.3));p.setX(i,x*k);p.setZ(i,z*k)}}
  g.computeVertexNormals();return g})();
const mCloth=new THREE.MeshStandardMaterial({color:0x15161b,roughness:.92,side:THREE.DoubleSide,envMapIntensity:.25});
// banquet chair with full-length dark chair cover (의자보 연회의자)
function chairParts(){const T=(g,x,y,z,rx=0,ry=0)=>{g.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx,ry,0)).setPosition(x,y,z));return g};
  const cover=[],pleat=[];
  // skirt over seat & legs: square frustum to the floor, slightly flared
  const sk=new THREE.CylinderGeometry(0.33,0.355,0.45,4,6,true);sk.rotateY(Math.PI/4);
  {const p=sk.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i),t=(0.225-y)/0.45,x=p.getX(i),z=p.getZ(i),a=Math.atan2(z,x);const k=1+t*0.018*Math.sin(a*14);p.setX(i,x*k);p.setZ(i,z*k)}}
  cover.push(T(sk,0,0.225,0.02));
  cover.push(T(new RoundedBoxGeometry(0.48,0.07,0.48,3,0.03),0,0.475,0.02));          // padded seat top
  cover.push(T(new RoundedBoxGeometry(0.45,0.56,0.08,3,0.035),0,0.78,-0.2,-0.08));      // covered high back
  // back cover hem hanging behind
  cover.push(T(new THREE.BoxGeometry(0.45,0.30,0.012),0,0.36,-0.235,0.02));
  // soft pleats at the skirt corners
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>pleat.push(T(new THREE.CylinderGeometry(0.012,0.02,0.44,6),sx*0.236,0.22,0.02+sz*0.236)));
  return [mergeGeometries(cover.map(g=>g.index?g.toNonIndexed():g)),mergeGeometries(pleat)]}
const [gFab,gFr]=chairParts();
const tables=[];[8,13,18,23,28].forEach(x=>[7,12.5,18].forEach(z=>tables.push([x,z])));
const NCH=tables.length*10;
const mCover=new THREE.MeshStandardMaterial({color:0x3d4049,roughness:.82,side:THREE.DoubleSide,envMapIntensity:.55});
const iFab=new THREE.InstancedMesh(gFab,mCover,NCH), iFr=new THREE.InstancedMesh(gFr,mCover,NCH);
const iSau=new THREE.InstancedMesh(new THREE.CylinderGeometry(0.075,0.065,0.012,24),M(0xffffff,{roughness:.25}),NCH);
const iCup=new THREE.InstancedMesh(new THREE.CylinderGeometry(0.04,0.032,0.07,20),M(0xffffff,{roughness:.25}),NCH);
const iBot=new THREE.InstancedMesh(new THREE.CylinderGeometry(0.032,0.032,0.2,14),new THREE.MeshStandardMaterial({color:0xcfe6ff,roughness:.1,transparent:true,opacity:.55,envMapIntensity:1}),NCH);
const iCap=new THREE.InstancedMesh(new THREE.CylinderGeometry(0.015,0.015,0.025,10),M(0x2e6fd8),NCH);
const iPap=new THREE.InstancedMesh(new THREE.BoxGeometry(0.21,0.002,0.297),M(0xf7f7f7,{roughness:.9}),NCH);
[iFab,iFr].forEach(m=>{m.castShadow=m.receiveShadow=true});
const mt=new THREE.Matrix4(),q=new THREE.Quaternion(),one=new THREE.Vector3(1,1,1),Y=new THREE.Vector3(0,1,0);let n=0;
const set=(im,x,y,z,ry)=>{q.setFromAxisAngle(Y,ry);mt.compose(new THREE.Vector3(x,y,z),q,one);im.setMatrixAt(n,mt)};
tables.forEach(([x,z],ti)=>{
  const cm=new THREE.Mesh(clothGeo,mCloth);cm.position.set(x,HALL_Y,z);cm.castShadow=cm.receiveShadow=true;scene.add(cm);
  // table number stand
  cyl(0.004,0.28,M(0xb8bcc6,{metalness:.8,roughness:.3}),x,HALL_Y+0.9,z,8);const sg=cyl(0.06,0.012,M(0x2a3170),x,HALL_Y+1.05,z,24);sg.rotation.x=Math.PI/2;
  for(let k=0;k<10;k++){const a=k/10*Math.PI*2+(ti%2?0.31:0),ca=Math.cos(a),sa=Math.sin(a),ry=-a-Math.PI/2;
    set(iFab,x+ca*1.22,HALL_Y,z+sa*1.22,ry);set(iFr,x+ca*1.22,HALL_Y,z+sa*1.22,ry);
    set(iPap,x+ca*0.62,HALL_Y+0.766,z+sa*0.62,ry);set(iSau,x+ca*0.66+sa*0.17,HALL_Y+0.771,z+sa*0.66-ca*0.17,0);
    set(iCup,x+ca*0.66+sa*0.17,HALL_Y+0.812,z+sa*0.66-ca*0.17,0);set(iBot,x+ca*0.7-sa*0.18,HALL_Y+0.865,z+sa*0.7+ca*0.18,0);set(iCap,x+ca*0.7-sa*0.18,HALL_Y+0.977,z+sa*0.7+ca*0.18,0);n++}});
[iFab,iFr,iSau,iCup,iBot,iCap,iPap].forEach(m=>{m.instanceMatrix.needsUpdate=true;scene.add(m)});
// area labels (short)
const DK="rgba(20,24,48,.88)";
label("메인홀",{x:18,y:HALL_Y+4.2,z:13,size:1.6,bg:DK});
label("부스존",{x:9.2,y:3.9,z:34,size:1.6,bg:DK});
label("계단",{x:9,y:1.3,z:25.0,size:1.0,bg:"rgba(255,255,255,.92)",fg:"#1d2233"});
label("아카이브월",{x:34.9,y:3.0,z:26.9,size:1.0,bg:"#b86a00"});
label("2층 계단",{x:24.3,y:5.2,z:34.1,size:1.0,bg:"rgba(255,255,255,.92)",fg:"#1d2233"});
label("LED 월",{x:18,y:HALL_Y+4.7,z:0.8,size:1.1,bg:"#2e3ed2"});
label("사업장",{x:29.15,y:3.2,z:27.4,size:1.0,bg:"#c9414b"});
label("리셉션",{x:39.3,y:3.0,z:27.6,size:1.0,bg:"#2e3ed2"});
// ---------- views ----------
const VIEWS={
  bird:{p:[43,27,53],t:[18,-1,23],ceil:false},
  booth:{p:[17.2,1.65,34.0],t:[2,1.2,34.0],ceil:true},
  hall:{p:[21,1.75,26.0],t:[15,0.2,4],ceil:true},
  detail:{p:[11.6,1.7,35.4],t:[9.2,1.0,30.6],ceil:true},
  recep:{p:[38.8,1.7,38.6],t:[37.4,1.2,26.6],ceil:true}};
let ceilOn=false;const tc=document.getElementById("t-ceil");
function setCeil(v){ceilOn=v;ceil.visible=v;eastWall.visible=v;lobbyW.visible=v;areaLabels.forEach(s=>s.visible=!v);trees.visible=v;glass.visible=v;mull.visible=v;tc.setAttribute("aria-pressed",String(v));tc.textContent=v?"천장 숨기기":"천장 보기"}
function go(name){const v=VIEWS[name];camera.position.set(...v.p);controls.target.set(...v.t);setCeil(v.ceil);
  document.querySelectorAll(".views button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.v===name)));controls.update()}
document.querySelectorAll(".views button").forEach(b=>b.addEventListener("click",()=>go(b.dataset.v)));
tc.addEventListener("click",()=>setCeil(!ceilOn));
function resize(){const r=stage.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()}
new ResizeObserver(resize).observe(stage);resize();
const start=shot?location.hash.slice(6):"bird";go(VIEWS[start]?start:"bird");
renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera)});
window.__ready=true;
