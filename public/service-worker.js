// Service Worker for offline capability
const CACHE_NAME = "personal-tracker-v2"; // Increment version on each deployment
const urlsToCache = ["/", "/savings", "/spending", "/calories", "/workout"];

// Install event - cache essential resources and take control immediately
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }).then(() => {
      // Skip waiting to activate immediately
      return self.skipWaiting();
    })
  );
});

// Fetch event - Network First strategy for HTML, Cache First for assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network First for HTML pages (prevents stale chunk references)
  if (request.headers.get("accept")?.includes("text/html") || 
      request.mode === "navigate" ||
      urlsToCache.includes(url.pathname)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the fresh response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache only if offline
          return caches.match(request);
        })
    );
  } else {
    // Cache First for static assets (images, fonts, etc.)
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((fetchResponse) => {
          const responseClone = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return fetchResponse;
        });
      })
    );
  }
});

// Activate event - clean up old caches and take control immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});
