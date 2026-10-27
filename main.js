// 비전홀 3D 목업 – three.js 0.160.0
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
const A={"arc": "./assets/arc.jpg", "bizA": "./assets/bizA.jpg", "bizB": "./assets/bizB.jpg", "ca01": "./assets/ca01.jpg", "ca02": "./assets/ca02.jpg", "ca03": "./assets/ca03.jpg", "ca04": "./assets/ca04.jpg", "ca05": "./assets/ca05.jpg", "ca06": "./assets/ca06.jpg", "ca07": "./assets/ca07.jpg", "ca08": "./assets/ca08.jpg", "ca09": "./assets/ca09.jpg", "ca10": "./assets/ca10.jpg", "ca11": "./assets/ca11.jpg", "ca12": "./assets/ca12.jpg", "ca13": "./assets/ca13.jpg", "ca14": "./assets/ca14.jpg", "ca15": "./assets/ca15.jpg", "ca16": "./assets/ca16.jpg", "led": "./assets/led.jpg", "recep_desk": "./assets/recep_desk.jpg", "recep_wall": "./assets/recep_wall.jpg", "xb_biz": "./assets/xb_biz.jpg", "xb_g1": "./assets/xb_g1.jpg", "xb_g2": "./assets/xb_g2.jpg", "xb_guide": "./assets/xb_guide.jpg", "xb_hall": "./assets/xb_hall.jpg", "xb_org": "./assets/xb_org.jpg", "xb_recep": "./assets/xb_recep.jpg"};
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
const tHall=stoneTex({base:0xc9b9a3,vary:7,grout:0xa89a86,speck:10});           // 10/12 사진: 웜 베이지 대형 타일
const tLobby=stoneTex({base:0x9f8d82,vary:12,grout:0x857367,speck:12,tw:1.2,th:1.2,bond:false}); // 10/12 사진: 정문 로비 웜 브라운 석재
const tZone=stoneTex({base:0x9d9fa3,vary:12,grout:0x84868a,speck:14,tw:1.2,th:1.2,bond:false}); // 답사: 회색 대형 석재
const tStep=stoneTex({texM:2.4,base:0xbca88b,vary:10,grout:0x9b8a70,tw:1.2,th:0.6});  // 답사: 웜베이지 계단
const tWallZ=stoneTex({texM:4.8,base:0x8e8c88,vary:8,grout:0x75736f,tw:1.2,th:2.4,bond:false,speck:8});
const tWallH=stoneTex({texM:4.8,base:0x45464b,vary:5,grout:0x2f3034,tw:1.2,th:2.4,bond:false,speck:6});
// ---------- levels ----------
const HALL_Y=-1.03, ZC=3.0, HALL_CEIL=HALL_Y+3.96;  // 10/12 답사 실측: 부스존 3.0m · 메인홀 3.96m
const mWall=M(0x8d9098), mWallHall=M(0x45464b), mCol=M(0xeeece6,{roughness:.55}), mDark=M(0x1f2230);
box(36,0.2,22.9,M(0xc4bfb6),18,HALL_Y-0.1,11.45); surf(36,22.9,tHall,{roughness:.32},{x:18,y:HALL_Y+0.002,z:11.45});
box(50.65,0.2,13.0,M(0xa6a49f),25.325,-0.1,32.9);      surf(31.05,13.0,tZone,{roughness:.38},{x:15.525,y:0.002,z:32.9});  // 동쪽 로비 확장 (CAD: 대강당 홀 쪽으로 이어짐)
box(3.7,0.2,5.9,M(0xa48a7a),38.95,-0.1,24.85);  surf(3.7,5.9,tLobby,{roughness:.38},{x:38.95,y:0.003,z:24.85});  // 비상구 통로 (선큰가든 문)
surf(19.60,13.0,tLobby,{roughness:.38},{x:40.850,y:0.004,z:32.9});  // 정문 로비 (2층 계단 시작점 동쪽)
const steps=7, rise=1.03/steps, run=0.5, ST0=26.4-steps*run, /* 실측 7단 · 깊이 500 */ mStep=M(0xbca88b,{roughness:.5});
for(let i=0;i<steps;i++){const top=HALL_Y+rise*(i+1);box(30.9,top-HALL_Y,run,mStep,17.75,HALL_Y+(top-HALL_Y)/2,ST0+run*i+run/2);
  surf(30.9,run,tStep,{roughness:.45},{x:17.75,y:top+0.002,z:ST0+run*i+run/2})}
