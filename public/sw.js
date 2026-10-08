// Service worker minimal agar katalog bisa dipasang (PWA). Tidak menyimpan cache.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
