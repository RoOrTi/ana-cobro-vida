const CACHE_NAME = 'ana-cache-v4'; // Bumped: force Chrome to discard old corrupt cache
const urlsToCache = [
    './',
    './index.html',
    './ana-theme.css',
    './ana-character.js',
    './assistant-core.js',
    './assistant-brain.js',
    './manifest.json'
];

self.addEventListener('install', event => {
    // Forzar activación inmediata sin esperar a que se cierren pestañas viejas
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Purgar cachés antiguos al activar la nueva versión
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    // Para HTML, CSS y JS: Network primero, caché como fallback
    if (event.request.url.match(/\.(html|css|js)$/)) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
    } else {
        event.respondWith(
            caches.match(event.request)
                .then(response => response || fetch(event.request))
        );
    }
});