box(2.3,1.03,3.5,mWall,1.15,HALL_Y+0.515,24.65); box(2.8,1.03,3.5,mWall,34.6,HALL_Y+0.515,24.65);
// walls (stone panel faces)
box(36.4,HALL_CEIL-HALL_Y,0.3,mWallHall,18,(HALL_CEIL+HALL_Y)/2,-0.15);
box(0.3,HALL_CEIL-HALL_Y,23.6,mWallHall,-0.15,(HALL_CEIL+HALL_Y)/2,11.8); surf(23.6,HALL_CEIL-HALL_Y,tWallH,{roughness:.6},{x:0.005,y:(HALL_CEIL+HALL_Y)/2,z:11.8,rx:0,ry:Math.PI/2});
const eastWall=box(0.3,HALL_CEIL-HALL_Y,23.6,mWallHall,36.15,(HALL_CEIL+HALL_Y)/2,11.8);
box(0.3,ZC,15.8,mWall,-0.15,ZC/2,31.5); surf(15.8,ZC,tWallZ,{roughness:.6},{x:0.005,y:ZC/2,z:31.5,rx:0,ry:Math.PI/2});
// east lobby walls (north/east) – toggled with ceiling
const lobbyW=new THREE.Group();scene.add(lobbyW);
// CAD 1층 평면도 + 10/12 사진: 엘리베이터 코어(짧은 벽) · 비상구 통로 · 계단실 · 동쪽 로비
const coreG=new THREE.Group();scene.add(coreG);
const sideStone=(w,d,x,z)=>{box(w,ZC,d,mWall,x,ZC/2,z,coreG)};
sideStone(3.8,5.9,35.2,24.85);                       // 엘리베이터 코어 x 33.3–37.1 · z 21.9–27.8
surf(3.8,ZC,tWallZ,{roughness:.6,emissive:0xffffff,emissiveMap:tWallZ,emissiveIntensity:.25},{x:35.2,y:ZC/2,z:27.81,rx:0,parent:coreG});
surf(5.9,ZC,tWallZ,{roughness:.6},{x:37.11,y:ZC/2,z:24.85,rx:0,ry:Math.PI/2,parent:coreG});
for(const z of [23.4,25.4]){box(0.04,2.2,1.1,M(0xb8bcc6,{metalness:.7,roughness:.3}),37.13,1.1,z,coreG)}  // 엘리베이터 문
sideStone(4.15,8.0,42.875,23.8);                     // 계단실 x 40.8–44.95 · z 19.8–27.8
surf(4.15,ZC,tWallZ,{roughness:.6,emissive:0xffffff,emissiveMap:tWallZ,emissiveIntensity:.25},{x:42.875,y:ZC/2,z:27.81,rx:0,parent:coreG});
surf(8.0,ZC,tWallZ,{roughness:.6},{x:40.79,y:ZC/2,z:23.8,rx:0,ry:-Math.PI/2,parent:coreG});
box(1.4,2.3,0.05,M(0xc9c6bd,{roughness:.5}),41.9,1.15,27.83,coreG);  // 계단실 문
box(3.7,ZC,0.2,mWall,38.95,ZC/2,21.8,coreG);         // 비상구 통로 끝
box(1.8,2.4,0.06,new THREE.MeshPhysicalMaterial({color:0xdfeef4,transparent:true,opacity:.55,roughness:.05}),38.95,1.2,21.92,coreG);  // 선큰가든 유리문
box(5.70,ZC,0.3,mWall,47.800,ZC/2,27.95,lobbyW); surf(5.70,ZC,tWallZ,{roughness:.6,emissive:0xffffff,emissiveMap:tWallZ,emissiveIntensity:.25},{x:47.800,y:ZC/2,z:28.11,rx:0,parent:lobbyW});
box(0.3,ZC,11.6,mWall,50.65,ZC/2,33.6,lobbyW); surf(11.6,ZC,tWallZ,{roughness:.6,emissive:0xffffff,emissiveMap:tWallZ,emissiveIntensity:.35},{x:50.49,y:ZC/2,z:33.6,rx:0,ry:-Math.PI/2,parent:lobbyW});
// glass south facade
const glass=new THREE.Mesh(new THREE.PlaneGeometry(50.65,ZC),new THREE.MeshPhysicalMaterial({color:0xcfe3ea,transparent:true,opacity:.28,roughness:.05}));
glass.position.set(25.325,ZC/2,39.4); scene.add(glass);
const mull=new THREE.Group();scene.add(mull);for(let x=0;x<=50.6;x+=1.5) box(0.06,ZC,0.08,M(0x3a3d46),x,ZC/2,39.4,mull);
const trees=new THREE.Group(); scene.add(trees);
for(let i=0;i<16;i++){const x=1.5+i*3.1, s=1+((i*37)%5)/6; cyl(0.12,2.6,M(0x6b5237),x,1.3,42.5,12,trees); const f=new THREE.Mesh(new THREE.SphereGeometry(1.5*s,16,12),M(0x5d8f4e));f.position.set(x,3.2+s*.4,42.5);f.castShadow=true;trees.add(f)}
box(56,0.1,6,M(0x9bb07e),25,-0.2,42.5,trees);
// ceilings (perforated panels + black linear slots / dark hall ceiling with downlights)
const ceil=new THREE.Group(); scene.add(ceil);
const tCz=ceilTex({base:0xe6e6e3}), tCh=ceilTex({base:0x9c9ea2,slot:true,dots:true});  // 10/12 사진: 부스존 흰 타공 천장 · 메인홀 밝은 회색 메탈 천장 + 검정 라인 조명
const cOpt={roughness:.9,emissive:0xffffff,emissiveIntensity:.62};
[[21.8,13,10.9,32.9],[21.55,13,39.875,32.9],[7.3,5.7,25.45,29.25],[7.3,3.3,25.45,37.75]].forEach(([w,d,x,z])=>{const m=surf(w,d,tCz,Object.assign({emissiveMap:tCz},cOpt),{x,y:ZC,z,rx:Math.PI/2,parent:ceil,shadow:false});});
[[3.7,5.9,38.95,24.85]].forEach(([w,d,x,z])=>surf(w,d,tCz,Object.assign({emissiveMap:tCz},cOpt),{x,y:ZC,z,rx:Math.PI/2,parent:ceil,shadow:false}));
surf(36,26.4,tCh,{roughness:.9,emissive:0xffffff,emissiveMap:tCh,emissiveIntensity:.45},{x:18,y:HALL_CEIL,z:13.2,rx:Math.PI/2,parent:ceil,shadow:false});
// columns (matte white plaster)
const colX=[5.88,11.94,17.94,23.94,29.94];
colX.forEach(x=>{[30.2,38.0].forEach(z=>cyl(0.5,ZC,mCol,x,ZC/2,z,40));cyl(0.5,HALL_CEIL-HALL_Y,mCol,x,(HALL_CEIL+HALL_Y)/2,22.4,40)});
[35.94,41.94,47.94].forEach(x=>[30.2,38.0].forEach(z=>cyl(0.48,ZC,mCol,x,ZC/2,z,40)));  // 로비 기둥 (CAD · 사진 확인, 지름 960)
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
// ---------- 파이텍스 보양 (그레이, 부스열 단위 띠 · 부스 백월·도장 테이블·사업장 전시월이 위에 올라감) ----------
const PT=0.008;
const PYTEX=[ // [x0,x1,z0,z1] (m)
  [0.6,17.3,30.02,31.52],   // 북측 열 01~06 (폭 1.5m)
  [12.6,17.3,28.9,30.02],   // 사업장 부스 A·B (01·02 뒤 북향)
  [0.0,1.5,31.1,35.7],      // 서측 07·08 (소화전 앞 비움)
  [0.6,17.3,36.68,38.18],   // 남측 열 09~14
  [19.8,21.3,31.7,36.3]];   // 2층 계단 아래 15·16
{const mP=M(0x6c6f77,{roughness:1});PYTEX.forEach(([x0,x1,z0,z1])=>{const m=box(x1-x0,PT,z1-z0,mP,(x0+x1)/2,PT/2,(z0+z1)/2);m.castShadow=false})}
// ---------- booth (CA별 월 템플릿 시안 적용) ----------
const mTable=M(0xfafafa,{roughness:.35}), mFrame=M(0xe9e9ee,{roughness:.5});
function booth({x,z,rot,no,img,biz=false,standby=false,W=1.2,H=2.1,side=1}){
  const g=new THREE.Group();g.position.set(x,PT,z);g.rotation.y=rot;scene.add(g);
  box(W,H,0.12,mFrame,0,H/2,0,g);
  const face=new THREE.Mesh(new THREE.PlaneGeometry(W-0.02,H-0.03),new THREE.MeshStandardMaterial({map:tex(img),roughness:.6,envMapIntensity:.3}));face.position.set(0,H/2,0.065);g.add(face);
  box(Math.min(W*0.45,0.9),0.04,0.35,mFrame,0,0.02,-0.12,g);
  if(!biz){ // 도장 테이블: 백월 옆 (백월 하단을 가리지 않도록)
    const tx=side*(W/2+0.4);box(0.6,0.72,0.6,mTable,tx,0.36,0.36,g);box(0.64,0.03,0.64,mTable,tx,0.735,0.36,g);
    box(0.09,0.06,0.09,M(0x2a3170),tx-0.1,0.78,0.3,g);box(0.12,0.02,0.09,M(0xc9414b),tx+0.12,0.76,0.32,g);}
  if(standby){const s=new THREE.Group();s.position.set(side*(W/2+0.4),0,0.95);g.add(s);
    cyl(0.24,0.04,M(0xe2e2e6),0,0.02,0,24,s);cyl(0.03,1.0,M(0xd0d0d6,{metalness:.6,roughness:.3}),0,0.52,0,12,s);
    box(0.63,0.38,0.04,mDark,0,1.15,0.03,s);const sc=new THREE.Mesh(new THREE.PlaneGeometry(0.6,0.35),new THREE.MeshBasicMaterial({color:0x4f67ff}));sc.position.set(0,1.15,0.052);s.add(sc)}
  const tag=label(no,{x:0,y:0,z:0,size:0.55,bg:biz?"#c9414b":"#2a3170",fs:48,area:false});scene.remove(tag);tag.material.depthTest=true;tag.position.set(0,H+0.35,0.1);g.add(tag);
  return g}
