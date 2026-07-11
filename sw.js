/* Service Worker — Aurora Editorial
   Deixa o site funcionar offline e instalável como app.
   Quando você atualizar o site, mude o número da versão
   abaixo (v1 -> v2) para forçar a atualização do cache. */

const CACHE = "aurora-editorial-v1";
const ARQUIVOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icone-192.png",
  "./icone-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((chaves) =>
      Promise.all(chaves.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* Estratégia: tenta a rede primeiro (para pegar atualizações),
   e usa o cache se estiver offline. */
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then((resposta) => {
        const copia = resposta.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copia)).catch(() => {});
        return resposta;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("./index.html")))
  );
});
