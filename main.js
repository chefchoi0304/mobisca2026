// 비전홀 3D 목업 – three.js 0.160.0
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
const LED_SRC="./assets/led.jpg", ARC_SRC="./assets/archive.jpg";
const stage=document.getElementById("stage");
const shot=location.hash.startsWith("#shot");
if(shot) document.body.classList.add("shot");
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.05;
stage.prepend(renderer.domElement);
const scene=new THREE.Scene(); scene.background=new THREE.Color(0xdfe3ee);
const camera=new THREE.PerspectiveCamera(45,1,0.1,400);
const controls=new OrbitControls(camera,renderer.domElement); controls.enableDamping=true;
scene.add(new THREE.HemisphereLight(0xffffff,0x8a8f9e,1.35));
const sun=new THREE.DirectionalLight(0xffffff,1.6); sun.position.set(30,40,60); sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048); Object.assign(sun.shadow.camera,{left:-35,right:35,top:30,bottom:-30,near:1,far:160});
sun.target.position.set(18,0,24); scene.add(sun,sun.target);
const M=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.8,metalness:0},o));
function box(w,h,d,mat,x,y,z,parent=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m}
function cyl(r,h,mat,x,y,z,seg=28,parent=scene){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,seg),mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m}
const FONT='"Noto Sans KR","Noto Sans CJK KR","Apple SD Gothic Neo",sans-serif';
try{await Promise.race([Promise.all([document.fonts.load('900 40px "Noto Sans KR"'),document.fonts.load('500 40px "Noto Sans KR"')]),new Promise(r=>setTimeout(r,2500))])}catch(e){}
const texLoader=new THREE.TextureLoader();
const tex=src=>{const t=texLoader.load(src);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t};
// ---------- levels ----------
const HALL_Y=-1.03, ZC=3.3, HALL_CEIL=HALL_Y+5.0;
const mStoneHall=M(0xd9d2c6,{roughness:.55}), mStoneZone=M(0x9fa3aa,{roughness:.6}), mWood=M(0xb98a5c,{roughness:.6});
const mWall=M(0x8d9098), mWallHall=M(0x6f7078), mCol=M(0xf1efe9,{roughness:.4}), mDark=M(0x1f2230);
box(36,0.2,23.6,mStoneHall,18,HALL_Y-0.1,11.8);                        // hall floor
box(44,0.2,13.0,mStoneZone,22,-0.1,32.9);                             // booth zone + lobby floor
box(8,0.2,2.8,mStoneZone,40,-0.1,25.0);                               // lobby north strip
const steps=6, rise=1.03/steps, run=2.8/steps;
for(let i=0;i<steps;i++){const top=HALL_Y+rise*(i+1);box(30.9,top-HALL_Y,run,mWood,17.75,HALL_Y+(top-HALL_Y)/2,23.6+run*i+run/2)}
box(2.3,1.03,2.8,mWall,1.15,HALL_Y+0.515,25.0); box(2.8,1.03,2.8,mWall,34.6,HALL_Y+0.515,25.0);
// walls
box(36.4,HALL_CEIL-HALL_Y,0.3,mWallHall,18,(HALL_CEIL+HALL_Y)/2,-0.15);           // hall north
box(0.3,HALL_CEIL-HALL_Y,23.6,mWallHall,-0.15,(HALL_CEIL+HALL_Y)/2,11.8);          // hall west (LED)
const eastWall=box(0.3,HALL_CEIL-HALL_Y,23.6,mWallHall,36.15,(HALL_CEIL+HALL_Y)/2,11.8);
box(0.3,ZC,15.8,mWall,-0.15,ZC/2,31.5);                                           // zone west
// glass south facade
const glass=new THREE.Mesh(new THREE.PlaneGeometry(44,ZC),new THREE.MeshPhysicalMaterial({color:0xcfe3ea,transparent:true,opacity:.28,roughness:.05}));
glass.position.set(22,ZC/2,39.4); scene.add(glass);
const mull=new THREE.Group();scene.add(mull);for(let x=0;x<=44;x+=1.5) box(0.06,ZC,0.08,M(0x3a3d46),x,ZC/2,39.4,mull);
const trees=new THREE.Group(); scene.add(trees);
for(let i=0;i<14;i++){const x=1.5+i*3.1, s=1+((i*37)%5)/6; cyl(0.12,2.6,M(0x6b5237),x,1.3,42.5,12,trees); const f=new THREE.Mesh(new THREE.SphereGeometry(1.5*s,16,12),M(0x5d8f4e));f.position.set(x,3.2+s*.4,42.5);f.castShadow=true;trees.add(f)}
box(48,0.1,6,M(0x9bb07e),22,-0.2,42.5,trees);
// ceilings
const ceil=new THREE.Group(); scene.add(ceil);
const mC=M(0x9a9ea8,{emissive:0x55585f});
box(21.8,0.15,13,mC,10.9,ZC+0.07,32.9,ceil); box(14.9,0.15,13,mC,36.55,ZC+0.07,32.9,ceil);
box(7.3,0.15,5.7,mC,25.45,ZC+0.07,29.25,ceil); box(7.3,0.15,3.3,mC,25.45,ZC+0.07,37.75,ceil); box(36,0.2,26.4,M(0x6a6d76,{emissive:0x3a3c43}),18,HALL_CEIL+0.1,13.2,ceil);
ceil.children.forEach(m=>{m.castShadow=false;m.receiveShadow=false});
// columns
const colX=[5.88,11.94,17.94,23.94,29.94];
colX.forEach(x=>{[30.2,38.0].forEach(z=>cyl(0.5,ZC,mCol,x,ZC/2,z));cyl(0.5,HALL_CEIL-HALL_Y,mCol,x,(HALL_CEIL+HALL_Y)/2,22.4)});
// ---------- labels ----------
const areaLabels=[];
function label(text,{x,y,z,size=1,bg="#2e3ed2",fg="#fff",pad=18,fs=44,round=true,area=true}){
  const c=document.createElement("canvas"),g=c.getContext("2d");g.font=`700 ${fs}px ${FONT}`;
  const w=Math.ceil(g.measureText(text).width)+pad*2,h=fs+pad*1.3;c.width=w;c.height=h;
  g.font=`700 ${fs}px ${FONT}`;g.fillStyle=bg;const r=round?h/2:8;g.beginPath();g.roundRect(0,0,w,h,r);g.fill();
  g.fillStyle=fg;g.textBaseline="middle";g.fillText(text,pad,h/2+2);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false,transparent:true}));s.renderOrder=10;
  s.scale.set(size*w/h*0.75,size*0.75,1);s.position.set(x,y,z);scene.add(s);if(area)areaLabels.push(s);return s}