// ㅁ자 배치 – 기둥 사이 2개씩, 도장 테이블은 백월 바깥쪽 옆: 북 01-06(동→서) · 서 07-08 · 남 09-14(서→동) · 계단 서측 끝 15-16
const PC=[2.94,8.91,14.94];
const RX=[];PC.forEach(c=>{RX.push(c-0.8,c+0.8)});           // 2.14,3.74,8.11,9.71,14.14,15.74
const SB=new Set([1,2,3,5,7,8,9,10,11,12,15,16]); /* 10/23 고객사 조직별 표 기준 12대 – 미사용: 04 램프 · 06 영업 · 13 반도체 · 14 FTCI */const nn=i=>String(i).padStart(2,"0");
const mk=(i,o)=>booth(Object.assign({no:nn(i),img:A["ca"+nn(i)],standby:SB.has(i)},o));
// 북측(남향): 바깥쪽 = 쌍 중심에서 먼 쪽. 남향 rot0 → local +x = 동쪽
[...RX].reverse().forEach((x,i)=>{const c=PC[Math.floor((5-i)/2)];mk(i+1,{x,z:30.32,rot:0,side:x>c?1:-1})});
// 서측(동향) rot π/2 → local +x = 북쪽(-z)
mk(7,{x:0.06,z:32.6,rot:Math.PI/2,side:1}); mk(8,{x:0.06,z:34.2,rot:Math.PI/2,side:-1});
// 소화전 (실측: 서측 벽 · 남서 모서리→북쪽 2.9m · 900×1,740 · 오른쪽 개방) – 앞 0.9m 비움
{const hz=39.4-2.9;box(0.02,1.74,0.9,M(0x8a8c8f,{roughness:.6}),0.011,0.87,hz);box(0.015,0.12,0.2,M(0xd0313b),0.02,1.35,hz);cyl(0.06,0.02,M(0xd0313b),0.02,1.62,hz-0.2,20).rotation.z=Math.PI/2;label("소화전",{x:0.5,y:2.1,z:hz,size:0.4,bg:"#c9414b",area:false})} // 벽 마감과 같은 석재 문 + 빨간 표지
// 남측(북향) rot π → local +x = 서쪽
RX.forEach((x,i)=>{const c=PC[Math.floor(i/2)];mk(i+9,{x,z:37.88,rot:Math.PI,side:x>c?-1:1})});
// 2층 계단 아래(서향, 하부 높이 실측 2.4m) rot −π/2 → local +x = 남쪽 · 부스존 동쪽 약 5m는 진출입구로 비움
mk(15,{x:21.0,z:34.9,rot:-Math.PI/2,side:1}); mk(16,{x:21.0,z:33.3,rot:-Math.PI/2,side:-1});
label("15·16 (2층 계단 아래 · 하부 2.4m)",{x:21.0,y:0.6,z:34.1,size:0.45,bg:"#2a3170"});
label("진출입구 약 3.9m",{x:18.9,y:0.4,z:34.1,size:0.42,bg:"#e8612c"});
// 사업장 부스 2개 – 01·02번 뒤에 등을 맞대고 북향(메인홀 계단 쪽)
const bizG=[booth({x:15.74,z:30.05,rot:Math.PI,no:"A",img:A.bizA,biz:true,W:1.6,H:2.1}),booth({x:14.14,z:30.05,rot:Math.PI,no:"B",img:A.bizB,biz:true,W:1.6,H:2.1})]; /* 10/14 사업장월 1,600×2,100 */
[[13.0,29.35],[16.88,29.35]].forEach(([x,z])=>{box(0.6,0.72,0.6,mTable,x,0.36+PT,z);box(0.64,0.03,0.64,mTable,x,0.735+PT,z);box(0.12,0.02,0.09,M(0xc9414b),x,0.76+PT,z)});
// ---------- 플레이존 2구역 · 게임별 1세트 (북측, 계단 위) ----------
function zone(x0,x1,z0,z1){const m=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,z1-z0),new THREE.MeshStandardMaterial({color:0xc7d1fb,transparent:true,opacity:.42}));m.rotation.x=-Math.PI/2;m.position.set((x0+x1)/2,0.012,(z0+z1)/2);m.receiveShadow=true;scene.add(m)}
function xbanImg(x,z,rot,img,par){const grp=new THREE.Group();grp.position.set(x,0,z);grp.rotation.y=rot;(par||scene).add(grp);
  const p=new THREE.Mesh(new THREE.PlaneGeometry(0.6,1.8),new THREE.MeshStandardMaterial({map:tex(img),roughness:.7,side:THREE.DoubleSide,envMapIntensity:.3}));p.position.set(0,1.0,0);p.castShadow=true;grp.add(p);
  [[-0.3,0],[0.3,0]].forEach(([dx])=>{const l=new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.008,1.0,6),M(0x777b88));l.position.set(dx,0.45,-0.12);l.rotation.x=0.25;grp.add(l)});return grp}
