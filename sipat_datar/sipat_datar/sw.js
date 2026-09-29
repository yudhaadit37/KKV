// sw.js — service worker: cache untuk pemakaian offline (jaringan diutamakan, jadi hasil edit langsung terlihat).
// Jika menambah file baru, daftarkan di FILES lalu naikkan versi CACHE.
const CACHE = 'sipat-datar-v1';
const FILES = ['./', 'index.html', 'styles.css', 'utils.js', 'app.js', 'manifest.json', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request))
  );
});
