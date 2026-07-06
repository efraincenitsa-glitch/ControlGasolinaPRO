const CACHE_NAME = "control-gasolina-pro-v1";

const ARCHIVOS_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./js/storage.js",
  "./js/gps.js",
  "./js/vehiculos.js",
  "./js/gasolina.js",
  "./js/dashboard.js",
  "./js/mantenimiento.js",
  "./js/reportes.js",
  "./js/app.js",
  "./assets/img/icon.svg"
];

self.addEventListener("install", evento => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ARCHIVOS_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", evento => {
  evento.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", evento => {
  evento.respondWith(
    caches.match(evento.request).then(respuesta => {
      return respuesta || fetch(evento.request);
    })
  );
});