function xbanner(x,z,rot,lines,bg="#2a3170"){const c=document.createElement("canvas");c.width=300;c.height=900;const g=c.getContext("2d");
  const gr=g.createLinearGradient(0,0,0,900);gr.addColorStop(0,"#e9e6f6");gr.addColorStop(1,"#c9c6e2");g.fillStyle=gr;g.fillRect(0,0,300,900);
  g.fillStyle=bg;g.fillRect(0,0,300,120);g.fillStyle="#fff";g.font=`800 34px ${FONT}`;g.textAlign="center";g.fillText(lines[0],150,75);
  g.fillStyle=bg;g.font=`900 44px ${FONT}`;lines.slice(1).forEach((t,i)=>g.fillText(t,150,230+i*64));
  g.fillStyle="#1e2761";g.beginPath();g.roundRect(55,560,190,120,14);g.fill();g.fillStyle="#c9c6e2";g.beginPath();g.arc(110,620,26,0,7);g.fill();g.beginPath();g.arc(190,620,26,0,7);g.fill();
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const grp=new THREE.Group();grp.position.set(x,0,z);grp.rotation.y=rot;scene.add(grp);
  const p=new THREE.Mesh(new THREE.PlaneGeometry(0.6,1.8),new THREE.MeshStandardMaterial({map:t,roughness:.7,side:THREE.DoubleSide}));p.position.set(0,1.0,0);p.castShadow=true;grp.add(p);
  [[-0.3,0],[0.3,0]].forEach(([dx])=>{const l=new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.008,1.0,6),M(0x777b88));l.position.set(dx,0.45,-0.12);l.rotation.x=0.25;grp.add(l)});return grp}
