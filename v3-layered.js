/* DSS compatibility bootstrap.
   Production chain: v4 Vector Studio -> v4.1 Premium Recipe -> v4.4 Heritage Engine -> v4.4 Final Exact Export.
   Mobile freshness: force service-worker update and reload once when a new controller activates. */
(() => {
  const BUILD='4.4.0';
  window.DSS_BUILD=BUILD;

  if('serviceWorker' in navigator){
    window.addEventListener('load',async()=>{
      try{
        const reg=await navigator.serviceWorker.register('./sw.js?v='+BUILD,{updateViaCache:'none'});
        await reg.update();
        let reloading=false;
        navigator.serviceWorker.addEventListener('controllerchange',()=>{
          if(reloading)return;
          reloading=true;
          const key='dss-controller-'+BUILD;
          if(sessionStorage.getItem(key)!=='1'){
            sessionStorage.setItem(key,'1');
            location.reload();
          }
        });
      }catch(e){console.warn('DSS SW update check failed',e)}
    });
  }

  const load=(src,ok,err)=>{
    const s=document.createElement('script');
    const sep=src.includes('?')?'&':'?';
    s.src=src+sep+'build='+encodeURIComponent(BUILD);
    s.defer=true;s.onload=ok;s.onerror=()=>console.error(err);document.body.appendChild(s);
  };

  load('./v4-studio.js?v=4.0',()=>{
    console.info('DSS v4 Vector Studio loaded · build '+BUILD);
    load('./v4-premium.js?v=4.1',()=>{
      console.info('DSS v4.1 Premium Recipe loaded · build '+BUILD);
      load('./v4-heritage.js?v=4.4',()=>{
        console.info('DSS v4.4 Heritage Premium Engine loaded · build '+BUILD);
        load('./v4-final.js?v=4.4',()=>console.info('DSS v4.4 Final Exact Export loaded · build '+BUILD),'DSS v4.4 Final Exact Export could not be loaded');
      },'DSS v4.4 Heritage Premium Engine could not be loaded');
    },'DSS v4.1 Premium Recipe could not be loaded');
  },'DSS v4 Vector Studio could not be loaded');
})();
