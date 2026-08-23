(() => {
  'use strict';
  const V='4.0';
  const GOLD='#d6aa43';
  const DEFAULTS={
    frontWheel:{x:3100,y:6100,s:1,r:0,visible:true},
    frontDarts:{x:1450,y:8250,s:1,r:-8,visible:true},
    backWheel:{x:9450,y:5600,s:.95,r:0,visible:true},
    carriage:{x:9600,y:7600,s:1,r:0,visible:true},
    sleeveWheelA:{x:15250,y:5850,s:.68,r:0,visible:true},
    sleeveWheelB:{x:15250,y:8850,s:.68,r:0,visible:true},
    frontFiligree:{x:3050,y:3850,s:1,r:0,visible:true},
    backFiligree:{x:9450,y:4050,s:1,r:0,visible:true},
  };
  const state={objects:JSON.parse(JSON.stringify(DEFAULTS)),seed:1,autoVector:false};

  function injectStyle(){
    const s=document.createElement('style');
    s.textContent=`
      .dss4-card{border:1px solid #6d5718;background:linear-gradient(180deg,#12180f,#0b1015);border-radius:16px;padding:16px;margin-top:14px}
      .dss4-title{font-weight:900;font-size:18px;color:var(--gold);margin-bottom:6px}.dss4-sub{font-size:13px;color:var(--muted);line-height:1.45}
      .dss4-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}.dss4-row .btn{flex:1;min-width:180px}
      .dss4-editor{display:grid;grid-template-columns:1fr;gap:10px;margin-top:12px}.dss4-obj{border:1px solid var(--line);border-radius:12px;padding:11px;background:#0b1118}
      .dss4-objHead{display:flex;justify-content:space-between;align-items:center;gap:10px}.dss4-objHead b{font-size:13px}.dss4-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:9px}
      .dss4-grid label{font-size:11px;color:var(--muted);margin:0}.dss4-grid input{margin-top:4px;padding:8px 9px}.dss4-ok{color:#83dfa5}.dss4-warn{color:#efc96e}
      .dss4-chip{display:inline-block;border:1px solid #6d5718;border-radius:999px;padding:5px 9px;font-size:11px;color:var(--gold);margin-right:5px;margin-top:5px}
      @media(min-width:760px){.dss4-editor{grid-template-columns:repeat(2,minmax(0,1fr))}}
    `;
    document.head.appendChild(s);
  }

  function rng(seed){let t=seed>>>0;return()=>{t+=0x6D2B79F5;let r=Math.imul(t^t>>>15,1|t);r^=r+Math.imul(r^r>>>7,61|r);return((r^r>>>14)>>>0)/4294967296}}
  function hash(str){let h=2166136261>>>0;for(const c of String(str)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
  function n(v,d=0){const x=Number(v);return Number.isFinite(x)?x:d}
  function q(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]))}
  function slug(s){return String(s||'DESIGN').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'_').replace(/^_+|_+$/g,'').toUpperCase()||'DESIGN'}

  function defs(){
    return `<defs>
      ${PATHS.map(p=>`<clipPath id="v4clip${p.id}"><path d="${p.d}"/></clipPath>`).join('')}
      <linearGradient id="v4bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#030507"/><stop offset=".48" stop-color="#0b1017"/><stop offset="1" stop-color="#05070a"/></linearGradient>
      <linearGradient id="v4gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7d5317"/><stop offset=".25" stop-color="#d6aa43"/><stop offset=".5" stop-color="#ffe29a"/><stop offset=".75" stop-color="#d6aa43"/><stop offset="1" stop-color="#7b5218"/></linearGradient>
      <pattern id="v4micro" width="150" height="150" patternUnits="userSpaceOnUse"><path d="M0 75 Q37 5 75 75 T150 75 M75 0 Q5 37 75 75 T75 150" fill="none" stroke="#d6aa43" stroke-opacity=".075" stroke-width="3"/></pattern>
      <filter id="v4soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="18"/></filter>
      <symbol id="v4wheel" viewBox="-800 -800 1600 1600">
        <circle r="690" fill="#07090c" stroke="url(#v4gold)" stroke-width="55"/>
        <circle r="575" fill="#0b0d11" stroke="#821015" stroke-width="40"/>
        ${Array.from({length:16},(_,i)=>{const a=i*22.5;return `<g transform="rotate(${a})"><path d="M-58 -120 C-95 -250 -115 -425 -62 -535 C-15 -635 15 -635 62 -535 C115 -425 95 -250 58 -120 Z" fill="#c71921" stroke="#4d080c" stroke-width="20"/></g>`}).join('')}
        <circle r="128" fill="#090a0d" stroke="url(#v4gold)" stroke-width="28"/><circle r="38" fill="#d6aa43"/>
      </symbol>
      <symbol id="v4dart" viewBox="-80 -420 160 840"><path d="M-13 350 L13 350 L25 -120 L0 -250 L-25 -120 Z" fill="url(#v4gold)"/><path d="M0 -250 L-72 -370 L-15 -338 L0 -420 L15 -338 L72 -370 Z" fill="#d6aa43" stroke="#65420f" stroke-width="10"/><path d="M-28 350 L28 350 L15 415 L-15 415 Z" fill="#b87d20"/></symbol>
      <symbol id="v4filigree" viewBox="-1000 -400 2000 800">
        <path d="M-930 0 C-690 -10 -650 -210 -480 -220 C-330 -230 -350 35 -185 25 C-60 18 -85 -145 0 -155 C85 -145 60 18 185 25 C350 35 330 -230 480 -220 C650 -210 690 -10 930 0" fill="none" stroke="url(#v4gold)" stroke-width="38" stroke-linecap="round"/>
        <path d="M-780 85 C-610 70 -590 190 -455 180 C-310 170 -315 55 -190 60 M190 60 C315 55 310 170 455 180 C590 190 610 70 780 85" fill="none" stroke="#d6aa43" stroke-width="24"/>
        <path d="M-40 -115 Q0 -280 40 -115 Q190 -65 40 -15 Q0 150 -40 -15 Q-190 -65 -40 -115Z" fill="none" stroke="#d6aa43" stroke-width="22"/>
        <circle r="42" fill="#c71921" stroke="#d6aa43" stroke-width="14"/>
      </symbol>
      <symbol id="v4carriage" viewBox="-1200 -650 2400 1300">
        <g fill="none" stroke="url(#v4gold)" stroke-width="28" stroke-linejoin="round" stroke-linecap="round">
          <path d="M-1060 145 L-1010 -310 Q-880 -520 -540 -535 L230 -515 Q430 -500 520 -330 L550 170 Z" fill="#090b0f"/>
          <path d="M-920 -270 L390 -270 M-870 65 L420 65 M-780 -470 L-780 145 M-420 -510 L-420 145 M-45 -510 L-45 145 M300 -455 L300 145"/>
          <path d="M-690 -405 Q-600 -475 -500 -405 L-500 -180 L-690 -180 Z M-315 -405 Q-225 -475 -125 -405 L-125 -180 L-315 -180 Z M70 -405 Q160 -475 250 -405 L250 -180 L70 -180 Z"/>
          <circle cx="-720" cy="295" r="205"/><circle cx="245" cy="295" r="205"/>
          ${Array.from({length:8},(_,i)=>`<path d="M-720 295 l${Math.cos(i*Math.PI/4)*180} ${Math.sin(i*Math.PI/4)*180}"/>`).join('')}
          ${Array.from({length:8},(_,i)=>`<path d="M245 295 l${Math.cos(i*Math.PI/4)*180} ${Math.sin(i*Math.PI/4)*180}"/>`).join('')}
          <path d="M535 35 C720 -80 850 -85 1000 -10"/><path d="M995 -10 Q1090 -80 1160 0 Q1105 85 1010 68 Q945 65 900 155 Q845 260 780 305"/>
          <path d="M1005 65 Q1060 180 1008 330 M908 140 Q945 250 882 355 M780 305 L725 530 M1008 330 L1045 530"/>
          <path d="M1080 -20 q60 -80 95 -5 M1110 42 l88 24"/>
          <path d="M470 -80 L900 40 M490 0 L905 100"/>
        </g>
      </symbol>
      <symbol id="v4crest" viewBox="-500 -500 1000 1000"><path d="M0 -440 C310 -390 410 -250 390 100 C360 300 190 405 0 460 C-190 405 -360 300 -390 100 C-410 -250 -310 -390 0 -440Z" fill="#07090d" stroke="url(#v4gold)" stroke-width="34"/><use href="#v4dart" transform="translate(-130,40) rotate(-18) scale(.55)"/><use href="#v4dart" transform="translate(0,0) scale(.6)"/><use href="#v4dart" transform="translate(130,40) rotate(18) scale(.55)"/><circle cy="185" r="120" fill="none" stroke="#d6aa43" stroke-width="24"/></symbol>
    </defs>`;
  }

  function brushLayer(piece,seed,x0,y0,w,h,colors){
    const R=rng(seed);let s='';
    colors.forEach((c,ci)=>{
      const baseX=x0+(ci/(colors.length-1||1))*w*.78;
      for(let i=0;i<18;i++){
        const y=y0+R()*h, x=baseX+(R()-.5)*w*.2, len=w*(.28+R()*.32), rise=h*(.15+R()*.28), sw=18+R()*48;
        s+=`<path d="M${x.toFixed(1)} ${y.toFixed(1)} C${(x+len*.28).toFixed(1)} ${(y-rise).toFixed(1)} ${(x+len*.72).toFixed(1)} ${(y+rise*.55).toFixed(1)} ${(x+len).toFixed(1)} ${(y-rise*.12).toFixed(1)}" fill="none" stroke="${c}" stroke-width="${sw.toFixed(1)}" stroke-linecap="round" opacity="${(.35+R()*.45).toFixed(2)}"/>`;
      }
    });
    return `<g data-layer="L_BG_EFFECTS">${s}</g>`;
  }

  function tUse(sym,o,baseScale=1){if(!o.visible)return'';return `<use href="#${sym}" transform="translate(${o.x} ${o.y}) rotate(${o.r}) scale(${o.s*baseScale})"/>`}
  function filigreeBand(cx,cy,w,rot=0,op=.9){return `<use href="#v4filigree" transform="translate(${cx} ${cy}) rotate(${rot}) scale(${w/2000})" opacity="${op}"/>`}
  function objectArt(v){
    state.seed=hash([v.design,v.team,v.venue,v.style].join('|'));
    const c=[v.colors[1]||'#123f91',v.colors[2]||'#08713f',v.colors[3]||'#c71921'];
    const p=[];
    [[1,6700],[2,0]].forEach(([id,x])=>{
      p.push(`<g id="ART_P${id}" clip-path="url(#v4clip${id})"><g data-layer="L_BG_BASE"><rect width="${W}" height="${H}" fill="url(#v4bg)"/><rect width="${W}" height="${H}" fill="url(#v4micro)"/></g>${brushLayer(id,state.seed+id,x+100,100,5400,1200,c)}<g data-layer="L_ORNAMENTS">${filigreeBand(x+2900,620,4700,0,.9)}</g><g data-layer="L_ACCENTS"><path d="M${x+150} 1140 C${x+1800} 930 ${x+3600} 930 ${x+5450} 1160" fill="none" stroke="url(#v4gold)" stroke-width="62"/><path d="M${x+250} 1240 C${x+1800} 1050 ${x+3550} 1050 ${x+5350} 1260" fill="none" stroke="#d6aa43" stroke-width="18"/></g></g>`);
    });
    p.push(`<g id="ART_P3" clip-path="url(#v4clip3)"><g data-layer="L_BG_BASE"><rect width="${W}" height="${H}" fill="url(#v4bg)"/><rect width="${W}" height="${H}" fill="url(#v4micro)"/></g>${brushLayer(3,state.seed+30,300,2900,5600,6200,c)}<g data-layer="L_ORNAMENTS">${tUse('v4filigree',state.objects.frontFiligree,2.3)}${filigreeBand(3100,9000,4200,0,.75)}</g><g data-layer="L_ART_MAIN">${tUse('v4wheel',state.objects.frontWheel,1.7)}${state.objects.frontDarts.visible?`<g transform="translate(${state.objects.frontDarts.x} ${state.objects.frontDarts.y}) rotate(${state.objects.frontDarts.r}) scale(${state.objects.frontDarts.s})"><use href="#v4dart" transform="translate(-260,0) rotate(-16) scale(1.25)"/><use href="#v4dart" transform="scale(1.35)"/><use href="#v4dart" transform="translate(260,0) rotate(16) scale(1.25)"/></g>`:''}</g><g data-layer="L_ACCENTS"><path d="M3070 2500 L3070 9600" stroke="url(#v4gold)" stroke-width="95" opacity=".82"/><path d="M2970 2500 L2970 9600" stroke="#d6aa43" stroke-width="18"/></g></g>`);
    p.push(`<g id="ART_P4" clip-path="url(#v4clip4)"><g data-layer="L_BG_BASE"><rect width="${W}" height="${H}" fill="url(#v4bg)"/><rect width="${W}" height="${H}" fill="url(#v4micro)"/></g>${brushLayer(4,state.seed+40,6600,3000,5800,6100,c)}<g data-layer="L_ORNAMENTS">${tUse('v4filigree',state.objects.backFiligree,2.2)}${filigreeBand(9450,9200,4100,0,.75)}</g><g data-layer="L_ART_MAIN">${tUse('v4wheel',state.objects.backWheel,1.55)}${tUse('v4carriage',state.objects.carriage,1.45)}</g><g data-layer="L_ACCENTS"><path d="M6880 9450 C8500 9040 10500 9040 12300 9450" fill="none" stroke="url(#v4gold)" stroke-width="58"/></g></g>`);
    [[5,2200],[6,3170]].forEach(([id,y])=>p.push(`<g id="ART_P${id}" clip-path="url(#v4clip${id})"><g data-layer="L_BG_BASE"><rect width="${W}" height="${H}" fill="url(#v4bg)"/><rect width="${W}" height="${H}" fill="url(#v4micro)"/></g>${brushLayer(id,state.seed+id,12500,y-300,5200,950,c)}<g data-layer="L_ORNAMENTS">${filigreeBand(15150,y+40,4300,0,.9)}</g><g data-layer="L_ACCENTS"><path d="M12600 ${y+470} C14150 ${y+660} 16100 ${y+660} 17680 ${y+450}" fill="none" stroke="url(#v4gold)" stroke-width="48"/></g></g>`));
    [[7,state.objects.sleeveWheelA,4250],[8,state.objects.sleeveWheelB,7200]].forEach(([id,o,y0])=>p.push(`<g id="ART_P${id}" clip-path="url(#v4clip${id})"><g data-layer="L_BG_BASE"><rect width="${W}" height="${H}" fill="url(#v4bg)"/><rect width="${W}" height="${H}" fill="url(#v4micro)"/></g>${brushLayer(id,state.seed+id,12800,y0,4900,2450,c)}<g data-layer="L_ORNAMENTS">${filigreeBand(15200,y0+980,3600,0,.7)}</g><g data-layer="L_ART_MAIN">${tUse('v4wheel',o,1.05)}</g><g data-layer="L_ACCENTS"><path d="M12950 ${y0+2250} C14200 ${y0+2450} 16200 ${y0+2450} 17480 ${y0+2220}" fill="none" stroke="url(#v4gold)" stroke-width="54"/></g></g>`));
    return p.join('');
  }

  function vectorMaster(){
    const v=vals();
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-dss-package="4.0" data-dss-pieces="8" data-vector-art="true"><metadata>DSS VECTOR MASTER v4.0 · ${q(v.design)} · artwork vectorial editable</metadata>${defs()}${objectArt(v)}</svg>`;
  }
  function innerSvg(src){try{const d=new DOMParser().parseFromString(src,'image/svg+xml');return Array.from(d.documentElement.childNodes).map(n=>new XMLSerializer().serializeToString(n)).join('')}catch(e){return src}}

  function generateVector(){
    state.autoVector=true; fileMode='vector'; packageValid=true; packageIssues=[]; packageText=vectorMaster();
    const st=$('artStatus'); st.className='status ok'; st.innerHTML='<b>DSS VECTOR MASTER v4.0 generat</b><br>8 peces · artwork 100% vectorial · objectes editables · textos/logos controlats per DSS.';
    buildEditor(); render(); setStep(3);
  }

  function buildEditor(){
    let host=document.getElementById('dss4-editorCard');
    if(!host){host=document.createElement('div');host.id='dss4-editorCard';host.className='dss4-card';const ref=document.getElementById('layerPanel')||document.getElementById('artStatus');ref.insertAdjacentElement('afterend',host)}
    const labels={frontWheel:'Roda frontal',frontDarts:'Dards frontal',backWheel:'Roda esquena',carriage:'Carruatge + cavall',sleeveWheelA:'Roda màniga A',sleeveWheelB:'Roda màniga B',frontFiligree:'Filigrana frontal',backFiligree:'Filigrana esquena'};
    host.innerHTML=`<div class="dss4-title">Editor d'objectes vectorials</div><div class="dss4-sub">Mou, escala, gira o amaga elements sense regenerar tota la samarreta.</div><div class="dss4-editor">${Object.entries(state.objects).map(([id,o])=>`<div class="dss4-obj"><div class="dss4-objHead"><b>${labels[id]}</b><label><input type="checkbox" data-v4vis="${id}" ${o.visible?'checked':''}> visible</label></div><div class="dss4-grid"><label>X<input type="number" data-v4="${id}.x" value="${o.x}" step="25"></label><label>Y<input type="number" data-v4="${id}.y" value="${o.y}" step="25"></label><label>Escala<input type="number" data-v4="${id}.s" value="${o.s}" step="0.05" min="0.1" max="3"></label><label>Rotació<input type="number" data-v4="${id}.r" value="${o.r}" step="1" min="-180" max="180"></label></div></div>`).join('')}</div><div class="dss4-row"><button class="btn" id="dss4-reset">Restablir composició</button><button class="btn gold" id="dss4-apply">Aplicar canvis</button></div>`;
    host.querySelectorAll('[data-v4vis]').forEach(el=>el.onchange=()=>{state.objects[el.dataset.v4vis].visible=el.checked;refreshVector()});
    host.querySelectorAll('[data-v4]').forEach(el=>el.onchange=()=>{const [id,k]=el.dataset.v4.split('.');state.objects[id][k]=n(el.value,state.objects[id][k]);});
    document.getElementById('dss4-apply').onclick=()=>refreshVector();
    document.getElementById('dss4-reset').onclick=()=>{state.objects=JSON.parse(JSON.stringify(DEFAULTS));buildEditor();refreshVector()};
  }
  function refreshVector(){if(!state.autoVector)return;packageText=vectorMaster();render()}

  function manifest(){const v=vals();return {package_version:'4.0',canvas:{width:W,height:H},pieces:8,design:v.design,team:v.team,player:v.player,venue:v.venue,model:v.garment,style:v.style,vector_art:true,layers:['L_BG_BASE','L_BG_EFFECTS','L_ART_MAIN','L_ORNAMENTS','L_ACCENTS'],objects:state.objects,manufacturer:{bleed:$('bleed').value||null,safe:$('safe').value||null,ppi:$('ppi').value||null,color_profile:$('profile').value||null,format:$('format').value||null,no_collar:$('collar').value==='yes'},status:factoryReady()?'READY_FOR_MANUFACTURER_REVIEW':'TECHNICAL_FIELDS_PENDING'} }
  function factoryReady(){return !!($('bleed').value&&$('safe').value&&$('profile').value&&$('format').value&&($('collar').value==='yes'||vals().garment!=='Samarreta sense coll'))}
  async function exportZip(){if(!state.autoVector)return alert('Genera primer el disseny vectorial.');if(typeof JSZip==='undefined')return alert('Motor ZIP no disponible.');const z=new JSZip();z.file('master.svg',vectorMaster());z.file('production.svg',finalSvg());z.file('manifest.json',JSON.stringify(manifest(),null,2));z.file('README.txt',`DSS VECTOR PACKAGE v4.0\nDisseny: ${vals().design}\nArtwork: vectorial i editable\nLogos: originals gestionats per DSS\nEstat fabricant: ${factoryReady()?'READY FOR MANUFACTURER REVIEW':'PENDENT dades tècniques del fabricant'}\n`);const b=await z.generateAsync({type:'blob',compression:'DEFLATE'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='DSS_VECTOR_PACKAGE_'+slug(vals().design)+'.zip';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)}

  function makeBrief(){const v=vals();return {design:v.design,team:v.team,venue:v.venue,player:v.player,garment:v.garment,style:v.style,colors:v.colors,elements:v.elements,free:v.free}}
  function encodeBrief(b){const s=JSON.stringify(b);const bytes=new TextEncoder().encode(s);let bin='';bytes.forEach(x=>bin+=String.fromCharCode(x));return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
  function decodeBrief(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const bin=atob(s);const bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));return JSON.parse(new TextDecoder().decode(bytes))}
  function designLink(){return location.origin+location.pathname+'#dss='+encodeBrief(makeBrief())}
  function applyBrief(b){const map={designName:b.design,teamName:b.team,venue:b.venue,player:b.player,garment:b.garment,style:b.style,freeBrief:b.free};Object.entries(map).forEach(([id,val])=>{if(val!=null&&$(id))$(id).value=val});if(Array.isArray(b.colors))b.colors.slice(0,5).forEach((c,i)=>{if($('c'+(i+1)))$('c'+(i+1)).value=c});if(b.elements)Object.entries(b.elements).forEach(([id,on])=>{if($(id))$(id).checked=!!on});}

  function injectUI(){
    const s2=document.getElementById('s2');if(s2){const card=document.createElement('div');card.className='dss4-card';card.innerHTML=`<div class="dss4-title">DSS v4 · Chat → Vector → Fabricant</div><div class="dss4-sub">Pots generar el disseny directament amb les dades del briefing, sense pujar cap fitxer. També pots compartir un enllaç que obre DSS amb el briefing carregat.</div><div><span class="dss4-chip">100% artwork vectorial</span><span class="dss4-chip">8 peces</span><span class="dss4-chip">objectes editables</span><span class="dss4-chip">SVG + ZIP</span></div><div class="dss4-row"><button id="dss4-generate" class="btn gold">Generar VECTOR MASTER</button><button id="dss4-copyLink" class="btn">Copiar enllaç del disseny</button></div>`;s2.insertBefore(card,s2.firstChild);document.getElementById('dss4-generate').onclick=generateVector;document.getElementById('dss4-copyLink').onclick=async()=>{const u=designLink();try{await navigator.clipboard.writeText(u);alert('Enllaç copiat.')}catch(e){prompt('Copia aquest enllaç:',u)}}}
    const exp=document.getElementById('exportProduction');if(exp){const b=document.createElement('button');b.id='dss4-exportZip';b.className='btn gold';b.textContent='Descarregar VECTOR PACKAGE.zip';exp.insertAdjacentElement('afterend',b);b.onclick=exportZip}
    const brand=document.querySelector('.brand small');if(brand)brand.textContent='v4.0 · VECTOR STUDIO · CHAT DIRECT';
    document.title='Darts Sublimation Studio v4.0';
  }

  artworkLayer=function(){if(state.autoVector&&packageText)return innerSvg(packageText);return (fileMode==='vector'&&packageText)?innerSvg(packageText):''};
  finalSvg=function(){const v=vals();const art=state.autoVector?objectArt(v):((fileMode==='vector'&&packageText)?innerSvg(packageText):'');return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-dss-production="4.0" data-vector-art="true">${defs()}${art}${overlay()}</svg>`};
  qa=function(){if(!document.getElementById('qa'))return;const rows=[['MASTER 17.812 × 9.809',true],['8 siluetes vectorials',PATHS.length===8],['Artwork vectorial generat',state.autoVector],['Objectes editables',state.autoVector],['Logos originals controlats per DSS',true],['Textos variables exactes',true],['Bleed confirmat',!!$('bleed').value],['Zona segura confirmada',!!$('safe').value],['Perfil color confirmat',!!$('profile').value],['Format final confirmat',!!$('format').value],['Model sense coll confirmat',vals().garment!=='Samarreta sense coll'||$('collar').value==='yes'],['READY per revisió fabricant',factoryReady()&&state.autoVector]];document.getElementById('qa').innerHTML=rows.map(([t,ok])=>`<div class="${ok?'ok':'warn'}">${ok?'✓':'⚠'} ${t}</div>`).join('')};
  const oldProd=document.getElementById('exportProduction');if(oldProd)oldProd.onclick=()=>{if(!state.autoVector)return alert('Prem “Generar VECTOR MASTER” abans d’exportar.');dlText(finalSvg(),'DSS_VECTOR_PRODUCTION_'+slug(vals().design)+'.svg','image/svg+xml')};

  injectStyle();injectUI();
  ['designName','teamName','venue','player','style','freeBrief','c1','c2','c3','c4','c5','bleed','safe','profile','format','collar'].forEach(id=>{if($(id))$(id).addEventListener('input',()=>{if(state.autoVector)refreshVector();qa()})});
  try{const m=location.hash.match(/^#dss=(.+)$/);if(m){const b=decodeBrief(m[1]);applyBrief(b);setTimeout(()=>{generateVector()},200)}}catch(e){console.warn('DSS link invàlid',e)}
  window.DSS4={generateVector,designLink,encodeBrief,decodeBrief,manifest,exportZip};
})();
