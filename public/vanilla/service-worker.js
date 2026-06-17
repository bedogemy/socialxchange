// public/vanilla/service-worker.js
// Ultra-fast, highly resilient Service Worker for instant offline loading and resource caching

const CACHE_NAME = 'socialxchange-vanilla-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './router.js',
  './login.js',
  './dashboard.js',
  './control-room.js'
];

// Install Event: Prefetch and cache core SPA assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching HTML, CSS, and JS shell...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing stale cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Implement Stale-While-Revalidate strategy for assets, bypass functions
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass Netlify functions or database API calls entirely (must go to network)
  if (url.pathname.includes('/.netlify/functions/') || url.pathname.includes('/api/')) {
    return;
  }

  // Handle local application assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Update the cache with freshest response
        if (networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
        console.warn('[Service Worker] Serving cached fallback due to network failure:', err);
      });

      // Returns the cache instantly (0ms) if found, otherwise waits for network fetch
      return cachedResponse || fetchPromise;
    })
  );
});