// 게임별 1세트 (실측 A1 3.5m: 계단 앞 1.2m 통로 z 26.4–27.6 + 게임 구역 1.9m · A2 11.5m 안)
zone(0.4,5.0,27.6,29.5); zone(5.4,9.6,27.6,29.5);
// ① 홀인원 퍼팅 ×2: 매트 3.0×0.6 일렬, 동→서 퍼팅 (P1 컵 쪽은 서측 벽이 백스톱, P2 서측 끝 볼 스토퍼)
{const mMat=M(0x3baa6b,{roughness:.9}),mHole=M(0x1f4f36),mFlag=new THREE.MeshStandardMaterial({color:0xe5484d,side:THREE.DoubleSide});
 [[1.2,4.2]].forEach(([x0,x1],k)=>{const cx=(x0+x1)/2,cz=28.2,hx=x0+0.25;
  box(3.0,0.03,0.6,mMat,cx,0.015,cz);cyl(0.06,0.004,mHole,hx,0.032,cz,20);cyl(0.006,0.5,M(0x888888),hx,0.27,cz,6);
  const f=new THREE.Mesh(new THREE.PlaneGeometry(0.22,0.14),mFlag);f.position.set(hx+0.11,0.45,cz);scene.add(f);
  box(0.06,0.08,0.6,M(0x2a3170),x0-0.03,0.04,cz); // 볼 스토퍼
  [x1-0.35,x1-0.25].forEach((x,i)=>cyl(0.021,0.042,M(0xffffff),x,0.05,cz-0.06+i*0.12,16));
  })}
