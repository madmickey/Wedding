const CACHE = "wedding-site-v1";

const ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/config.js",
  "/offline.html"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request).catch(() =>
      caches.match(e.request).then(res => res || caches.match("/offline.html"))
    )
  );
});