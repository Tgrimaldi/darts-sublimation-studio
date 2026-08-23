/* DSS compatibility bootstrap.
   v3 remains available in Git history/backups; production now loads DSS v4.1 Premium Vector Studio. */
(() => {
  const s=document.createElement('script');
  s.src='./v4-studio.js?v=4.0';
  s.defer=true;
  s.onload=()=>{
    console.info('DSS v4 Vector Studio loaded');
    const p=document.createElement('script');
    p.src='./v4-premium.js?v=4.1';
    p.defer=true;
    p.onload=()=>console.info('DSS v4.1 Premium Recipe loaded');
    p.onerror=()=>console.error('DSS v4.1 Premium Recipe could not be loaded');
    document.body.appendChild(p);
  };
  s.onerror=()=>console.error('DSS v4 Vector Studio could not be loaded');
  document.body.appendChild(s);
})();
