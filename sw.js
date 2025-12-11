const CACHE_NAME = 'bird-coffee-v1';
const APP_ASSETS = [
  './',
  './index.html',
  './menu.html',
  './cart.html',
  './css/style.css',
  './css/home.css',
  './css/menu.css',
  './css/cart.css',
  './js/main.js',
  './js/home.js',
  './js/menu.js',
  './js/cart.js',
  './img/icon-192.png',
  './img/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      });
    }).catch(() => caches.match('./index.html'))
  );
});
