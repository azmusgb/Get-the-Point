'use strict';
const CACHE = 'dd-pwa-v18-decisions-decisions-web-v2-2';
const CORE = [
  '/css/tokens.css?v=10',
  '/css/game.css?v=10',
  '/css/game-smart-card.css?v=1',
  '/css/navigation.css?v=13',
  '/css/diagnostics.css?v=10',
  '/site-nav.js?v=13',
  '/play-runtime.js?v=10',
  '/play.js?v=12',
  '/playtest-enhancements.js?v=11',
  '/play-smart-card.js?v=1',
  '/diagnostics.js?v=10',
  '/manifest.webmanifest',
  '/icon.svg'
];

/* Brand-system releases keep most public asset URLs stable for compatibility.
   Delete shared entries before precaching so an installed PWA cannot pin an
   older identity/navigation asset behind a previously populated cache. */
const REFRESH_ON_INSTALL = [
  '/css/tokens.css?v=10',
  '/css/navigation.css?v=13',
  '/site-nav.js?v=13',
  '/manifest.webmanifest',
  '/icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(async cache => {
        await Promise.all(REFRESH_ON_INSTALL.map(url => cache.delete(url)));
        await cache.addAll(CORE);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Protected HTML must always reach Netlify's edge gate. Never satisfy it from cache.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => new Response(
        '<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Connection required</title><body style="margin:0;background:#101112;color:#fff7e8;font-family:system-ui;display:grid;place-items:center;min-height:100dvh;padding:24px;text-align:center"><main><h1>Connection required</h1><p>The private demo needs a connection to verify access.</p></main></body>',
        { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }
      ))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(hit => hit || fetch(event.request).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
      return response;
    }))
  );
});
