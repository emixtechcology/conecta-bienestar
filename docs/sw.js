/*
 * Service worker de Bienestar Conecta.
 * Permite instalar la app en el celular y abrir la pantalla aunque la red esté lenta.
 * Siempre intenta primero la versión nueva de internet; la copia guardada solo se usa sin conexión.
 * Las peticiones al servidor (Apps Script) nunca se guardan.
 */
const CACHE = 'bc-v2';
const ARCHIVOS = ['./', 'index.html', 'estilos.css', 'app.js', 'config.js', 'manifest.webmanifest', 'iconos/icono.svg', 'iconos/icono-192.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        const copia = r.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copia));
        return r;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match('./')))
  );
});

// Al tocar una notificación: abre (o enfoca) la app y la lleva al aviso.
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const aviso = e.notification.data && e.notification.data.aviso;
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((lista) => {
      const abierta = lista.find((c) => c.url.indexOf(self.registration.scope) === 0);
      if (abierta) {
        if (aviso) abierta.postMessage({ aviso });
        return abierta.focus();
      }
      return self.clients.openWindow('./' + (aviso && aviso !== 'prueba' && aviso !== 'varios' ? '?aviso=' + encodeURIComponent(aviso) : ''));
    })
  );
});
