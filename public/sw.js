
// Simple service worker for offline cache
self.addEventListener("install", (e) => {
  e.waitUntil(self.skipWaiting());
});
self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", function (event) {
  event.respondWith(fetch(event.request));
});
