(() => {
  const style = document.createElement('style');
  style.textContent = `
    body{padding-top:max(14px,env(safe-area-inset-top));padding-bottom:env(safe-area-inset-bottom)}
    .app{padding-left:max(18px,env(safe-area-inset-left));padding-right:max(18px,env(safe-area-inset-right))}
    .layers{display:grid;gap:8px;margin-top:12px}.layerRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:#0c1219}.layerRow label{display:flex;align-items:center;gap:10px;margin:0}.layerRow input{width:auto}.layerMeta{font-size:12px;color:var(--muted)}
    .v3badge{display:inline-block;padding:5px 9px;border:1px solid #6d5718;border-radius:999px;color:var(--gold);font-size:12px;margin-top:8px}
  `;
  document.head.appendChild(style);

  const status = $('artStatus');
  const input = $('artFile');
  input.accept = '.zip,.svg,application/zip,image/svg+xml,image/png,image/jpeg,image/webp';
  const panel = document.createElement('div');
  panel.id = 'layerPanel';
  panel.style.display = 'none';
  panel.innerHTML = '<h3>Capes del disseny</h3><div id="layers" class="layers"></div>';
  status.insertAdjacentElement('afterend', panel);

  const info = document.createElement('div');
  info.className = 'v3badge';
  info.textContent = 'DSS_LAYERED_PACKAGE v3.0 · editable per capes';
  status.insertAdjacentElement('beforebegin', info);

  const prodBtn = $('exportProduction');
  const layerBtn = document.createElement('button');
  layerBtn.id = 'exportLayered';
  layerBtn.className = 'btn';
  layerBtn.textContent = 'Descarregar LAYERED.zip';
  prodBtn.insertAdjacentElement('afterend', layerBtn);

  const receiveCard = document.querySelector('#s2 .card:nth-of-type(2) .status');
  if (receiveCard) receiveCard.innerHTML = '<b>Format preferit:</b> <code>DSS_LAYERED_PACKAGE_NOM.zip</code><br><code>manifest.json</code> + <code>master.svg</code> + <code>assets/</code> · 8 peces · capes editables · sense mockup · sense logos recreats · sense textos fixats.';
  const sendStatus = document.querySelector('#s2 .card:first-child .status');
  if (sendStatus) sendStatus.innerHTML = 'El botó daurat <b>copia el PROMPT DE PRODUCCIÓ i obre directament aquest xat de DSS</b>. ChatGPT t\'ha de retornar <b>un únic ZIP DSS_LAYERED_PACKAGE v3.0</b> amb master.svg, manifest i assets separats.';

  let layeredManifest = null, layeredZipBlob = null, layeredLayers = [], layeredEnabled = {};
  const oldArtworkLayer = artworkLayer;

  function resetLayered(){ layeredManifest=null; layeredZipBlob=null; layeredLayers=[]; layeredEnabled={}; panel.style.display='none'; $('layers').innerHTML=''; }
  function ensureJSZip(){
    if (window.JSZip) return Promise.resolve();
    return new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src='https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
      s.onload=resolve; s.onerror=()=>reject(new Error('No s\'ha pogut carregar JSZip'));
      document.head.appendChild(s);
    });
  }
  function showLayerControls(){
    if(!layeredLayers.length){panel.style.display='none';return;}
    panel.style.display='block';
    $('layers').innerHTML=layeredLayers.map(l=>`<div class="layerRow"><label><input type="checkbox" data-layer="${esc(l.id)}" ${layeredEnabled[l.id]!==false?'checked':''}><span>${esc(l.label||l.id)}</span></label><span class="layerMeta">${esc(l.type||'layer')}${l.editable===false?' · bloquejada':' · editable'}</span></div>`).join('');
    document.querySelectorAll('[data-layer]').forEach(el=>el.onchange=()=>{layeredEnabled[el.dataset.layer]=el.checked;render();});
  }
  function activeLayeredSvg(){
    try{
      const doc=new DOMParser().parseFromString(packageText,'image/svg+xml');
      Object.entries(layeredEnabled).forEach(([id,on])=>{
        doc.querySelectorAll(`[data-layer="${CSS.escape(id)}"]`).forEach(n=>{ if(!on)n.setAttribute('display','none'); });
      });
      return new XMLSerializer().serializeToString(doc.documentElement);
    }catch(e){ return packageText; }
  }
  async function validateLayeredZip(file){
    resetLayered(); packageValid=false; packageIssues=[]; packageText=''; rasterData=''; rasterW=rasterH=0; fileMode='layered'; layeredZipBlob=file;
    try{
      await ensureJSZip();
      const zip=await JSZip.loadAsync(file);
      const mf=zip.file('manifest.json'), ms=zip.file('master.svg');
      if(!mf) packageIssues.push('falta manifest.json');
      if(!ms) packageIssues.push('falta master.svg');
      if(packageIssues.length) throw new Error('estructura incompleta');
      layeredManifest=JSON.parse(await mf.async('string'));
      packageText=await ms.async('string');
      if(String(layeredManifest.package_version)!=='3.0') packageIssues.push('package_version ha de ser 3.0');
      if(!layeredManifest.canvas || Number(layeredManifest.canvas.width)!==W || Number(layeredManifest.canvas.height)!==H) packageIssues.push('canvas del manifest incorrecte');
      if(Number(layeredManifest.pieces)!==8) packageIssues.push('pieces ha de ser 8');
      const doc=new DOMParser().parseFromString(packageText,'image/svg+xml'), root=doc.documentElement;
      const vb=(root.getAttribute('viewBox')||'').trim().split(/\s+/).map(Number);
      if(vb.length!==4||vb[0]!==0||vb[1]!==0||vb[2]!==W||vb[3]!==H) packageIssues.push('viewBox de master.svg incorrecte');
      if(root.getAttribute('data-dss-package')!=='3.0') packageIssues.push('master.svg necessita data-dss-package="3.0"');
      for(let i=1;i<=8;i++) if(!doc.getElementById('ART_P'+i)) packageIssues.push('falta ART_P'+i);
      layeredLayers=Array.isArray(layeredManifest.layers)?layeredManifest.layers:[];
      if(!layeredLayers.length) packageIssues.push('manifest sense capes');
      layeredLayers.forEach(l=>{
        layeredEnabled[l.id]=true;
        if(!doc.querySelector(`[data-layer="${CSS.escape(l.id)}"]`)) packageIssues.push('master.svg no conté capa '+l.id);
      });
      packageValid=packageIssues.length===0;
      showLayerControls();
      status.className='status '+(packageValid?'ok':'bad');
      status.innerHTML=packageValid?`<b>DSS_LAYERED_PACKAGE v3.0 vàlid</b><br>${esc(file.name)} · 8 peces · ${layeredLayers.length} capes editables · canvas correcte.`:`<b>DSS_LAYERED_PACKAGE amb errors</b><br>${packageIssues.map(x=>'• '+esc(x)).join('<br>')}`;
      render();
    }catch(err){
      if(!packageIssues.length) packageIssues.push(String(err.message||err));
      status.className='status bad'; status.innerHTML=`<b>DSS_LAYERED_PACKAGE amb errors</b><br>${packageIssues.map(x=>'• '+esc(x)).join('<br>')}`; qa();
    }
  }

  promptText = function(){
    const v=vals(),els=Object.entries(v.elements).filter(x=>x[1]).map(x=>x[0]).join(', ');
    return `DARTS SUBLIMATION STUDIO — CONTRACTE DSS_LAYERED_PACKAGE v3.0

CREA UN PAQUET D'ARTWORK PROFESSIONAL PER CAPES. NO CREÏS UN MOCKUP, UNA LÀMINA, UNA PRESENTACIÓ NI UN COLLAGE.

BRIEFING
Disseny: ${v.design}
Equip: ${v.team}
Local: ${v.venue}
Jugador de mostra: ${v.player}
Model: ${v.garment}
Estil: ${v.style}
Colors: ${v.colors.join(' · ')}
Elements: ${els}
Instrucció lliure: ${v.free}

NIVELL VISUAL OBLIGATORI
- Qualitat visual de samarreta premium de competició, rica en textura, profunditat, il·lustració i acabat, al nivell dels conceptes visuals aprovats del projecte.
- Fons negre/texturat, efectes i pinzellades independents.
- Il·lustracions principals separades: roda gitana, carruatge/cavall, dards i ornaments.
- Filigranes i geometria esportiva separades.
- Frontal i esquena amb composicions pròpies i coherents.
- Mànigues i peces auxiliars integrades amb el llenguatge visual general.
- Evita una aparença esquemàtica o de simple línia vectorial.

FORMAT DE LLIURAMENT
Retorna un únic ZIP anomenat DSS_LAYERED_PACKAGE_${v.design.replace(/\W+/g,'_')}.zip amb:
- manifest.json
- master.svg
- assets/

manifest.json mínim:
{
  "package_version":"3.0",
  "canvas":{"width":17812,"height":9809},
  "pieces":8,
  "design":"${v.design}",
  "layers":[
    {"id":"L_BG_BASE","label":"Fons base","type":"background","editable":true},
    {"id":"L_BG_EFFECTS","label":"Fons i efectes","type":"effects","editable":true},
    {"id":"L_ART_MAIN","label":"Il·lustració principal","type":"art","editable":true},
    {"id":"L_ORNAMENTS","label":"Filigranes i ornaments","type":"ornaments","editable":true},
    {"id":"L_ACCENTS","label":"Accents i geometria","type":"accents","editable":true}
  ]
}

master.svg
- viewBox EXACTE 0 0 17812 9809.
- data-dss-package="3.0" data-dss-pieces="8".
- 8 grups ART_P1...ART_P8, clipats a les geometries exactes.
- Dins de les peces, usa atributs data-layer="L_BG_BASE", data-layer="L_BG_EFFECTS", data-layer="L_ART_MAIN", data-layer="L_ORNAMENTS" i data-layer="L_ACCENTS" per separar les capes.
- master.svg ha de ser AUTOCONTINGUT: qualsevol raster necessari s'ha d'incrustar com data URI perquè la previsualització funcioni sense extreure el ZIP.
- assets/ ha de conservar còpies separades i reutilitzables dels elements originals emprats al master.
- Fons transparent fora de les 8 peces.
- No alteris la geometria.
- No incloguis textos variables ni logos finals dins l'artwork; DSS els afegeix exactament.
- Deixa zona útil al frontal superior per logos i a l'esquena superior per textos.

ASSETS
Inclou a assets/ els elements reutilitzables i editables. Prioritza SVG per ornaments, geometria, roda i dards; usa PNG transparent d'alta resolució per il·lustracions complexes, textures i efectes quan calgui.
Exemples: bg_base, bg_blue, bg_green, bg_red, filigree_gold, wheel_red, carriage_gold, darts_gold, geometry_gold.

GEOMETRIA SVG EXACTA
${PATH_CONTRACT}

RESTRICCIONS
- No recreïs Dart Zone ni K-VSE: l'app utilitza els logos originals.
- No fixis ${v.player}, ${v.team} ni ${v.venue} dins de cap imatge.
- No afirmar DPI/CMYK/bleed no confirmats per K-VSE.
- No convertir tot el disseny en una sola imatge plana.
- El master.svg ha de mantenir una estructura de capes real i identificable.

LLIURAMENT
Crea físicament el ZIP perquè el pugui descarregar i carregar directament a Artwork del Darts Sublimation Studio.`;
  };

  input.onchange = async e => {
    const f=e.target.files[0]; if(!f)return;
    resetLayered(); packageValid=false; packageIssues=[]; packageText=''; rasterData=''; rasterW=rasterH=0;
    if(f.name.toLowerCase().endsWith('.zip')||f.type==='application/zip'||f.type==='application/x-zip-compressed'){ await validateLayeredZip(f); return; }
    if(f.name.toLowerCase().endsWith('.svg')||f.type==='image/svg+xml'){const r=new FileReader();r.onload=()=>validateSvg(r.result,f.name);r.readAsText(f);return;}
    const r=new FileReader();r.onload=()=>{rasterData=r.result;const im=new Image();im.onload=()=>{rasterW=im.naturalWidth;rasterH=im.naturalHeight;fileMode='raster';status.className='status warn';status.innerHTML=`<b>Mode imatge global (legacy)</b><br>${esc(f.name)} · ${rasterW}×${rasterH}px. Per producció editable usa DSS_LAYERED_PACKAGE.zip.`;render()};im.src=rasterData};r.readAsDataURL(f);
  };

  artworkLayer = function(){
    if(fileMode==='layered'&&packageText){const src=activeLayeredSvg(),b64=btoa(unescape(encodeURIComponent(src)));return `<image href="data:image/svg+xml;base64,${b64}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="none"/>`;}
    return oldArtworkLayer();
  };
  finalSvg = function(){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-dss-production="3.0">${artworkLayer()}${overlay()}</svg>`;};
  qa = function(){
    if(!$('qa'))return; const v=vals(); const rows=[
      ['MASTER 17.812 × 9.809',true],['8 siluetes vectorials',PATHS.length===8],['Fitxer carregat',fileMode!=='none'],
      ['Package validat',(fileMode==='package'||fileMode==='layered')&&packageValid],['Capes editables',fileMode!=='layered'||layeredLayers.length>0],['Logos originals afegits per l\'app',true],['Textos exactes afegits per l\'app',true],
      ['Bleed confirmat',!!$('bleed').value],['Zona segura confirmada',!!$('safe').value],['PPI/DPI confirmat',!!$('ppi').value],['Perfil color confirmat',!!$('profile').value],['Format final confirmat',!!$('format').value],['Model sense coll confirmat',v.garment!=='Samarreta sense coll'||$('collar').value==='yes']
    ]; $('qa').innerHTML=rows.map(x=>`<div class="${x[1]?'ok':'warn'}">${x[1]?'✓':'⚠'} ${x[0]}</div>`).join('');
  };

  prodBtn.onclick=()=>{if((fileMode==='package'||fileMode==='layered')&&!packageValid)return alert('El package té errors.');if(fileMode==='none')return alert('Falta carregar Artwork.');dlText(finalSvg(),'DSS_PRODUCTION_'+vals().design.replace(/\W+/g,'_')+'.svg','image/svg+xml');};
  layerBtn.onclick=()=>{if(fileMode!=='layered'||!layeredZipBlob)return alert('Carrega un DSS_LAYERED_PACKAGE.zip per descarregar les capes.');const a=document.createElement('a');a.href=URL.createObjectURL(layeredZipBlob);a.download='DSS_LAYERED_'+vals().design.replace(/\W+/g,'_')+'.zip';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);};

  render();
})();
