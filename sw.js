const V='altan-v3';
const SHELL=['./','./index.html','./schedule.html','./stats.html','./manifest.json','./logo-sm.png','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./data.json','./schedule.json','./zurkhai.json'];
const key=u=>new Request(u.origin+u.pathname);
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(SHELL.map(u=>c.add(u)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==self.location.origin)return;
  const doc=r.mode==='navigate'||r.destination==='document';
  if(doc||u.pathname.endsWith('.json')){
    const json=u.pathname.endsWith('.json');
    e.respondWith(fetch(r).then(res=>{if(res&&res.ok){const c=res.clone();caches.open(V).then(cc=>cc.put(key(u),c))}return res})
      .catch(()=>caches.match(key(u)).then(c=>c||(json?new Response('',{status:503}):caches.match('./index.html')))));return}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(c=>c||fetch(r).then(res=>{if(res&&res.ok){const cl=res.clone();caches.open(V).then(cc=>cc.put(r,cl))}return res})));
});
