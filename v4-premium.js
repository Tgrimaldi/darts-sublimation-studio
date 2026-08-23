(() => {
  'use strict';
  const VERSION='4.1';
  const $id=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  const hash=s=>{let h=2166136261>>>0;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
  const rng=seed=>{let t=seed>>>0;return()=>{t+=0x6D2B79F5;let r=Math.imul(t^t>>>15,1|t);r^=r+Math.imul(r^r>>>7,61|r);return((r^r>>>14)>>>0)/4294967296}};
  const current=()=>window.vals?vals():{design:$id('designName')?.value||'DESIGN',team:$id('teamName')?.value||'',venue:$id('venue')?.value||'',player:$id('player')?.value||'',style:$id('style')?.value||'',free:$id('freeBrief')?.value||'',colors:['c1','c2','c3','c4','c5'].map(id=>$id(id)?.value||'#111111')};
  const state={variation:Number(localStorage.getItem('dss41-variation')||1),intensity:Number(localStorage.getItem('dss41-intensity')||82)};

  function injectStyle(){
    const s=document.createElement('style');
    s.textContent=`.dss41-card{border:1px solid #82671d;background:linear-gradient(180deg,#15170f,#0a1016);border-radius:15px;padding:14px;margin:12px 0}.dss41-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}.dss41-title{font-weight:900;color:var(--gold);font-size:15px}.dss41-badge{font-size:11px;border:1px solid #82671d;border-radius:999px;padding:5px 9px;color:#f1c85f}.dss41-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:10px}.dss41-metric{background:#091017;border:1px solid var(--line);border-radius:10px;padding:9px;font-size:11px;color:var(--muted)}.dss41-metric b{display:block;color:var(--text);font-size:12px;margin-bottom:3px}.dss41-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.dss41-actions .btn{flex:1;min-width:135px}.dss41-range{margin-top:10px}@media(max-width:700px){.dss41-grid{grid-template-columns:1fr}}`;
    document.head.appendChild(s);
  }
  function recipe(v){
    const txt=(v.style+' '+v.free+' '+v.design).toLowerCase();
    let family='premium';
    if(/cyber|neon|futur/.test(txt)) family='cyber';
    else if(/foc|fire|energia|flame/.test(txt)) family='energy';
    else if(/geom|modern|minimal/.test(txt)) family='geometric';
    else if(/lux|eleg|gold|daurat|premium|gitana|gipsy/.test(txt)) family='heritage';
    const seed=hash([v.design,v.team,v.venue,v.style,state.variation].join('|'));
    return {family,seed,variation:state.variation,intensity:state.intensity,palette:{base:v.colors?.[0]||'#05070a',a:v.colors?.[1]||'#123f91',b:v.colors?.[2]||'#08713f',c:v.colors?.[3]||'#c71921',metal:v.colors?.[4]||'#d6aa43'}};
  }
  function premiumDefs(r){
    const p=r.palette;
    return `<defs id="dss41-defs"><linearGradient id="p41metal" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#5f3b0d"/><stop offset=".22" stop-color="${p.metal}"/><stop offset=".48" stop-color="#fff0ad"/><stop offset=".72" stop-color="${p.metal}"/><stop offset="1" stop-color="#68430f"/></linearGradient><radialGradient id="p41glow"><stop stop-color="${p.metal}" stop-opacity=".33"/><stop offset="1" stop-color="${p.metal}" stop-opacity="0"/></radialGradient><pattern id="p41diag" width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><path d="M0 0V120 M60 0V120" stroke="#fff" stroke-opacity=".025" stroke-width="10"/></pattern></defs>`;
  }
  function ribbons(r,x,y,w,h,seed){
    const R=rng(seed),p=r.palette,cols=[p.a,p.b,p.c],out=[];
    cols.forEach((c,ci)=>{for(let i=0;i<7;i++){const yy=y+(i+.4)*h/7+(R()-.5)*140,sx=x-150+ci*w*.08,ex=x+w+150,bend=(R()-.5)*h*.45,sw=42+R()*75;out.push(`<path d="M${sx} ${yy} C${x+w*.28} ${yy-bend} ${x+w*.62} ${yy+bend*.65} ${ex} ${yy-bend*.18}" fill="none" stroke="${c}" stroke-width="${sw.toFixed(0)}" stroke-linecap="round" opacity="${(.34+R()*.34).toFixed(2)}"/>`)}});
    return `<g data-premium="ribbons">${out.join('')}</g>`;
  }
  function particles(r,x,y,w,h,seed){const R=rng(seed),p=r.palette,out=[];for(let i=0;i<55;i++){const px=x+R()*w,py=y+R()*h,rr=5+R()*17;out.push(`<circle cx="${px.toFixed(0)}" cy="${py.toFixed(0)}" r="${rr.toFixed(0)}" fill="${i%4===0?p.metal:'#ffffff'}" opacity="${(.05+R()*.17).toFixed(2)}"/>`)}return `<g data-premium="particles">${out.join('')}</g>`}
  function architecture(r,cx,cy,w,h,seed){const R=rng(seed),out=[`<ellipse cx="${cx}" cy="${cy}" rx="${w*.48}" ry="${h*.47}" fill="url(#p41glow)"/>`];for(let i=0;i<9;i++){const off=(i-4)*w*.075;out.push(`<path d="M${cx+off} ${cy-h*.48} C${cx+off-w*.08} ${cy-h*.18} ${cx+off+w*.08} ${cy+h*.16} ${cx+off} ${cy+h*.48}" fill="none" stroke="url(#p41metal)" stroke-width="${18+(i%3)*8}" opacity="${.32+R()*.33}"/>`)}out.push(`<path d="M${cx-w*.48} ${cy+h*.28} C${cx-w*.18} ${cy+h*.05} ${cx+w*.18} ${cy+h*.05} ${cx+w*.48} ${cy+h*.28}" fill="none" stroke="url(#p41metal)" stroke-width="36"/>`);return `<g data-premium="architecture">${out.join('')}</g>`}
  function corners(x,y,w,h){return `<g data-premium="corners" fill="none" stroke="url(#p41metal)" stroke-linecap="round"><path d="M${x} ${y+h*.18} Q${x+w*.12} ${y+h*.02} ${x+w*.28} ${y} M${x+w*.72} ${y} Q${x+w*.88} ${y+h*.02} ${x+w} ${y+h*.18}" stroke-width="27"/><path d="M${x} ${y+h*.82} Q${x+w*.12} ${y+h*.98} ${x+w*.28} ${y+h} M${x+w*.72} ${y+h} Q${x+w*.88} ${y+h*.98} ${x+w} ${y+h*.82}" stroke-width="20" opacity=".7"/></g>`}
  function decoration(id,r){
    const k=r.intensity/100,seed=r.seed+id*101;
    if(id===3)return `<g id="DSS41_P3" data-layer="L_PREMIUM_EFFECTS" opacity="${k}"><rect width="17812" height="9809" fill="url(#p41diag)"/>${ribbons(r,250,3150,5600,5600,seed)}${particles(r,250,3100,5600,6000,seed+7)}${architecture(r,3100,6100,3500,4700,seed+9)}${corners(420,3000,5200,6100)}<path d="M520 8850 C1750 8350 4300 8350 5750 9000" fill="none" stroke="url(#p41metal)" stroke-width="52"/></g>`;
    if(id===4)return `<g id="DSS41_P4" data-layer="L_PREMIUM_EFFECTS" opacity="${k}"><rect width="17812" height="9809" fill="url(#p41diag)"/>${ribbons(r,6500,3600,5850,5200,seed)}${particles(r,6600,3700,5700,5000,seed+7)}${architecture(r,9460,6700,4200,3600,seed+9)}${corners(6800,3300,5250,5700)}<path d="M6750 8950 C8100 8470 10850 8470 12100 9000" fill="none" stroke="url(#p41metal)" stroke-width="52"/></g>`;
    if(id===7||id===8){const y=id===7?4300:7280;return `<g id="DSS41_P${id}" data-layer="L_PREMIUM_EFFECTS" opacity="${k}">${ribbons(r,12700,y,5000,2100,seed)}<path d="M12950 ${y+1780} C14350 ${y+1500} 16250 ${y+1500} 17500 ${y+1760}" fill="none" stroke="url(#p41metal)" stroke-width="45"/>${particles(r,12900,y,4500,1900,seed+4)}</g>`}
    if(id===1||id===2){const x=id===1?6750:200;return `<g id="DSS41_P${id}" data-layer="L_PREMIUM_EFFECTS" opacity="${k}">${ribbons(r,x,80,5300,1200,seed)}<path d="M${x+100} 1120 C${x+1800} 880 ${x+3550} 880 ${x+5200} 1140" fill="none" stroke="url(#p41metal)" stroke-width="42"/></g>`}
    if(id===5||id===6){const y=id===5?1930:2900;return `<g id="DSS41_P${id}" data-layer="L_PREMIUM_EFFECTS" opacity="${k}">${ribbons(r,12500,y,5200,700,seed)}<path d="M12600 ${y+520} C14200 ${y+690} 16050 ${y+690} 17650 ${y+500}" fill="none" stroke="url(#p41metal)" stroke-width="35"/></g>`}
    return '';
  }
  function updatePanel(r){const el=$id('dss41Recipe');if(!el)return;el.innerHTML=`<div class="dss41-grid"><div class="dss41-metric"><b>Motor creatiu</b>${esc(r.family)} · variació ${r.variation}</div><div class="dss41-metric"><b>Intensitat premium</b>${r.intensity}%</div><div class="dss41-metric"><b>Sortida</b>SVG vectorial editable + objectes DSS</div><div class="dss41-metric"><b>Producció</b>8 peces · plantilla K-VSE · QA obligatori</div></div>`}
  function enhance(){
    const host=$id('preview'),svg=host?.querySelector('svg');if(!svg||svg.dataset.dss41==='1')return;
    const r=recipe(current());svg.dataset.dss41='1';svg.setAttribute('data-dss-premium',VERSION);
    const d=new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${premiumDefs(r)}</svg>`,'image/svg+xml'),defNode=d.documentElement.firstElementChild,oldDefs=svg.querySelector('defs');
    if(oldDefs)oldDefs.append(...Array.from(defNode.children).map(n=>document.importNode(n,true)));else svg.insertBefore(document.importNode(defNode,true),svg.firstChild);
    for(let id=1;id<=8;id++){const g=svg.querySelector(`#ART_P${id}`);if(!g)continue;const doc=new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${decoration(id,r)}</svg>`,'image/svg+xml'),node=doc.documentElement.firstElementChild;if(node)g.insertBefore(document.importNode(node,true),g.children[Math.min(2,g.children.length)]||null)}
    updatePanel(r);
  }
  function force(){const svg=$id('preview')?.querySelector('svg');svg?.querySelectorAll('[id^="DSS41_P"]').forEach(n=>n.remove());svg?.querySelector('#dss41-defs')?.remove();svg?.removeAttribute('data-dss41');enhance()}
  function buildPanel(){
    const s3=$id('s3');if(!s3||$id('dss41Panel'))return;const card=document.createElement('div');card.id='dss41Panel';card.className='dss41-card';card.innerHTML=`<div class="dss41-head"><div class="dss41-title">DSS v4.1 · Premium Design Recipe</div><span class="dss41-badge">VECTOR + OBJECTS + QA</span></div><div id="dss41Recipe"></div><label class="dss41-range">Intensitat visual <input id="dss41Intensity" type="range" min="45" max="100" value="${state.intensity}"></label><div class="dss41-actions"><button class="btn" id="dss41Var">Nova variació premium</button><button class="btn gold" id="dss41Apply">Aplicar Premium Recipe</button></div>`;const previewCard=$id('preview')?.closest('.card');s3.insertBefore(card,previewCard||null);$id('dss41Intensity').oninput=e=>{state.intensity=Number(e.target.value);localStorage.setItem('dss41-intensity',state.intensity);force()};$id('dss41Var').onclick=()=>{state.variation=state.variation%9+1;localStorage.setItem('dss41-variation',state.variation);force()};$id('dss41Apply').onclick=force;updatePanel(recipe(current()))
  }
  function interceptExport(){const b=$id('exportProduction');if(!b||b.dataset.dss41)return;b.dataset.dss41='1';b.addEventListener('click',()=>{const svg=$id('preview')?.querySelector('svg');if(!svg)return;setTimeout(()=>{const out=svg.outerHTML.replace('<svg ','<svg data-dss-production="4.1" '),a=document.createElement('a'),blob=new Blob([out],{type:'image/svg+xml'});a.href=URL.createObjectURL(blob);a.download='DSS_PREMIUM_'+String(current().design||'DESIGN').replace(/\W+/g,'_')+'.svg';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1200)},120)})}
  function observe(){const host=$id('preview');if(!host)return;let timer=0;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(enhance,40)}).observe(host,{childList:true,subtree:false});document.addEventListener('click',e=>{if(e.target?.textContent?.includes('Aplicar canvis'))setTimeout(enhance,80)},true);enhance()}
  function boot(){injectStyle();buildPanel();interceptExport();observe();const brand=document.querySelector('.brand small');if(brand)brand.textContent='v4.1 · PREMIUM VECTOR STUDIO · CHAT DIRECT';console.info('DSS v4.1 Premium Recipe loaded')}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,350));else setTimeout(boot,350);
})();
