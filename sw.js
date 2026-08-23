const CACHE='dss-v43-final-r1';
const CORE=['./','./index.html','./v3-layered.js','./v4-studio.js','./v4-premium.js','./v4-final.js','./icon-1024.png','./apple-touch-icon.png','./manifest.webmanifest','./assets/logos/DART_ZONE.png','./assets/logos/K_VSE.png','./assets/template/QA_CONTORNS_SOBRE_PSD.jpg'];

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)));
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirst(request,fallback){
  const cache=await caches.open(CACHE);
  try{
    const fresh=await fetch(request,{cache:'no-store'});
    if(fresh && fresh.ok) cache.put(request,fresh.clone());
    return fresh;
  }catch(e){
    return (await cache.match(request)) || (fallback ? await cache.match(fallback) : undefined) || Response.error();
  }
}

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET') return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin) return;

  if(request.mode==='navigate'){
    event.respondWith(networkFirst(request,'./index.html'));
    return;
  }

  const isDynamic=/\.(?:js|css|html|webmanifest)$/i.test(url.pathname) || url.pathname.endsWith('/sw.js');
  if(isDynamic){
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(request);
    if(cached) return cached;
    try{
      const fresh=await fetch(request,{cache:'no-store'});
      if(fresh && fresh.ok) cache.put(request,fresh.clone());
      return fresh;
    }catch(e){
      return Response.error();
    }
  })());
});
