/* Service Worker — Aurora Editorial v2
   Para forçar atualização, mude v2 para v3, etc. */
const CACHE = 'aurora-editorial-v3';
const ARQUIVOS = [
  './', './index.html', './manifest.json',
  './logo-aurora.png', './icone-192.png', './icone-512.png',
  './capa-01.jpg','./capa-02.jpg','./capa-03.jpg',
  './capa-04.jpg','./capa-05.jpg','./capa-06.jpg',
  './capa-07.jpg','./capa-08.jpg','./capa-09.jpg','./capa-10.jpg'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(r => { caches.open(CACHE).then(c => c.put(e.request, r.clone())).catch(()=>{}); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
