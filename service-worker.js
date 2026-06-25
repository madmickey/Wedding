const CACHE = 'liz-michael-wedding-v1';

const ASSETS = [
  './',
  'index.html',
  'rsvp.html',
  'photo-wall.html',
  'local.html',

  'css/styles.css',
  'js/app.js',
  'manifest.json',

  'favicon.ico',
  'favicon-96x96.png',

  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/apple-touch-icon.png',

  'assets/images/hero.svg',
  'assets/images/install_sc.gif',
  'assets/images/ios-add-to-home.gif',
 // 'assets/images/liz-michael-crest.png',
 // 'assets/images/liz-michael-crest-1.png',
  'assets/images/liz-michael-crest.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  // Do not cache external services: Google Maps, Tally, OneSignal, etc.
  if (requestUrl.origin !== self.location.origin) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();

        caches.open(CACHE).then(cache => {
          cache.put(event.request, copy);
        });

        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(cached => {
          if (cached) return cached;

          if (event.request.mode === 'navigate') {
            return caches.match('index.html');
          }

          return caches.match('index.html');
        });
      })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});