const CACHE='dss-v27-chat-direct-r2';
const ASSETS=['./','./index.html','./icon-1024.png','./apple-touch-icon.png','./manifest.webmanifest','./assets/logos/DART_ZONE.png','./assets/logos/K_VSE.png','./assets/template/QA_CONTORNS_SOBRE_PSD.jpg'];

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const fresh=await fetch(request,{cache:'no-store'});
        const cache=await caches.open(CACHE);
        cache.put('./index.html',fresh.clone());
        return fresh;
      }catch(e){
        return (await caches.match('./index.html')) || (await caches.match('./'));
      }
    })());
    return;
  }
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
});
