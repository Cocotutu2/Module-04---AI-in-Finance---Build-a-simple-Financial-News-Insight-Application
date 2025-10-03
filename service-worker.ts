const CACHE_NAME = 'finai-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx', // The browser requests this, so it should be cached.
  'https://cdn.tailwindcss.com',
];

self.addEventListener('install', (event) => {
  // @ts-ignore
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        const cachePromises = urlsToCache.map(urlToCache => {
            return cache.add(urlToCache).catch(err => {
                console.warn(`Failed to cache ${urlToCache}:`, err);
            });
        });
        return Promise.all(cachePromises);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // @ts-ignore
  const req = event.request;
  // Only handle GET requests
  if (req.method !== 'GET' || !req.url.startsWith('http')) {
    return;
  }

  // Cache-first strategy
  // @ts-ignore
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(req);
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      try {
        const networkResponse = await fetch(req);
        // Cache the new response
        if (networkResponse.ok) {
            await cache.put(req, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        console.error('Fetching from network failed:', error);
        throw error;
      }
    })()
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  // @ts-ignore
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