// ---------- booth panel texture ----------
const IDX=[["자연을 지키자! 한강 정화 활동","전장BU"],["미호종개야 돌아와! 미호강 복원","전동화BU"],["비 오는 날도 안전하게, 투명우산 나눔","모듈BU"],["우리 동네 꼬마소방관, 소화전 새 단장","샤시안전BU"],["함께라서 행복해, 장애아동 가족여행","서비스부품BU"],["첫 안전 수업, 종합안전체험랜드","연구개발"],["옛것을 지켜요, 국가유산 기름칠 봉사","품질"],["나무 한 그루의 약속, 습지 가꾸기","생산"],["마음을 모아요, 플러스알파 모금","구매"],["이웃과 함께한 명절, 결연기관 나눔","재무"],["점심 한 끼로 가까워진 소통 토크","인사"],["내 재능으로 돕는 자기주도 봉사","경영전략"],["걷고 웃고! 사내 걷기 챌린지","IT"],["고마운 마음 전해요, 감사 릴레이","영업"],["서로를 배우는 글로벌 컬처데이","해외사업"],["안전이 먼저! 사업장 안전 캠페인","안전환경"]];
function wrap(g,text,maxW){const out=[];let line="";for(const ch of text){if(g.measureText(line+ch).width>maxW&&line){out.push(line);line=ch.trim()?ch:""}else line+=ch}if(line)out.push(line);return out}
function panelTex(no,title,div,biz,W=1.2,H=2.1){
  const c=document.createElement("canvas");c.width=480;c.height=Math.round(480*H/W);const g=c.getContext("2d");const k=c.height/840;g.save();g.scale(1,k);
  const band=biz?"#c9414b":"#2a3170";
  g.fillStyle="#f6f5fa";g.fillRect(0,0,480,840);
  g.fillStyle=band;g.fillRect(0,0,480,170);
  g.fillStyle="#fff";g.font=`900 88px ${FONT}`;g.textBaseline="middle";g.fillText(no,32,88);
  g.font=`700 34px ${FONT}`;g.textAlign="right";g.fillText(div,452,92);g.textAlign="left";
  g.fillStyle="#1d2233";g.font=`900 38px ${FONT}`;wrap(g,title,410).slice(0,3).forEach((l,i)=>g.fillText(l,34,230+i*50));
  const cols=["#c9d0ee","#d8cfe4","#cfe0d6","#e5dccb"];
  for(let i=0;i<4;i++){g.fillStyle=cols[i];g.fillRect(34+(i%2)*212,390+Math.floor(i/2)*170,196,150)}
  g.fillStyle="#6b7089";g.font=`500 24px ${FONT}`;g.fillText("활동 사진 · 성과 요약",34,740);
  g.fillStyle="#c9c6d7";g.fillRect(0,780,480,60);g.fillStyle="#2a3170";g.font=`700 24px ${FONT}`;g.fillText("2026 MOBIS CA PLAYLIST",34,810);g.restore();
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t}
// ---------- booth ----------
const mTable=M(0xfafafa,{roughness:.35}), mBack=M(0x2a3170), mFrame=M(0xe9e9ee);
function booth({x,z,rot,no,title,div,biz=false,standby=false,W=1.2,H=2.1}){
  const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;scene.add(g);
  box(W,H,0.12,mFrame,0,H/2,0,g);
  const face=new THREE.Mesh(new THREE.PlaneGeometry(W-0.02,H-0.03),new THREE.MeshStandardMaterial({map:panelTex(no,title,div,biz,W,H),roughness:.7}));face.position.set(0,H/2,0.065);g.add(face);
  box(Math.min(W*0.45,0.9),0.04,0.35,mFrame,0,0.02,-0.12,g);
  box(0.8,0.78,0.8,mTable,0,0.39,0.06+0.4+0.02,g); box(0.84,0.03,0.84,mTable,0,0.795,0.48,g);
  const zone=new THREE.Mesh(new THREE.PlaneGeometry(1.8,1.6),new THREE.MeshStandardMaterial({color:biz?0xf3c9cc:0xc7d1fb,transparent:true,opacity:.55}));zone.rotation.x=-Math.PI/2;zone.position.set(0,0.012,1.0);zone.receiveShadow=true;g.add(zone);
  if(standby){const s=new THREE.Group();s.position.set(0.85,0,0.5);g.add(s);
    cyl(0.24,0.04,M(0xe2e2e6),0,0.02,0,24,s);cyl(0.03,1.0,M(0xd0d0d6),0,0.52,0,12,s);
    box(0.63,0.38,0.04,mDark,0,1.15,0.03,s);const sc=new THREE.Mesh(new THREE.PlaneGeometry(0.6,0.35),new THREE.MeshBasicMaterial({color:0x4f67ff}));sc.position.set(0,1.15,0.052);s.add(sc)}
  const tag=label(no,{x:0,y:0,z:0,size:0.55,bg:biz?"#c9414b":"#2a3170",fs:48,area:false});scene.remove(tag);tag.material.depthTest=true;tag.position.set(0,H+0.35,0.1);g.add(tag);
  return g}
