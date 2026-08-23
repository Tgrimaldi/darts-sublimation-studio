(() => {
  'use strict';
  const VERSION='4.2';
  const byId=id=>document.getElementById(id);
  const buttons=()=>Array.from(document.querySelectorAll('button'));
  const findButton=t=>buttons().find(b=>(b.textContent||'').toLowerCase().includes(t.toLowerCase()));
  const goStep=n=>{
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    byId('s'+n)?.classList.add('active');
    document.querySelectorAll('.step').forEach(s=>s.classList.toggle('active',Number(s.dataset.step)===n));
    window.scrollTo({top:0,behavior:'smooth'});
  };
  const wait=(fn,timeout=6000)=>new Promise((resolve,reject)=>{
    const start=Date.now();
    const tick=()=>{try{const v=fn();if(v)return resolve(v)}catch(e){} if(Date.now()-start>timeout)return reject(new Error('timeout'));setTimeout(tick,80)};tick();
  });
  function style(){
    const s=document.createElement('style');
    s.textContent=`
      .dss42-final{border:1px solid #8b6a18;background:linear-gradient(135deg,#15170f,#091018);border-radius:16px;padding:16px;margin:14px 0;box-shadow:0 12px 40px rgba(0,0,0,.22)}
      .dss42-title{font-size:18px;font-weight:900;color:var(--gold);margin-bottom:5px}.dss42-sub{font-size:12px;line-height:1.5;color:var(--muted)}
      .dss42-btn{width:100%;margin-top:12px;min-height:54px;font-size:16px}.dss42-status{margin-top:10px;border:1px solid var(--line);border-radius:10px;padding:10px;font-size:12px;color:var(--muted)}
      .dss42-status.ok{border-color:#2e6544;color:var(--ok)}.dss42-status.warn{border-color:#6e5b28;color:var(--warn)}.dss42-status.bad{border-color:#743636;color:var(--bad)}
      .dss42-downloads{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}@media(max-width:700px){.dss42-downloads{grid-template-columns:1fr}}
    `;document.head.appendChild(s);
  }
  function installCard(){
    const s1=byId('s1'); if(!s1||byId('dss42Final'))return;
    const card=document.createElement('div'); card.id='dss42Final'; card.className='dss42-final';
    card.innerHTML=`<div class="dss42-title">DSS v4.2 · RESULTAT FINAL</div><div class="dss42-sub">Escriu el briefing i prem un sol botó. DSS generarà el VECTOR MASTER, aplicarà el motor premium, obrirà la previsualització i deixarà preparats els arxius d'exportació.</div><button id="dss42Generate" class="btn gold dss42-btn">GENERAR SAMARRETA FINAL</button><div id="dss42Status" class="dss42-status">Preparat.</div>`;
    s1.insertBefore(card,s1.firstChild);
    byId('dss42Generate').onclick=generateFinal;
  }
  function setStatus(msg,cls=''){const el=byId('dss42Status');if(!el)return;el.className='dss42-status '+cls;el.innerHTML=msg}
  async function generateFinal(){
    const btn=byId('dss42Generate'); if(btn)btn.disabled=true;
    try{
      setStatus('1/4 · Preparant briefing i recepta creativa…','warn');
      goStep(2); await new Promise(r=>setTimeout(r,120));
      let gen=findButton('Generar VECTOR MASTER');
      if(!gen){await wait(()=>findButton('Generar VECTOR MASTER'),3000);gen=findButton('Generar VECTOR MASTER')}
      if(!gen)throw new Error('No trobo el motor VECTOR MASTER');
      setStatus('2/4 · Generant les 8 peces vectorials…','warn'); gen.click();
      goStep(3);
      await wait(()=>byId('preview')?.querySelector('svg'),5000);
      await new Promise(r=>setTimeout(r,450));
      const premium=findButton('Aplicar Premium Recipe'); if(premium)premium.click();
      await new Promise(r=>setTimeout(r,350));
      const svg=byId('preview')?.querySelector('svg');
      if(!svg)throw new Error('No s’ha pogut generar la previsualització');
      svg.setAttribute('data-dss-final',VERSION);
      setStatus('3/4 · Composició premium aplicada. Revisa el disseny i, si cal, ajusta objectes.','ok');
      installFinalDownloads();
    }catch(e){setStatus('Error: '+(e.message||e),'bad')}finally{if(btn)btn.disabled=false}
  }
  function clickExisting(label){const b=findButton(label);if(b){b.click();return true}return false}
  function installFinalDownloads(){
    const s3=byId('s3'); if(!s3||byId('dss42Downloads'))return;
    const card=document.createElement('div');card.id='dss42Downloads';card.className='dss42-final';
    card.innerHTML=`<div class="dss42-title">Exportació final</div><div class="dss42-sub">Quan la composició estigui correcta, descarrega els arxius finals. El QA de fabricant continua bloquejant l'etiqueta “ready” fins tenir bleed, safe area, perfil de color i format confirmats.</div><div class="dss42-downloads"><button id="dss42Svg" class="btn gold">Descarregar SVG FINAL</button><button id="dss42Zip" class="btn">Descarregar VECTOR PACKAGE.zip</button></div><button id="dss42QA" class="btn wide" style="margin-top:8px">Anar a QA / Fabricant</button>`;
    s3.appendChild(card);
    byId('dss42Svg').onclick=()=>{if(!clickExisting('Exportar PRODUCTION.svg'))clickExisting('Exportar SVG')};
    byId('dss42Zip').onclick=()=>{if(!clickExisting('VECTOR PACKAGE.zip'))clickExisting('VECTOR PACKAGE')};
    byId('dss42QA').onclick=()=>goStep(4);
  }
  function chatLinkAutostart(){
    if(!location.hash.includes('dss='))return;
    setTimeout(()=>{const btn=byId('dss42Generate'); if(btn)btn.click()},650);
  }
  function boot(){
    style();installCard();
    const brand=document.querySelector('.brand small');if(brand)brand.textContent='v4.2 · FINAL AI → VECTOR → SUBLIMATION';
    const uploadCard=byId('artFile')?.closest('.card'); if(uploadCard){const h=uploadCard.querySelector('h2');if(h)h.textContent='Artwork extern (opcional / compatibilitat)';}
    chatLinkAutostart();
    console.info('DSS v4.2 Final flow loaded');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,700));else setTimeout(boot,700);
})();
