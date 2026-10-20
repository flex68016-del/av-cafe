const CACHE_NAME = 'av-cafe-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/pos',
  '/manifest.webmanifest',
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  // Stratégie : Network First pour les API, Cache First pour les assets
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // En cas d'échec réseau, retourner une réponse offline
          return new Response(
            JSON.stringify({ error: 'Hors ligne', offline: true }),
            { 
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

// Synchronisation en arrière-plan quand on revient en ligne
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-sales') {
    event.waitUntil(syncSales());
  }
});

async function syncSales() {
  // Cette fonction sera appelée quand la connexion revient
  // La logique de synchronisation réelle sera dans l'app
  console.log('Sync triggered');
}