const top=[22.51,19.51,16.51,13.51,10.51,7.51], west=[29.17,31.76,34.35,37.01], bot=[7.66,10.26,13.66,16.26,19.66,22.26];
const SB=new Set([1,4,8,12,15]);
top.forEach((x,i)=>booth({x,z:27.35,rot:0,no:String(i+1).padStart(2,"0"),title:IDX[i][0],div:IDX[i][1],standby:SB.has(i+1)}));
west.forEach((z,i)=>booth({x:1.5,z,rot:Math.PI/2,no:String(i+7).padStart(2,"0"),title:IDX[i+6][0],div:IDX[i+6][1],standby:SB.has(i+7)}));
bot.forEach((x,i)=>booth({x,z:38.9,rot:Math.PI,no:String(i+11).padStart(2,"0"),title:IDX[i+10][0],div:IDX[i+10][1],standby:SB.has(i+11)}));
booth({x:21.2,z:32.6,rot:-Math.PI/2,no:"A",title:"마북·의왕연구소·역삼본사 사업장별 활동 전시",div:"사업장",biz:true,W:2.0,H:2.2});
booth({x:21.2,z:35.1,rot:-Math.PI/2,no:"B",title:"진천·창원공장·울산물류센터 사업장별 활동 전시",div:"사업장",biz:true,W:2.0,H:2.2});
// archive wall (honeycomb, faces south)
const arc=new THREE.Group();arc.position.set(27.6,0,27.25);scene.add(arc);
box(5.0,2.2,0.3,M(0xf2efe8),0,1.1,0,arc);
const af=new THREE.Mesh(new THREE.PlaneGeometry(5.0,2.2),new THREE.MeshStandardMaterial({map:tex(ARC_SRC),roughness:.8}));af.position.set(0,1.1,0.155);arc.add(af);
// lounge
const mSofa=M(0x2f323b,{roughness:.9});