[[4.65,29.15],[9.25,29.15]].forEach(([x,z])=>{box(0.6,0.72,0.5,mTable,x,0.36,z);box(0.64,0.03,0.54,mTable,x,0.735,z)}); // 게임별 명단·상품 데스크
// ② 100g 맞히기 ×2: 테이블 1200×600 + 저울 + 바둑알통
[7.5].forEach((x,k)=>{box(1.2,0.72,0.6,mTable,x,0.36,28.25);box(1.24,0.03,0.64,mTable,x,0.735,28.25);
  box(0.18,0.03,0.14,M(0xe2e2e6,{metalness:.4}),x+0.25,0.77,28.2);cyl(0.07,0.06,M(0x222228),x-0.25,0.78,28.2,20);cyl(0.04,0.08,M(0xf2f2f2),x,0.79,28.35,16);
  });
xbanImg(0.75,27.85,Math.PI,A.xb_g1); xbanImg(5.75,27.85,Math.PI,A.xb_g2); // B11 · B12 게임 설명 X배너 (북향, 계단 쪽)
// 실내 동선 X배너 B6~B10 (B8 아카이브월 미설치) (10/20 시안 · 600×1,800)
xbanImg(37.3,36.2,0,A.xb_guide);   // B6 행사장 안내 – 정문 들어와 왼쪽 앞 (남향)
xbanImg(41.6,33.4,0,A.xb_recep);   // B7 리셉션 – 데스크 서쪽 (남향)
xbanImg(31.6,37.0,Math.PI/2,A.xb_org); // B9 조직별 활동전시 – 남측 통로 (동향)
xbanImg(31.0,28.9,Math.PI/2,A.xb_biz); // B10 사업장 활동전시 – 북측 통로 (동향)
label("① 홀인원 퍼팅",{x:2.7,y:1.9,z:28.2,size:0.5,bg:"#3BAA6B"}); label("② 100g 맞히기",{x:7.5,y:1.9,z:28.2,size:0.5,bg:"#3BAA6B"});
// ---------- 오픈 전: 차단봉으로만 구역 통제 (사업장 부스 포함, 15·16 앞마당까지 감쌈) ----------
const pre=new THREE.Group();scene.add(pre);pre.visible=false;
const mPost=M(0x9a9ea8,{metalness:.7,roughness:.3}),mPole=M(0xb8bcc6,{metalness:.8,roughness:.25}),mBelt=M(0x2a3170);
function stanchions(x0,z0,x1,z1){const L=Math.hypot(x1-x0,z1-z0),n=Math.max(2,Math.round(L/1.4)+1);
  for(let i=0;i<n;i++){const t=i/(n-1),x=x0+(x1-x0)*t,z=z0+(z1-z0)*t;cyl(0.16,0.03,mPost,x,0.015,z,20,pre);cyl(0.025,0.95,mPole,x,0.5,z,10,pre)}
  const b=box(0.03,0.05,L,mBelt,(x0+x1)/2,0.9,(z0+z1)/2,pre);b.rotation.y=Math.atan2(x1-x0,z1-z0)}
[[18.05,26.6,18.05,29.6],[18.05,30.8,18.05,31.85],[18.05,31.85,21.8,31.85],[21.8,31.85,21.8,36.3],[21.8,36.3,18.05,36.3],[18.05,36.3,18.05,37.4],[18.05,38.6,18.05,39.25]].forEach(a=>stanchions(...a));
pre.add(label("차단봉 라인 (10:05 해제)",{x:21.9,y:2.9,z:31.85,size:0.55,bg:"#2a3170",area:false}));
// archive wall (honeycomb, faces south)
const arc=new THREE.Group();arc.position.set(35.94,0,31.05);scene.add(arc);  // 엘리베이터 코어 앞 기둥 바로 앞 · 남향
box(4.0,2.2,0.3,M(0xf2efe8),0,1.1,0,arc);
const af=new THREE.Mesh(new THREE.PlaneGeometry(4.0,2.2),new THREE.MeshStandardMaterial({map:tex(A.arc),roughness:.75,envMapIntensity:.3}));af.position.set(0,1.1,0.155);arc.add(af);
// VOID stair
const rail=new THREE.MeshPhysicalMaterial({color:0xcfe3ea,transparent:true,opacity:.35});
{const n=26, x1=29.94-0.3, x0=x1-11.7, top=2.4*11.7/(x1-21.0)+0.15, /* 실측 B3·B4·C1 */ run=(x1-x0)/n, r=top/n, mSt=M(0xcfccc4,{roughness:.5}), mStr=M(0x26272c,{roughness:.5,metalness:.4});  /* 10/12 사진: 검정 철골 오픈 계단 */
 for(let i=0;i<n;i++){const h=r*(i+1);box(run+0.02,0.06,3.6,mSt,x1-run*i-run/2,h-0.03,34.1)}
 {const L=Math.hypot(x1-x0,top),ang=-Math.atan2(top,x1-x0);[33.0,34.1,35.2].forEach(z=>{const b=new THREE.Mesh(new THREE.BoxGeometry(L,0.4,0.18),mStr);b.position.set((x0+x1)/2,top/2-0.3,z);b.rotation.z=ang;b.castShadow=true;scene.add(b)})}
 const L=Math.hypot(x1-x0,top), ang=-Math.atan2(top,x1-x0);
 [32.25,35.95].forEach(z=>{const s=new THREE.Mesh(new THREE.BoxGeometry(L,0.55,0.14),mStr);s.position.set((x0+x1)/2,top/2-0.2,z);s.rotation.z=ang;s.castShadow=true;scene.add(s);
   const g=new THREE.Mesh(new THREE.BoxGeometry(L,0.95,0.03),rail);g.position.set((x0+x1)/2,top/2+0.5,z);g.rotation.z=ang;scene.add(g);
   const h=new THREE.Mesh(new THREE.BoxGeometry(L,0.05,0.07),M(0x1d1e22,{metalness:.5,roughness:.4}));h.position.set((x0+x1)/2,top/2+1.0,z);h.rotation.z=ang;scene.add(h)});}
