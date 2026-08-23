(() => {
  'use strict';
  const VERSION='4.4';
  const byId=id=>document.getElementById(id);
  const buttons=()=>Array.from(document.querySelectorAll('button'));
  const findButton=t=>buttons().find(b=>(b.textContent||'').toLowerCase().includes(t.toLowerCase()));
  const goStep=n=>{
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    byId('s'+n)?.classList.add('active');
    document.querySelectorAll('.step').forEach(s=>s.classList.toggle('active',Number(s.dataset.step)===n));
    window.scrollTo({top:0,behavior:'smooth'});
  };
  const wait=(fn,timeout=8000)=>new Promise((resolve,reject)=>{const start=Date.now();const tick=()=>{try{const v=fn();if(v)return resolve(v)}catch(e){}if(Date.now()-start>timeout)return reject(new Error('timeout'));setTimeout(tick,90)};tick()});
  const slug=s=>String(s||'DESIGN').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'_').replace(/^_+|_+$/g,'').toUpperCase()||'DESIGN';
  const currentDesign=()=>byId('designName')?.value||'DESIGN';

  function style(){
    const s=document.createElement('style');s.textContent=`
      .dss42-final{border:1px solid #8b6a18;background:linear-gradient(135deg,#15170f,#091018);border-radius:16px;padding:16px;margin:14px 0;box-shadow:0 12px 40px rgba(0,0,0,.22)}
      .dss42-title{font-size:18px;font-weight:900;color:var(--gold);margin-bottom:5px}.dss42-sub{font-size:12px;line-height:1.5;color:var(--muted)}
      .dss42-btn{width:100%;margin-top:12px;min-height:54px;font-size:16px}.dss42-status{margin-top:10px;border:1px solid var(--line);border-radius:10px;padding:10px;font-size:12px;color:var(--muted)}
      .dss42-status.ok{border-color:#2e6544;color:var(--ok)}.dss42-status.warn{border-color:#6e5b28;color:var(--warn)}.dss42-status.bad{border-color:#743636;color:var(--bad)}
      .dss42-downloads{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.dss43-audit{margin-top:10px;font-size:11px;line-height:1.5;color:var(--muted)}
      @media(max-width:700px){.dss42-downloads{grid-template-columns:1fr}}
    `;document.head.appendChild(s);
  }
  function installCard(){
    const s1=byId('s1');if(!s1||byId('dss42Final'))return;
    const card=document.createElement('div');card.id='dss42Final';card.className='dss42-final';
    card.innerHTML=`<div class="dss42-title">DSS v4.4 · HERITAGE PREMIUM FINAL</div><div class="dss42-sub">Un sol botó: VECTOR MASTER → recepta premium → motor Heritage amb roda gitana, carruatge/cavall, dards, filigrana i composició completa → exportació exacta del master visible.</div><button id="dss42Generate" class="btn gold dss42-btn">GENERAR SAMARRETA FINAL</button><div id="dss42Status" class="dss42-status">Preparat.</div>`;
    s1.insertBefore(card,s1.firstChild);byId('dss42Generate').onclick=generateFinal;
  }
  function setStatus(msg,cls=''){const el=byId('dss42Status');if(!el)return;el.className='dss42-status '+cls;el.innerHTML=msg}
  function activeSvg(){return byId('preview')?.querySelector('svg')||null}
  function audit(svg){
    if(!svg)return {ok:false,msg:'No hi ha SVG'};
    const pieces=[...Array(8)].map((_,i)=>svg.querySelector('#ART_P'+(i+1))).filter(Boolean).length;
    const premium=svg.querySelectorAll('[id^="DSS41_P"]').length;
    const heritage=svg.querySelectorAll('[id^="DSS44_P"]').length;
    const uses=svg.querySelectorAll('use').length;
    const visualTier=svg.getAttribute('data-dss-visual-tier')||'';
    const ok=pieces===8&&premium>=6&&heritage===8&&visualTier==='premium-heritage';
    return {ok,pieces,premium,heritage,uses,visualTier,msg:`${pieces}/8 peces · ${premium} capes premium · ${heritage}/8 Heritage · ${uses} objectes vectorials`};
  }
  async function generateFinal(){
    const btn=byId('dss42Generate');if(btn)btn.disabled=true;
    try{
      setStatus('1/6 · Preparant briefing…','warn');goStep(2);await new Promise(r=>setTimeout(r,180));
      let gen=findButton('Generar VECTOR MASTER');if(!gen){await wait(()=>findButton('Generar VECTOR MASTER'),4000);gen=findButton('Generar VECTOR MASTER')}
      if(!gen)throw new Error('No trobo el motor VECTOR MASTER');
      setStatus('2/6 · Generant les 8 peces i objectes vectorials…','warn');gen.click();goStep(3);
      await wait(()=>activeSvg(),6500);await new Promise(r=>setTimeout(r,700));
      const premium=findButton('Aplicar Premium Recipe');if(premium)premium.click();
      setStatus('3/6 · Aplicant composició premium Heritage…','warn');
      await wait(()=>activeSvg()?.querySelectorAll('[id^="DSS44_P"]').length===8,5000);
      const svg=activeSvg();if(!svg)throw new Error('No s’ha pogut generar la previsualització');
      svg.setAttribute('data-dss-final',VERSION);svg.setAttribute('data-dss-export-source','live-preview');
      const a=audit(svg);if(!a.ok)throw new Error('El master visual no ha passat el Quality Gate: '+a.msg);
      setStatus('4/6 · QUALITY GATE OK · '+a.msg+'. Revisa visualment i exporta.','ok');installFinalDownloads();
    }catch(e){setStatus('PROVA NO VÀLIDA · '+(e.message||e),'bad')}finally{if(btn)btn.disabled=false}
  }
  function serializedSvg(){
    const svg=activeSvg();if(!svg)throw new Error('No hi ha master actiu');
    const a=audit(svg);if(!a.ok)throw new Error('Quality Gate no superat: '+a.msg);
    const clone=svg.cloneNode(true);clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('data-dss-production',VERSION);clone.setAttribute('data-dss-export-source','live-preview');return new XMLSerializer().serializeToString(clone);
  }
  function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1800)}
  function exportExactSvg(){try{const out=serializedSvg();downloadBlob(new Blob([out],{type:'image/svg+xml'}),`DSS_FINAL_${slug(currentDesign())}.svg`);setStatus('5/6 · SVG FINAL descarregat des del master premium visible.','ok')}catch(e){setStatus('Error exportant SVG: '+e.message,'bad')}}
  async function exportExactPng(){
    try{const out=serializedSvg(),blob=new Blob([out],{type:'image/svg+xml'}),url=URL.createObjectURL(blob),img=new Image();await new Promise((res,rej)=>{img.onload=res;img.onerror=rej;img.src=url});const maxW=4096,w=maxW,h=Math.round(maxW*9809/17812),c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');ctx.fillStyle='#111';ctx.fillRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);URL.revokeObjectURL(url);const png=await new Promise(res=>c.toBlob(res,'image/png',0.95));downloadBlob(png,`DSS_PREVIEW_${slug(currentDesign())}.png`);setStatus('5/6 · PREVIEW EXACTE generat des del master premium.','ok')}catch(e){setStatus('Error exportant PREVIEW: '+(e.message||e),'bad')}
  }
  function clickExisting(label){const b=findButton(label);if(b){b.click();return true}return false}
  function installFinalDownloads(){
    const s3=byId('s3');if(!s3)return;let card=byId('dss42Downloads');if(card)card.remove();card=document.createElement('div');card.id='dss42Downloads';card.className='dss42-final';const a=audit(activeSvg());
    card.innerHTML=`<div class="dss42-title">Exportació final v4.4</div><div class="dss42-sub">El fitxer final és una còpia serialitzada del master que veus ara mateix: capes premium + Heritage + objectes vectorials + textos/logos controlats per DSS.</div><div class="dss43-audit">Quality Gate: <b>${a.ok?'OK':'ERROR'}</b> · ${a.msg}</div><div class="dss42-downloads"><button id="dss42Svg" class="btn gold">Descarregar SVG FINAL</button><button id="dss43Png" class="btn">Descarregar PREVIEW EXACTE</button></div><div class="dss42-downloads"><button id="dss42Zip" class="btn">Descarregar VECTOR PACKAGE.zip</button><button id="dss42QA" class="btn">Anar a QA / Fabricant</button></div>`;
    s3.appendChild(card);byId('dss42Svg').onclick=exportExactSvg;byId('dss43Png').onclick=exportExactPng;byId('dss42Zip').onclick=()=>{if(!clickExisting('VECTOR PACKAGE.zip'))clickExisting('VECTOR PACKAGE')};byId('dss42QA').onclick=()=>goStep(4);
  }
  function chatLinkAutostart(){if(!location.hash.includes('dss='))return;setTimeout(()=>byId('dss42Generate')?.click(),850)}
  function boot(){style();installCard();const brand=document.querySelector('.brand small');if(brand)brand.textContent='v4.4 · HERITAGE PREMIUM · MASTER = EXPORT';const uploadCard=byId('artFile')?.closest('.card');if(uploadCard){const h=uploadCard.querySelector('h2');if(h)h.textContent='Artwork extern (opcional / compatibilitat)'}chatLinkAutostart();console.info('DSS v4.4 Heritage final flow loaded')}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,900));else setTimeout(boot,900);
})();
