/* Service worker de Bitácora de salud.
   Guarda la app en el teléfono para abrirla sin internet.
   Cuando cambies cualquier archivo de la app, sube el número de VERSION. */
var VERSION='bitacora-v3';
var FILES=['./','index.html','manifest.webmanifest','icon.png'];

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==VERSION}).map(function(k){return caches.delete(k)}));
  }).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(hit){
    return hit||fetch(e.request).catch(function(){return caches.match('index.html')});
  }));
});