// reception (east lobby, faces south) – 키비주얼 기반 시안
{box(4.0,2.2,0.3,M(0x2a3170),44.7,1.1,31.05);  // 계단실 문 동쪽 · 남향
 const f=new THREE.Mesh(new THREE.PlaneGeometry(3.98,2.18),new THREE.MeshStandardMaterial({map:tex(A.recep_wall),roughness:.6,envMapIntensity:.3}));f.position.set(44.7,1.1,31.21);scene.add(f);
 // 안내데스크: 듀라테이블 1800×600×720 × 2 (총 3.6m) + 남색 테이블보 (바닥까지 덮음, 래핑 없음)
 {const c=document.createElement("canvas");c.width=512;c.height=128;const g=c.getContext("2d");g.fillStyle="#1f2660";g.fillRect(0,0,512,128);
  for(let x=0;x<512;x+=64){const gr=g.createLinearGradient(x,0,x+64,0);gr.addColorStop(0,"rgba(0,0,0,.07)");gr.addColorStop(.5,"rgba(255,255,255,.04)");gr.addColorStop(1,"rgba(0,0,0,.07)");g.fillStyle=gr;g.fillRect(x,6,64,122)}
  g.fillStyle="rgba(255,255,255,.06)";g.fillRect(0,0,512,6);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=THREE.RepeatWrapping;t.repeat.set(2,1);
  const mC=new THREE.MeshStandardMaterial({map:t,roughness:.95}), mTop=M(0x232a63,{roughness:.95});
  const cl=new THREE.Mesh(new THREE.BoxGeometry(3.64,0.735,0.66),[mC,mC,mTop,mTop,mC,mC]);cl.position.set(44.7,0.3675,32.55);cl.castShadow=cl.receiveShadow=true;scene.add(cl);
  const seam=box(0.004,0.005,0.66,M(0x1a2050),44.7,0.737,32.55);}
 [43.5,44.7,45.900000000000006].forEach(x=>{const ch=new THREE.Group();ch.position.set(x,0,31.85);scene.add(ch);box(0.45,0.05,0.45,M(0x3a3e4a),0,0.45,0,ch);cyl(0.03,0.43,M(0x9a9ea8,{metalness:.7,roughness:.3}),0,0.215,0,8,ch)});
 // pamphlet stacks on desk
 [43.7,45.6].forEach(x=>box(0.21,0.03,0.30,M(0xc9c6d7),x,0.75,32.5));
}
// ---------- main hall ----------
const led=new THREE.Mesh(new THREE.PlaneGeometry(20,3.0),new THREE.MeshBasicMaterial({map:tex(A.led)}));led.position.set(18,HALL_Y+0.2+1.5,0.27);scene.add(led);
box(20.3,3.3,0.25,mDark,18,HALL_Y+1.65,0.12);
// 콘솔 · 케이터링: 메인홀 우측(동측) 벽면 (고객사 요청 · 작년 위치)
{for(const z of [1.0,2.4]){  /* 북쪽 벽에 붙임 */box(0.75,0.74,1.5,M(0x2b2e38),35.4,HALL_Y+0.37,z);box(0.5,0.12,0.9,M(0x15161b),35.35,HALL_Y+0.80,z)}
 box(0.3,0.4,0.3,M(0x15161b),35.3,HALL_Y+0.94,2.4);
 label("음향·송출 콘솔",{x:35.0,y:HALL_Y+2.2,z:1.7,size:0.6,bg:"#3a3f55"});
 const mCat=M(0xf2efe8,{roughness:.8});for(const z of [13.2,15.0,16.8,18.6,20.4]){box(0.7,0.74,1.8,mCat,35.4,HALL_Y+0.37,z)}  /* 1800 × 5 = 9.0m */
 label("다과",{x:35.0,y:HALL_Y+2.2,z:16.8,size:0.6,bg:"#b86a00"})}
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
const tables=[];const TX=[4,8.5,13,17.5,22,26.5,31];TX.slice(0,6).forEach(x=>tables.push([x,6]));TX.slice(0,6).forEach(x=>tables.push([x+2.1,11]));TX.forEach(x=>tables.push([x,16]));  // 10/22 고객사 배치: 1~6 · 7~12(지그재그) · 13~19
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
label("메인홀",{x:18,y:HALL_Y+3.4,z:13,size:1.6,bg:DK});
label("부스존",{x:9.2,y:3.9,z:34,size:1.6,bg:DK});
label("계단",{x:9,y:1.3,z:24.65,size:1.0,bg:"rgba(255,255,255,.92)",fg:"#1d2233"});
label("아카이브월",{x:35.94,y:2.75,z:31.3,size:1.0,bg:"#b86a00"});
label("2층 계단",{x:24.3,y:5.2,z:34.1,size:1.0,bg:"rgba(255,255,255,.92)",fg:"#1d2233"});
label("LED 월",{x:18,y:HALL_Y+3.6,z:0.8,size:1.1,bg:"#2e3ed2"});
label("메인홀 통로",{x:32.3,y:1.4,z:28.2,size:0.8,bg:"rgba(255,255,255,.92)",fg:"#1d2233"});
label("사업장",{x:14.94,y:3.4,z:29.4,size:1.0,bg:"#c9414b"});
label("플레이존",{x:5.0,y:2.7,z:27.6,size:0.9,bg:"#3BAA6B"});
label("리셉션",{x:44.7,y:2.9,z:31.4,size:1.0,bg:"#2e3ed2"});
// ---------- views ----------
const VIEWS={
  bird:{p:[47,28,55],t:[21,-1,23],ceil:false},
  booth:{p:[17.2,1.65,34.0],t:[2,1.2,34.0],ceil:true},
  hall:{p:[21,1.75,26.0],t:[15,0.2,4],ceil:true},
  detail:{p:[11.6,1.7,35.4],t:[9.2,1.0,30.6],ceil:true},
  recep:{p:[39.4,1.7,38.9],t:[41.6,1.2,30.6],ceil:true},
  play:{p:[10.8,2.8,24.5],t:[4.6,0.3,28.6],ceil:false},
  biz:{p:[21.5,2.4,25.2],t:[14.9,1.0,30.0],ceil:false},
  arc:{p:[36.6,1.65,36.2],t:[36.2,1.1,31.0],ceil:true},
  sign:{p:[41.5,1.7,38.7],t:[27,1.0,32.5],ceil:true},
  entry:{p:[20.6,1.75,28.4],t:[17.6,0.9,35.6],ceil:true},
  pre:{p:[27.5,5.5,22.0],t:[13.5,0.0,32.0],ceil:false,pre:true}};