// VOID
const rail=new THREE.MeshPhysicalMaterial({color:0xcfe3ea,transparent:true,opacity:.35});
{const n=22, x0=22.2, x1=29.1, top=3.9, run=(x1-x0)/n, r=top/n, mSt=M(0xd6d3cb,{roughness:.5}), mStr=M(0x7b7e86,{roughness:.4,metalness:.3});
 for(let i=0;i<n;i++){const h=r*(i+1);box(run+0.02,0.06,3.4,mSt,x1-run*i-run/2,h-0.03,34.1)}
 const L=Math.hypot(x1-x0,top), ang=-Math.atan2(top,x1-x0);
 [32.35,35.85].forEach(z=>{const s=new THREE.Mesh(new THREE.BoxGeometry(L,0.32,0.12),mStr);s.position.set((x0+x1)/2,top/2-0.12,z);s.rotation.z=ang;s.castShadow=true;scene.add(s);
   const g=new THREE.Mesh(new THREE.BoxGeometry(L,0.95,0.03),rail);g.position.set((x0+x1)/2,top/2+0.5,z);g.rotation.z=ang;scene.add(g);
   const h=new THREE.Mesh(new THREE.BoxGeometry(L,0.05,0.07),mStr);h.position.set((x0+x1)/2,top/2+1.0,z);h.rotation.z=ang;scene.add(h)});}
// entrance desk

