const CACHE_NAME = 'fanpay-demo-v1';
const ASSETS = [
  './',
  './fanpay_pwa_demo.html',
  './fanpay.html',
  './manifest.json',
  './icons/logo.png'
];

// Install: cache app shell
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => { if(k !== CACHE_NAME) return caches.delete(k); })))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  const req = evt.request;
  // only handle GET same-origin requests
  if (req.method !== 'GET') return;
  evt.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(resp => {
      // cache GET 200 responses
      if (resp && resp.status === 200) {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
      }
      return resp;
    }).catch(()=> caches.match('./fanpay_pwa_demo.html')))
  );
});
