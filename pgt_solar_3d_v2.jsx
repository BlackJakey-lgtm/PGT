import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

const TAU = Math.PI * 2;
const DEG2RAD = Math.PI / 180;
const GM = 4 * Math.PI * Math.PI;
const DELTA_S = 1 + Math.sqrt(2);
const SIGMA_HE = 0.3131;
const EV = { A1g:8.835781, T1u:3.071185, T2g:2.291866, Eg:1.788670, T2u:1.076384 };
const SCALE = 6;

const PLANETS = [
  { name:"水星",nm:"Mercury", a:.387, e:.206, i:7.0, col:0xb0a090, sz:.02, n:2, oh:"dim(Eg)",      d_n:9,  type:"tet", note:"" },
  { name:"金星",nm:"Venus",   a:.723, e:.007, i:3.4, col:0xe8c860, sz:.035,n:4, oh:"V_oct/V_tet",  d_n:3,  type:"tet", note:"=Be(2s²) · e最小 · T2u逆行" },
  { name:"地球",nm:"Earth",   a:1.00, e:.017, i:0.0, col:0x4090e0, sz:.035,n:5, oh:"dim(T1u+Eg)",  d_n:null,type:"tet", note:"錨點 · dim(T1u+Eg)=5" },
  { name:"火星",nm:"Mars",    a:1.524,e:.093, i:1.9, col:0xd06030, sz:.025,n:8, oh:"dim(tet)",     d_n:6,  type:"tet", note:"" },
  { name:"木星",nm:"Jupiter", a:5.203,e:.048, i:1.3, col:0xd0a060, sz:.09, n:26,oh:"2×13",         d_n:null,type:"oct", note:"Eg×(NB+1)" },
  { name:"土星",nm:"Saturn",  a:9.537,e:.054, i:2.5, col:0xc8b878, sz:.08, n:48,oh:"|Oh|",         d_n:null,type:"oct", note:"群階" },
  { name:"天王",nm:"Uranus",  a:19.19,e:.047, i:.8,  col:0x70c8d8, sz:.05, n:96,oh:"2|Oh|",        d_n:null,type:"oct", note:"U/S=2=dim(Eg) 精確" },
  { name:"海王",nm:"Neptune", a:30.07,e:.009, i:1.8, col:0x3060d0, sz:.05, n:150,oh:"≈N_bare",     d_n:null,type:"oct", note:"N/J≈δ_S² (−1%)" },
].map(p => {
  const bare = p.n / 5;
  const corr = p.d_n ? bare / (1 + SIGMA_HE / p.d_n) : bare;
  const dev_bare = (bare - p.a) / p.a * 100;
  const dev_corr = (corr - p.a) / p.a * 100;
  return { ...p, bare_au: bare, corr_au: corr, dev_bare, dev_corr, T_yr: Math.pow(p.a, 1.5) };
});

function orbitPos(a, e, inc, nu) {
  const r = a * (1 - e*e) / (1 + e * Math.cos(nu));
  const x = r * Math.cos(nu), y = r * Math.sin(nu);
  const ci = Math.cos(inc * DEG2RAD), si = Math.sin(inc * DEG2RAD);
  return new THREE.Vector3(x, y * ci, y * si);
}
function meanToTrue(M, e) {
  let E = M;
  for (let i = 0; i < 8; i++) E = M + e * Math.sin(E);
  return 2 * Math.atan2(Math.sqrt(1+e)*Math.sin(E/2), Math.sqrt(1-e)*Math.cos(E/2));
}

