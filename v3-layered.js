/* DSS compatibility bootstrap.
   v3 remains available in Git history/backups; production now loads DSS v4 Vector Studio. */
(() => {
  const s=document.createElement('script');
  s.src='./v4-studio.js?v=4.0';
  s.defer=true;
  s.onload=()=>console.info('DSS v4 Vector Studio loaded');
  s.onerror=()=>console.error('DSS v4 Vector Studio could not be loaded');
  document.body.appendChild(s);
})();