// reception (east lobby, faces south)
{const c=document.createElement("canvas");c.width=1200;c.height=600;const g=c.getContext("2d");
 const gr=g.createLinearGradient(0,0,1200,600);gr.addColorStop(0,"#1e2a78");gr.addColorStop(1,"#101746");g.fillStyle=gr;g.fillRect(0,0,1200,600);
 g.fillStyle="#fff";g.font=`900 84px ${FONT}`;g.fillText("2026 현대모비스",90,230);g.fillText("전사CA 성과공유회",90,330);
 g.fillStyle="#c9ceff";g.font=`500 40px ${FONT}`;g.fillText("10월 26일 (월) · 비전홀",94,410);
 g.fillStyle="#f2b233";g.font=`700 44px ${FONT}`;g.fillText("RECEPTION",900,540);
 const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;
 box(4.8,2.4,0.3,M(0x1a2366),40,1.2,25.2);
 const f=new THREE.Mesh(new THREE.PlaneGeometry(4.78,2.38),new THREE.MeshStandardMaterial({map:tx,roughness:.7}));f.position.set(40,1.2,25.36);scene.add(f);
 box(3.6,1.0,0.6,M(0x1e2a78),40,0.5,26.9); box(3.64,0.04,0.66,M(0xf5f5f7),40,1.02,26.9);
 const c2=document.createElement("canvas");c2.width=720;c2.height=200;const g2=c2.getContext("2d");g2.fillStyle="#1e2a78";g2.fillRect(0,0,720,200);g2.fillStyle="#fff";g2.font=`900 64px ${FONT}`;g2.fillText("리셉션 데스크",200,125);
 const t2=new THREE.CanvasTexture(c2);t2.colorSpace=THREE.SRGBColorSpace;const fr=new THREE.Mesh(new THREE.PlaneGeometry(3.58,0.98),new THREE.MeshStandardMaterial({map:t2}));fr.position.set(40,0.5,27.21);scene.add(fr);
 [38.8,41.2].forEach(x=>{const ch=new THREE.Group();ch.position.set(x,0,26.2);scene.add(ch);box(0.45,0.05,0.45,M(0x3a3e4a),0,0.62,0,ch);cyl(0.03,0.6,M(0x9a9ea8),0,0.3,0,8,ch)});
}
label("리셉션 · 안내데스크 3.6m",{x:40,y:3.0,z:26.2,size:0.9,bg:"#2e3ed2"});
// ---------- main hall ----------
const led=new THREE.Mesh(new THREE.PlaneGeometry(20,4.0),new THREE.MeshBasicMaterial({map:tex(LED_SRC)}));led.position.set(18,HALL_Y+0.2+2.0,0.27);scene.add(led);
box(20.3,4.3,0.25,mDark,18,HALL_Y+2.15,0.12);
const ledLight=new THREE.RectAreaLight?null:null;
box(0.6,1.1,0.5,M(0xdfe3ea,{metalness:.3,roughness:.3}),29.8,HALL_Y+0.55,2.0);
const mCloth=M(0x16181f,{roughness:.95}), mChair=M(0x3a3e4a,{roughness:.5,metalness:.3});
[8,13,18,23,28].forEach(x=>[7,12.5,18].forEach(z=>{
  cyl(0.9,0.76,mCloth,x,HALL_Y+0.38,z,40);cyl(0.92,0.02,M(0xf4f4f4),x,HALL_Y+0.77,z,40);
  for(let k=0;k<10;k++){const a=k/10*Math.PI*2, cx=x+Math.cos(a)*1.25, cz=z+Math.sin(a)*1.25;
    const ch=new THREE.Group();ch.position.set(cx,HALL_Y,cz);ch.rotation.y=-a-Math.PI/2;scene.add(ch);
    box(0.44,0.05,0.44,mChair,0,0.46,0,ch);box(0.44,0.45,0.04,mChair,0,0.7,-0.21,ch);}
}));
// area labels
label("비전홀 메인행사장 · FL−860",{x:18,y:HALL_Y+4.2,z:13,size:1.6,bg:"rgba(20,24,48,.88)"});
label("부스 ZONE · FL+170",{x:14,y:3.9,z:33,size:1.4,bg:"rgba(20,24,48,.88)"});
label("계단 6단 · 단차 1.03m",{x:26,y:1.2,z:24.6,size:1.0,bg:"rgba(255,255,255,.92)",fg:"#1d2233"});
label("사진 아카이브월 5.0×2.2m",{x:27.6,y:3.0,z:27.5,size:0.9,bg:"#b86a00"});
label("2층 올라가는 계단 · 상부 VOID",{x:25.6,y:4.6,z:34.1,size:0.8,bg:"rgba(255,255,255,.92)",fg:"#1d2233"});
label("LED 월 · 연단",{x:18,y:HALL_Y+4.7,z:0.8,size:1.0,bg:"#2e3ed2"});
// ---------- views ----------
const VIEWS={
  bird:{p:[43,27,53],t:[18,-1,23],ceil:false},
  booth:{p:[35.5,1.65,30.4],t:[8,1.2,32.5],ceil:true},
  hall:{p:[21,1.75,26.0],t:[15,0.2,4],ceil:true},
  detail:{p:[20.6,1.7,30.9],t:[22.4,1.0,27.6],ceil:true},
  recep:{p:[40,1.7,34.5],t:[40,1.1,25.6],ceil:true}};
let ceilOn=false;const tc=document.getElementById("t-ceil");
function setCeil(v){ceilOn=v;ceil.visible=v;eastWall.visible=v;areaLabels.forEach(s=>s.visible=!v);trees.visible=v;glass.visible=v;mull.visible=v;tc.setAttribute("aria-pressed",String(v));tc.textContent=v?"천장 숨기기":"천장 보기"}
function go(name){const v=VIEWS[name];camera.position.set(...v.p);controls.target.set(...v.t);setCeil(v.ceil);
  document.querySelectorAll(".views button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.v===name)));controls.update()}
document.querySelectorAll(".views button").forEach(b=>b.addEventListener("click",()=>go(b.dataset.v)));
tc.addEventListener("click",()=>setCeil(!ceilOn));
function resize(){const r=stage.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()}
new ResizeObserver(resize).observe(stage);resize();
const start=shot?location.hash.slice(6):"bird";go(VIEWS[start]?start:"bird");
renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera)});
window.__ready=true;