let ceilOn=false;const tc=document.getElementById("t-ceil");
function setCeil(v){ceilOn=v;ceil.visible=v;eastWall.visible=v;lobbyW.visible=v;areaLabels.forEach(s=>s.visible=!v);trees.visible=v;glass.visible=v;mull.visible=v;tc.setAttribute("aria-pressed",String(v));tc.textContent=v?"천장 숨기기":"천장 보기"}
const tp=document.getElementById("t-pre");
function setPre(v){pre.visible=v;tp.setAttribute("aria-pressed",String(v));tp.textContent=v?"오픈 후 보기":"오픈 전 차단 보기"}
tp.addEventListener("click",()=>setPre(!pre.visible));
function go(name){const v=VIEWS[name];camera.position.set(...v.p);controls.target.set(...v.t);setCeil(v.ceil);setPre(!!v.pre);
  document.querySelectorAll(".views button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.v===name)));controls.update()}
document.querySelectorAll(".views button").forEach(b=>b.addEventListener("click",()=>go(b.dataset.v)));
tc.addEventListener("click",()=>setCeil(!ceilOn));
function resize(){const r=stage.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()}
new ResizeObserver(resize).observe(stage);resize();
const start=shot?location.hash.slice(6):"bird";go(VIEWS[start]?start:"bird");
renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera)});
window.__cam=c=>{camera.position.set(c[0],c[1],c[2]);controls.target.set(c[3],c[4],c[5]);controls.update()};
window.__ready=true;
