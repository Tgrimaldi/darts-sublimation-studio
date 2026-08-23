/* DSS compatibility bootstrap.
   Production chain: v4 Vector Studio -> v4.1 Premium Recipe -> v4.2 Final Flow. */
(() => {
  const load=(src,ok,err)=>{const s=document.createElement('script');s.src=src;s.defer=true;s.onload=ok;s.onerror=()=>console.error(err);document.body.appendChild(s)};
  load('./v4-studio.js?v=4.0',()=>{
    console.info('DSS v4 Vector Studio loaded');
    load('./v4-premium.js?v=4.1',()=>{
      console.info('DSS v4.1 Premium Recipe loaded');
      load('./v4-final.js?v=4.2',()=>console.info('DSS v4.2 Final Flow loaded'),'DSS v4.2 Final Flow could not be loaded');
    },'DSS v4.1 Premium Recipe could not be loaded');
  },'DSS v4 Vector Studio could not be loaded');
})();
