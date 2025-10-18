// Basic offline caching for critical assets
const CACHE_NAME = 'lula-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/index-new.html',
  '/styles/theme.css'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k))))
  );
});
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      return res;
    }).catch(() => caches.match('/index.html')))
  );
});
