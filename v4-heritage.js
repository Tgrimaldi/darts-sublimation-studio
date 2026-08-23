(() => {
  'use strict';
  const VERSION='4.4';
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  const getVals=()=>({
    design:$('designName')?.value||'DESIGN',team:$('teamName')?.value||'',venue:$('venue')?.value||'',player:$('player')?.value||'',style:$('style')?.value||'',free:$('freeBrief')?.value||'',
    colors:['c1','c2','c3','c4','c5'].map(id=>$(id)?.value||'#111111')
  });

  function defs(v){
    const [base,blue,green,red,gold]=v.colors;
    return `<defs id="dss44-defs">
      <linearGradient id="d44gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#5b3508"/><stop offset=".18" stop-color="${gold}"/><stop offset=".44" stop-color="#fff0a8"/><stop offset=".7" stop-color="#c58b25"/><stop offset="1" stop-color="#4e2d05"/></linearGradient>
      <linearGradient id="d44black" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#020304"/><stop offset=".55" stop-color="#090d12"/><stop offset="1" stop-color="${base}"/></linearGradient>
      <radialGradient id="d44halo"><stop stop-color="${gold}" stop-opacity=".30"/><stop offset=".6" stop-color="${gold}" stop-opacity=".07"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
      <pattern id="d44textile" width="96" height="96" patternUnits="userSpaceOnUse"><path d="M0 48 Q24 4 48 48 T96 48 M48 0 Q4 24 48 48 T48 96" fill="none" stroke="#ffffff" stroke-opacity=".028" stroke-width="5"/><circle cx="48" cy="48" r="3" fill="${gold}" opacity=".08"/></pattern>
      <filter id="d44shadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceAlpha" stdDeviation="28" result="b"/><feOffset dy="22" result="o"/><feColorMatrix in="o" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .65 0" result="s"/><feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <symbol id="d44wheel" viewBox="-900 -900 1800 1800">
        <circle r="805" fill="#05070a" stroke="#1a0a04" stroke-width="90"/>
        <circle r="765" fill="none" stroke="url(#d44gold)" stroke-width="58"/>
        <circle r="680" fill="#07090c" stroke="#6f1116" stroke-width="52"/>
        ${Array.from({length:16},(_,i)=>`<g transform="rotate(${i*22.5})"><path d="M-66 -126 C-112 -280 -122 -505 -62 -628 C-18 -718 18 -718 62 -628 C122 -505 112 -280 66 -126 Z" fill="${red}" stroke="#5a080d" stroke-width="20"/><path d="M-20 -155 L20 -155 L32 -600 Q0 -666 -32 -600 Z" fill="#2b080a" opacity=".48"/></g>`).join('')}
        <circle r="170" fill="#090b0e" stroke="url(#d44gold)" stroke-width="34"/><circle r="70" fill="#11151a" stroke="#3b2b12" stroke-width="18"/><circle r="22" fill="${gold}"/>
      </symbol>
      <symbol id="d44dart" viewBox="-120 -520 240 1040">
        <path d="M-20 410 L20 410 L36 -145 L0 -298 L-36 -145 Z" fill="url(#d44gold)" stroke="#5d3a0d" stroke-width="10"/>
        <path d="M0 -298 L-105 -455 L-27 -420 L0 -520 L27 -420 L105 -455 Z" fill="url(#d44gold)" stroke="#5d3a0d" stroke-width="12"/>
        <path d="M-44 410 L44 410 L25 505 L-25 505 Z" fill="#b77716" stroke="#5d3a0d" stroke-width="10"/>
      </symbol>
      <symbol id="d44flourish" viewBox="-1200 -500 2400 1000">
        <path d="M-1130 0 C-870 -20 -840 -290 -610 -300 C-390 -310 -400 80 -170 55 C-70 43 -80 -180 0 -190 C80 -180 70 43 170 55 C400 80 390 -310 610 -300 C840 -290 870 -20 1130 0" fill="none" stroke="url(#d44gold)" stroke-width="36" stroke-linecap="round"/>
        <path d="M-930 120 C-720 80 -700 250 -520 220 C-360 193 -355 50 -190 80 M190 80 C355 50 360 193 520 220 C700 250 720 80 930 120" fill="none" stroke="${gold}" stroke-width="22" opacity=".8"/>
        <path d="M0 -215 C95 -155 145 -65 0 5 C-145 -65 -95 -155 0 -215 Z M0 5 C125 75 120 185 0 275 C-120 185 -125 75 0 5Z" fill="none" stroke="url(#d44gold)" stroke-width="24"/>
        <circle r="34" fill="${red}" stroke="url(#d44gold)" stroke-width="12"/>
      </symbol>
      <symbol id="d44carriage" viewBox="-1450 -900 2900 1800">
        <g filter="url(#d44shadow)">
          <path d="M-1260 155 L-1190 -435 Q-1040 -710 -690 -740 L250 -710 Q520 -690 640 -430 L680 180 Z" fill="#090b0e" stroke="url(#d44gold)" stroke-width="30"/>
          <path d="M-1100 -370 H520 M-1050 -30 H580" stroke="${gold}" stroke-width="18" opacity=".85"/>
          ${[-840,-480,-110,270].map(x=>`<path d="M${x} -650 V120" stroke="url(#d44gold)" stroke-width="18"/>`).join('')}
          <path d="M-820 -555 Q-710 -660 -600 -555 V-285 H-820 Z M-380 -555 Q-270 -660 -160 -555 V-285 H-380 Z M60 -555 Q170 -660 280 -555 V-285 H60 Z" fill="#050607" stroke="${gold}" stroke-width="18"/>
          <circle cx="-800" cy="360" r="265" fill="#050607" stroke="url(#d44gold)" stroke-width="34"/><circle cx="300" cy="360" r="265" fill="#050607" stroke="url(#d44gold)" stroke-width="34"/>
          ${Array.from({length:12},(_,i)=>`<path d="M-800 360 l${(Math.cos(i*Math.PI/6)*230).toFixed(1)} ${(Math.sin(i*Math.PI/6)*230).toFixed(1)} M300 360 l${(Math.cos(i*Math.PI/6)*230).toFixed(1)} ${(Math.sin(i*Math.PI/6)*230).toFixed(1)}" stroke="${gold}" stroke-width="14"/>`).join('')}
          <path d="M670 20 C820 -90 925 -100 1080 -20" fill="none" stroke="url(#d44gold)" stroke-width="30"/>
          <path d="M1060 -90 Q1220 -180 1345 -25 Q1325 120 1160 145 Q1040 160 990 305 Q955 405 855 520 L745 485 Q835 300 855 205 Q870 90 1060 -90 Z" fill="#090a0d" stroke="url(#d44gold)" stroke-width="28"/>
          <path d="M1110 -58 Q1200 -200 1255 -120 M1225 -72 L1390 -35" fill="none" stroke="${gold}" stroke-width="22"/>
          <path d="M1120 135 Q1195 305 1110 535 M970 250 Q1020 390 930 565 M855 520 L790 805 M1110 535 L1160 805" fill="none" stroke="url(#d44gold)" stroke-width="34" stroke-linecap="round"/>
          <path d="M720 0 L1040 72 M710 92 L1015 150" fill="none" stroke="${gold}" stroke-width="18"/>
        </g>
      </symbol>
    </defs>`;
  }

  function paintField(v,x,y,w,h){
    const [,blue,green,red,gold]=v.colors;
    const groups=[[blue,.85,-.18],[red,.74,.06],[green,.80,.29]];
    let out='<g data-dss44="paint">';
    groups.forEach(([c,op,off],gi)=>{
      for(let i=0;i<6;i++){
        const yy=y+h*(.08+i*.16),sx=x+w*off,ex=x+w*(.72+off),amp=(i%2?-.12:.13)*h;
        out+=`<path d="M${sx} ${yy} C${x+w*.18} ${yy+amp} ${x+w*.48} ${yy-amp*.72} ${ex} ${yy+amp*.18}" fill="none" stroke="${c}" stroke-width="${90+i*18}" stroke-linecap="round" opacity="${(op-(i*.06)).toFixed(2)}"/>`;
      }
    });
    out+=`<path d="M${x+w*.03} ${y+h*.92} C${x+w*.32} ${y+h*.76} ${x+w*.68} ${y+h*.78} ${x+w*.97} ${y+h*.93}" fill="none" stroke="url(#d44gold)" stroke-width="46" opacity=".9"/>`;
    out+='</g>';return out;
  }

  function frame(x,y,w,h){
    return `<g data-dss44="frame" fill="none" stroke="url(#d44gold)"><path d="M${x} ${y+h*.12} Q${x+w*.10} ${y} ${x+w*.24} ${y} M${x+w*.76} ${y} Q${x+w*.90} ${y} ${x+w} ${y+h*.12}" stroke-width="34"/><path d="M${x} ${y+h*.88} Q${x+w*.12} ${y+h} ${x+w*.26} ${y+h} M${x+w*.74} ${y+h} Q${x+w*.88} ${y+h} ${x+w} ${y+h*.88}" stroke-width="24"/><path d="M${x+w*.05} ${y+h*.2} L${x+w*.05} ${y+h*.80} M${x+w*.95} ${y+h*.2} L${x+w*.95} ${y+h*.80}" stroke-width="18" opacity=".72"/></g>`;
  }

  function pieceMarkup(id,v){
    const [,blue,green,red,gold]=v.colors;
    if(id===3){
      return `<g id="DSS44_P3" data-layer="L_HERITAGE_PREMIUM" data-dss44="piece">
        <rect width="17812" height="9809" fill="url(#d44textile)" opacity=".65"/>
        ${paintField(v,180,2800,5900,6500)}${frame(380,2950,5350,6050)}
        <ellipse cx="3070" cy="6050" rx="2550" ry="3300" fill="url(#d44halo)"/>
        <use href="#d44flourish" transform="translate(3070 3920) scale(1.55)" opacity=".9"/>
        <use href="#d44wheel" transform="translate(3070 6100) scale(1.63)"/>
        <g transform="translate(1600 8240) rotate(-16)"><use href="#d44dart" transform="translate(-260 0) rotate(-10) scale(1.12)"/><use href="#d44dart" transform="translate(0 -70) scale(1.25)"/><use href="#d44dart" transform="translate(260 0) rotate(10) scale(1.12)"/></g>
        <use href="#d44flourish" transform="translate(3100 9060) scale(1.7)" opacity=".92"/>
      </g>`;
    }
    if(id===4){
      return `<g id="DSS44_P4" data-layer="L_HERITAGE_PREMIUM" data-dss44="piece">
        <rect width="17812" height="9809" fill="url(#d44textile)" opacity=".65"/>
        ${paintField(v,6350,3150,6100,6000)}${frame(6670,3250,5440,5700)}
        <ellipse cx="9450" cy="6500" rx="3000" ry="3100" fill="url(#d44halo)"/>
        <use href="#d44wheel" transform="translate(9500 5900) scale(1.30)" opacity=".95"/>
        <use href="#d44carriage" transform="translate(9600 7350) scale(1.38)"/>
        <use href="#d44flourish" transform="translate(9440 9020) scale(1.7)" opacity=".92"/>
      </g>`;
    }
    if(id===7){
      return `<g id="DSS44_P7" data-layer="L_HERITAGE_PREMIUM" data-dss44="piece"><rect width="17812" height="9809" fill="url(#d44textile)" opacity=".55"/>${paintField(v,12600,4400,5000,1900)}<use href="#d44wheel" transform="translate(15180 5580) scale(.67)"/><use href="#d44flourish" transform="translate(15180 6260) scale(1.45 .55)"/><path d="M12880 6440 C14320 6170 16320 6170 17520 6420" fill="none" stroke="url(#d44gold)" stroke-width="58"/></g>`;
    }
    if(id===8){
      return `<g id="DSS44_P8" data-layer="L_HERITAGE_PREMIUM" data-dss44="piece"><rect width="17812" height="9809" fill="url(#d44textile)" opacity=".55"/>${paintField(v,12600,7350,5000,1900)}<use href="#d44flourish" transform="translate(15180 8350) scale(1.28 .72)"/><path d="M12880 9330 C14320 9060 16320 9060 17520 9310" fill="none" stroke="url(#d44gold)" stroke-width="58"/></g>`;
    }
    if(id===1||id===2){const x=id===1?6700:0;return `<g id="DSS44_P${id}" data-layer="L_HERITAGE_PREMIUM" data-dss44="piece"><rect width="17812" height="9809" fill="url(#d44textile)" opacity=".45"/>${paintField(v,x+70,70,5650,1250)}<use href="#d44flourish" transform="translate(${x+2950} 650) scale(1.95 .58)"/><path d="M${x+180} 1160 C${x+1850} 950 ${x+3850} 950 ${x+5540} 1170" fill="none" stroke="url(#d44gold)" stroke-width="55"/></g>`}
    if(id===5||id===6){const y=id===5?1900:2860;return `<g id="DSS44_P${id}" data-layer="L_HERITAGE_PREMIUM" data-dss44="piece"><rect width="17812" height="9809" fill="url(#d44textile)" opacity=".42"/>${paintField(v,12500,y,5200,720)}<use href="#d44flourish" transform="translate(15100 ${y+360}) scale(1.72 .34)"/></g>`}
    return '';
  }

  function enrich(){
    const svg=$('preview')?.querySelector('svg');if(!svg)return;
    svg.querySelector('#dss44-defs')?.remove();svg.querySelectorAll('[id^="DSS44_P"]').forEach(n=>n.remove());
    const v=getVals();
    const d=new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${defs(v)}</svg>`,'image/svg+xml');
    const def=d.documentElement.firstElementChild,existing=svg.querySelector('defs');
    if(existing)existing.append(...Array.from(def.children).map(n=>document.importNode(n,true)));else svg.insertBefore(document.importNode(def,true),svg.firstChild);
    for(let id=1;id<=8;id++){
      const host=svg.querySelector('#ART_P'+id);if(!host)continue;
      const doc=new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${pieceMarkup(id,v)}</svg>`,'image/svg+xml');
      const node=doc.documentElement.firstElementChild;if(node)host.appendChild(document.importNode(node,true));
    }
    svg.setAttribute('data-dss-heritage',VERSION);
    svg.setAttribute('data-dss-visual-tier','premium-heritage');
  }

  function panel(){
    const s3=$('s3');if(!s3||$('dss44Panel'))return;
    const box=document.createElement('div');box.id='dss44Panel';box.className='dss41-card';box.innerHTML=`<div class="dss41-head"><div class="dss41-title">DSS v4.4 · Heritage Premium Engine</div><span class="dss41-badge">RODA + CARRUATGE + FILIGRANA + DARDS</span></div><div class="dss41-grid"><div class="dss41-metric"><b>Nivell visual</b>Premium heritage</div><div class="dss41-metric"><b>Composició</b>Frontal / esquena / mànigues diferenciats</div><div class="dss41-metric"><b>Assets</b>Vectorials i editables dins SVG</div><div class="dss41-metric"><b>Exportació</b>Master visible = fitxer final</div></div><div class="dss41-actions"><button id="dss44Apply" class="btn gold">Reaplicar Heritage Premium</button></div>`;
    const preview=$('preview')?.closest('.card');s3.insertBefore(box,preview||null);$('dss44Apply').onclick=enrich;
  }

  function boot(){
    panel();
    const host=$('preview');if(host){let t=0;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(enrich,180)}).observe(host,{childList:true,subtree:false})}
    document.addEventListener('click',e=>{const t=e.target?.textContent||'';if(t.includes('Aplicar Premium Recipe')||t.includes('Aplicar canvis'))setTimeout(enrich,260)},true);
    enrich();
    console.info('DSS v4.4 Heritage Premium Engine loaded');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,900));else setTimeout(boot,900);
})();
