const CACHE_NAME = 'ana-cache-v1';
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
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