export default function Solar3Dv2() {
  const mountRef = useRef(null);
  const overlayRef = useRef(null);
  const S = useRef({
    time:0, playing:true, speed:1, galactic:false, driftSpd:.15,
    camTh:0.8, camPh:0.4, camD:30,
    comet:null, trails:PLANETS.map(()=>[]), trailMax:400,
  });
  const [ui, setUi] = useState({
    playing:true, speed:1, galactic:false, showPGT:true,
    showTrails:true, showCorr:false, trailLen:400,
    cMass:1, cSpd:5, launchMode:false, time:0,
  });
  const sceneRef=useRef(), camRef=useRef(), renRef=useRef(), sysGrp=useRef();
  const pMeshes=useRef([]), tLines=useRef([]), oLines=useRef([]), pgtLines=useRef([]), corrLines=useRef([]);
  const cMesh=useRef(), cTLine=useRef(), rafRef=useRef();

  // ================================================================
  // Init
  // ================================================================
  useEffect(() => {
    const mt = mountRef.current;
    const W = mt.clientWidth, H = 400;
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x020208);
    sceneRef.current = scene;
    const cam = new THREE.PerspectiveCamera(50, W/H, .1, 2000); camRef.current = cam;
    const ren = new THREE.WebGLRenderer({antialias:true});
    ren.setSize(W,H); ren.setPixelRatio(Math.min(devicePixelRatio,2));
    mt.appendChild(ren.domElement); renRef.current = ren;

    // Overlay canvas for labels
    const ov = document.createElement("canvas");
    ov.width = W; ov.height = H;
    ov.style.cssText = "position:absolute;top:0;left:0;pointer-events:none;";
    mt.appendChild(ov); overlayRef.current = ov;

    scene.add(new THREE.AmbientLight(0x222244,.5));
    const sl = new THREE.PointLight(0xffe88a,2,200); scene.add(sl);

    const sys = new THREE.Group(); scene.add(sys); sysGrp.current = sys;

    // Sun
    sys.add(new THREE.Mesh(new THREE.SphereGeometry(.5,24,24), new THREE.MeshBasicMaterial({color:0xffe88a})));
    sys.add(new THREE.Mesh(new THREE.SphereGeometry(.9,16,16), new THREE.MeshBasicMaterial({color:0xffd740,transparent:true,opacity:.12})));

    PLANETS.forEach((p,i) => {
      // Planet mesh
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(Math.max(.08, p.sz*SCALE*.15), 12, 12),
        new THREE.MeshLambertMaterial({color:p.col})
      ); sys.add(m); pMeshes.current[i] = m;

      // Actual orbit
      const pts=[]; for(let j=0;j<=128;j++){pts.push(orbitPos(p.a,p.e,p.i,(j/128)*TAU).multiplyScalar(SCALE));}
      const ol=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.06}));
      sys.add(ol); oLines.current[i]=ol;

      // PGT bare orbit (n/5)
      const pp=[]; for(let j=0;j<=64;j++){pp.push(orbitPos(p.bare_au,0,p.i,(j/64)*TAU).multiplyScalar(SCALE));}
      const pl=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pp),
        new THREE.LineDashedMaterial({color:p.type==="tet"?0xffd740:0x40c4ff,transparent:true,opacity:.12,dashSize:.3,gapSize:.5}));
      pl.computeLineDistances(); sys.add(pl); pgtLines.current[i]=pl;

      // σ_He corrected orbit (inner planets only)
      if(p.d_n){
        const cp=[]; for(let j=0;j<=64;j++){cp.push(orbitPos(p.corr_au,0,p.i,(j/64)*TAU).multiplyScalar(SCALE));}
        const cl=new THREE.Line(new THREE.BufferGeometry().setFromPoints(cp),
          new THREE.LineDashedMaterial({color:0xff4081,transparent:true,opacity:.2,dashSize:.2,gapSize:.3}));
        cl.computeLineDistances(); cl.visible=false; sys.add(cl); corrLines.current[i]=cl;
      }

      // Trail
      const tg=new THREE.BufferGeometry();
      tg.setAttribute("position",new THREE.BufferAttribute(new Float32Array(800*3),3));
      tg.setDrawRange(0,0);
      const tl=new THREE.Line(tg,new THREE.LineBasicMaterial({color:p.col,transparent:true,opacity:.3}));
      scene.add(tl); tLines.current[i]=tl;
    });

    // Belt
    sys.add(new THREE.Mesh(new THREE.RingGeometry((14/5)*SCALE-.3,(14/5)*SCALE+.3,64),
      new THREE.MeshBasicMaterial({color:0xff6e40,transparent:true,opacity:.05,side:THREE.DoubleSide})));

    // Comet
    const cm=new THREE.Mesh(new THREE.SphereGeometry(.15,8,8),new THREE.MeshBasicMaterial({color:0x00ffaa}));
    cm.visible=false; sys.add(cm); cMesh.current=cm;
    const ctg=new THREE.BufferGeometry();
    ctg.setAttribute("position",new THREE.BufferAttribute(new Float32Array(800*3),3));
    ctg.setDrawRange(0,0);
    const ctl=new THREE.Line(ctg,new THREE.LineBasicMaterial({color:0x00ffaa,transparent:true,opacity:.5}));
    scene.add(ctl); cTLine.current=ctl;

    // Galactic line
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,500)]),
      new THREE.LineBasicMaterial({color:0xffd740,transparent:true,opacity:.04})));

    return () => { cancelAnimationFrame(rafRef.current); ren.dispose(); if(mt.contains(ren.domElement))mt.removeChild(ren.domElement); if(mt.contains(ov))mt.removeChild(ov); };
  }, []);

  // Camera
  const updateCam = useCallback(() => {
    const c=camRef.current, g=sysGrp.current; if(!c||!g)return;
    const s=S.current;
    c.position.set(
      g.position.x+s.camD*Math.sin(s.camPh)*Math.cos(s.camTh),
      g.position.y+s.camD*Math.cos(s.camPh),
      g.position.z+s.camD*Math.sin(s.camPh)*Math.sin(s.camTh));
    c.lookAt(g.position);
  },[]);

  // Controls
  useEffect(()=>{
    const el=renRef.current?.domElement; if(!el)return;
    let drag=false,lx=0,ly=0,pinch=null;
    const md=e=>{if(ui.launchMode)return;drag=true;lx=e.clientX;ly=e.clientY;};
    const mm=e=>{if(!drag)return;S.current.camTh+=((e.clientX-lx)*.008);S.current.camPh=Math.max(.1,Math.min(Math.PI-.1,S.current.camPh-(e.clientY-ly)*.008));lx=e.clientX;ly=e.clientY;};
    const mu=()=>{drag=false;};
    const wh=e=>{e.preventDefault();S.current.camD*=e.deltaY>0?1.08:.92;S.current.camD=Math.max(3,Math.min(300,S.current.camD));};
    const ts=e=>{if(e.touches.length===2){const dx=e.touches[0].clientX-e.touches[1].clientX,dy=e.touches[0].clientY-e.touches[1].clientY;pinch=Math.sqrt(dx*dx+dy*dy);}else if(e.touches.length===1){drag=true;lx=e.touches[0].clientX;ly=e.touches[0].clientY;}};
    const tmv=e=>{e.preventDefault();if(e.touches.length===2&&pinch){const dx=e.touches[0].clientX-e.touches[1].clientX,dy=e.touches[0].clientY-e.touches[1].clientY,d=Math.sqrt(dx*dx+dy*dy);S.current.camD*=pinch/d;S.current.camD=Math.max(3,Math.min(300,S.current.camD));pinch=d;}else if(e.touches.length===1&&drag){S.current.camTh+=(e.touches[0].clientX-lx)*.008;S.current.camPh=Math.max(.1,Math.min(Math.PI-.1,S.current.camPh-(e.touches[0].clientY-ly)*.008));lx=e.touches[0].clientX;ly=e.touches[0].clientY;}};
    const te=()=>{drag=false;pinch=null;};
    const cl=e=>{
      if(!ui.launchMode)return;
      const rect=el.getBoundingClientRect();
      const mx=((e.clientX-rect.left)/rect.width)*2-1, my=-((e.clientY-rect.top)/rect.height)*2+1;
      const rc=new THREE.Raycaster(); rc.setFromCamera(new THREE.Vector2(mx,my),camRef.current);
      const t=new THREE.Vector3(); rc.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),0),t);
      if(t){const sp=sysGrp.current.position;const lx2=(t.x-sp.x)/SCALE,lz=(t.z-sp.z)/SCALE;
        const rr=Math.sqrt(lx2*lx2+lz*lz);const vc=Math.sqrt(GM/rr)*(ui.cSpd/5);
        S.current.comet={pos:new THREE.Vector3(lx2,0,lz),vel:new THREE.Vector3(-lz/rr*vc,0,lx2/rr*vc),trail:[],mass:ui.cMass};
        setUi(u=>({...u,launchMode:false}));}
    };
    el.addEventListener("mousedown",md);el.addEventListener("mousemove",mm);el.addEventListener("mouseup",mu);el.addEventListener("mouseleave",mu);
    el.addEventListener("wheel",wh,{passive:false});el.addEventListener("touchstart",ts,{passive:false});el.addEventListener("touchmove",tmv,{passive:false});el.addEventListener("touchend",te);el.addEventListener("click",cl);
    return()=>{el.removeEventListener("mousedown",md);el.removeEventListener("mousemove",mm);el.removeEventListener("mouseup",mu);el.removeEventListener("mouseleave",mu);el.removeEventListener("wheel",wh);el.removeEventListener("touchstart",ts);el.removeEventListener("touchmove",tmv);el.removeEventListener("touchend",te);el.removeEventListener("click",cl);};
  },[ui.launchMode,ui.cSpd,ui.cMass]);

  // ================================================================
  // Animate
  // ================================================================
  useEffect(()=>{
    const animate=()=>{
      rafRef.current=requestAnimationFrame(animate);
      const s=S.current;
      if(s.playing) s.time+=.002*s.speed;
      if(s.galactic) sysGrp.current.position.z+=s.driftSpd*.002*s.speed*SCALE;
      sceneRef.current.children[1].position.copy(sysGrp.current.position);

      const screenPositions = [];

      PLANETS.forEach((p,i)=>{
        const T=p.T_yr, M=(s.time/T)*TAU, nu=meanToTrue(M%TAU,p.e);
        const pos=orbitPos(p.a,p.e,p.i,nu).multiplyScalar(SCALE);
        pMeshes.current[i].position.copy(pos);

        // Trail (world space)
        const wp=pos.clone(); sysGrp.current.localToWorld(wp);
        s.trails[i].push(wp.clone());
        if(s.trails[i].length>s.trailMax) s.trails[i].shift();
        const tl=tLines.current[i],ta=tl.geometry.attributes.position.array;
        for(let k=0;k<s.trails[i].length&&k<800;k++){ta[k*3]=s.trails[i][k].x;ta[k*3+1]=s.trails[i][k].y;ta[k*3+2]=s.trails[i][k].z;}
        tl.geometry.attributes.position.needsUpdate=true;
        tl.geometry.setDrawRange(0,s.trails[i].length);
        tl.visible=ui.showTrails;

        pgtLines.current[i].visible=ui.showPGT;
        if(corrLines.current[i]) corrLines.current[i].visible=ui.showCorr;

        // Screen projection for labels
        const sp=pos.clone(); sysGrp.current.localToWorld(sp);
        sp.project(camRef.current);
        const ov=overlayRef.current;
        if(ov){screenPositions.push({x:(sp.x+1)/2*ov.width,y:(-sp.y+1)/2*ov.height,name:p.name,col:`#${p.col.toString(16).padStart(6,"0")}`,z:sp.z});}
      });

      // Comet
      if(s.comet){const c=s.comet;for(let ss=0;ss<4;ss++){const r3=Math.pow(c.pos.length(),3);const acc=c.pos.clone().multiplyScalar(-GM/Math.max(r3,.001));c.vel.add(acc.multiplyScalar(.002*s.speed/4));c.pos.add(c.vel.clone().multiplyScalar(.002*s.speed/4));}
        cMesh.current.visible=true;cMesh.current.position.copy(c.pos.clone().multiplyScalar(SCALE));cMesh.current.scale.setScalar(Math.max(.3,Math.cbrt(c.mass)*.5));
        const cwp=c.pos.clone().multiplyScalar(SCALE);sysGrp.current.localToWorld(cwp);c.trail.push(cwp.clone());if(c.trail.length>s.trailMax)c.trail.shift();
        const ctl=cTLine.current,cta=ctl.geometry.attributes.position.array;for(let k=0;k<c.trail.length&&k<800;k++){cta[k*3]=c.trail[k].x;cta[k*3+1]=c.trail[k].y;cta[k*3+2]=c.trail[k].z;}
        ctl.geometry.attributes.position.needsUpdate=true;ctl.geometry.setDrawRange(0,c.trail.length);
        if(c.pos.length()>80){s.comet=null;cMesh.current.visible=false;}
      }else{cMesh.current.visible=false;}

      updateCam();
      renRef.current.render(sceneRef.current,camRef.current);

      // Draw labels on overlay
      const ov=overlayRef.current;
      if(ov){
        const ctx=ov.getContext("2d");
        ctx.clearRect(0,0,ov.width,ov.height);
        ctx.font="10px monospace";
        for(const sp of screenPositions){
          if(sp.z>0&&sp.z<1&&sp.x>0&&sp.x<ov.width&&sp.y>0&&sp.y<ov.height){
            ctx.fillStyle=sp.col;
            ctx.globalAlpha=.85;
            ctx.fillText(sp.name,sp.x+8,sp.y+3);
          }
        }
        ctx.globalAlpha=1;
      }

      setUi(u=>({...u,time:s.time}));
    };
    animate();
    return()=>cancelAnimationFrame(rafRef.current);
  },[updateCam,ui.showTrails,ui.showPGT,ui.showCorr]);

  useEffect(()=>{S.current.playing=ui.playing;},[ui.playing]);
  useEffect(()=>{S.current.speed=ui.speed;},[ui.speed]);
  useEffect(()=>{S.current.galactic=ui.galactic;},[ui.galactic]);
  useEffect(()=>{S.current.trailMax=ui.trailLen;},[ui.trailLen]);

  const clearComet=()=>{S.current.comet=null;if(cMesh.current)cMesh.current.visible=false;cTLine.current?.geometry.setDrawRange(0,0);};

  const PB="#08081a",BD="#151530";
  const btn=(c,active)=>({padding:"3px 7px",cursor:"pointer",borderRadius:"3px",background:active?`${c}15`:"transparent",border:`1px solid ${active?c:c+"44"}`,color:c,fontFamily:"inherit",fontSize:"9px"});

  return(
    <div style={{background:"#020208",color:"#a0a0c0",minHeight:"100vh",fontFamily:"'SF Mono','Fira Code',monospace",padding:"8px",fontSize:"11px"}}>
      <div style={{marginBottom:"4px"}}>
        <div style={{fontSize:"14px",fontWeight:700,background:"linear-gradient(90deg,#FFD740,#4090e0,#00ffaa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>PGT 太陽系 3D v2</div>
        <div style={{color:"#2a2a48",fontSize:"9px"}}>拖曳旋轉 · 滾輪/雙指縮放 · §13 Oh序列 · r=n/5 + σ_He修正</div>
      </div>

      <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
        <div ref={mountRef} style={{position:"relative",width:Math.min(480,typeof window!=="undefined"?window.innerWidth-210:480),height:400,background:"#000",borderRadius:"5px",border:`1px solid ${BD}`,overflow:"hidden",touchAction:"none"}}/>

        <div style={{flex:1,minWidth:"190px",display:"flex",flexDirection:"column",gap:"4px"}}>
          {/* 控制 */}
          <div style={{background:PB,border:`1px solid ${BD}`,borderRadius:"5px",padding:"6px"}}>
            <div style={{display:"flex",gap:"2px",flexWrap:"wrap",marginBottom:"4px"}}>
              <button onClick={()=>setUi(u=>({...u,playing:!u.playing}))} style={btn(ui.playing?"#69F0AE":"#a0a0c0",ui.playing)}>{ui.playing?"⏸":"▶"}</button>
              {[2,4,8,16,32].map(x=>(
                <button key={x} onClick={()=>setUi(u=>({...u,speed:x}))} style={btn("#FFD740",ui.speed===x)}>×{x}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:"4px",flexWrap:"wrap",marginBottom:"3px"}}>
              {[["軌跡","showTrails"],["n/5","showPGT"],["σ修正","showCorr"],["銀河","galactic"]].map(([l,k])=>(
                <label key={k} style={{display:"flex",alignItems:"center",gap:"2px",color:"#3a3a58",fontSize:"8px",cursor:"pointer"}}>
                  <input type="checkbox" checked={ui[k]} onChange={e=>setUi(u=>({...u,[k]:e.target.checked}))} />{l}
                </label>
              ))}
            </div>
            <div style={{fontSize:"8px",color:"#2a2a48",marginBottom:"1px"}}>軌跡長度 {ui.trailLen}</div>
            <input type="range" min={50} max={800} value={ui.trailLen}
              onChange={e=>setUi(u=>({...u,trailLen:+e.target.value}))}
              style={{width:"100%",accentColor:"#40C4FF",height:"2px"}} />
          </div>

          {/* 彗星 */}
          <div style={{background:PB,border:`1px solid #00ffaa33`,borderRadius:"5px",padding:"6px"}}>
            <div style={{fontSize:"9px",color:"#00ffaa",fontWeight:700,marginBottom:"2px"}}>☄ 彗星</div>
            <div style={{fontSize:"8px",color:"#2a2a48"}}>速度 {ui.cSpd.toFixed(1)} · 質量不改軌道[P]</div>
            <input type="range" min={.5} max={15} step={.1} value={ui.cSpd} onChange={e=>setUi(u=>({...u,cSpd:+e.target.value}))} style={{width:"100%",accentColor:"#00ffaa",height:"2px"}} />
            <div style={{display:"flex",gap:"3px",marginTop:"3px"}}>
              <button onClick={()=>setUi(u=>({...u,launchMode:true}))} style={btn("#00ffaa",ui.launchMode)}>{ui.launchMode?"👆 點擊發射":"發射"}</button>
              <button onClick={clearComet} style={btn("#FF6E40")}>清除</button>
            </div>
          </div>

          {/* 距離表 */}
          <div style={{background:PB,border:`1px solid #FFD74022`,borderRadius:"5px",padding:"6px"}}>
            <div style={{fontSize:"9px",color:"#FFD740",fontWeight:700,marginBottom:"2px"}}>r = n/5 + σ_He 修正</div>
            <div style={{display:"grid",gridTemplateColumns:"26px 14px 34px 34px 28px",gap:"1px 2px",fontSize:"7.5px"}}>
              <span style={{color:"#2a2a48"}}>行星</span><span style={{color:"#2a2a48"}}>n</span>
              <span style={{color:"#2a2a48"}}>實際</span><span style={{color:"#FFD740"}}>n/5</span><span style={{color:"#FF4081"}}>σ修</span>
              {PLANETS.map(p=>(
                <React.Fragment key={p.name}>
                  <span style={{color:`#${p.col.toString(16).padStart(6,"0")}`}}>{p.name}</span>
                  <span style={{color:"#404060"}}>{p.n}</span>
                  <span style={{color:"#404060"}}>{p.a.toFixed(3)}</span>
                  <span style={{color:"#FFD740"}}>{p.bare_au.toFixed(3)}</span>
                  <span style={{color:p.d_n?(Math.abs(p.dev_corr)<1?"#69F0AE":"#FF4081"):"#2a2a48"}}>
                    {p.d_n?`${p.dev_corr>0?"+":""}${p.dev_corr.toFixed(1)}%`:"—"}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Venus */}
          <div style={{background:PB,border:`1px solid #e8c86033`,borderRadius:"5px",padding:"6px"}}>
            <div style={{fontSize:"9px",color:"#e8c860",fontWeight:700}}>★ 金星 = Be(2s² 封閉)</div>
            <div style={{fontSize:"8px",color:"#3a3a58",lineHeight:1.4,marginTop:"2px"}}>
              n=4=V_oct/V_tet · e最小 · tilt最小
              <br/>逆行=T2u arg≈−180° 反彈呼吸 [O]
              <br/>大氣92bar=壓力駐波波腹
              <br/>σ_He/3 修正→0.724 AU(偏+0.2%)
            </div>
          </div>

          {/* 結構 */}
          <div style={{background:PB,border:`1px solid ${BD}`,borderRadius:"5px",padding:"6px"}}>
            <div style={{fontSize:"8px",color:"#3a3a58",lineHeight:1.4}}>
              內行星 n=[2,4,5,8]=Oh dim
              <br/>外行星 n=[26,48,96,150]=Oh 群論量
              <br/>帶 n=14=BZ 面=tet/oct 界面
              <br/>Δn前5={2,1,3,6,12}=Oh dim [P]
              <br/>U/S=2=dim(Eg) 精確
              <br/>N/J≈δ_S² (−1%)
            </div>
          </div>
        </div>
      </div>

      <div style={{color:"#101028",fontSize:"8px",marginTop:"3px",borderTop:"1px solid #0d0d18",paddingTop:"2px"}}>
        PGT v7.5.0 §13 · r=n/5 [O] · σ_He修正 [C] · Kepler=Helmholtz [P] · Venus=Be(2s²) [O]
      </div>
    </div>
  );
}
