// 오늘의 장면 기록 — 인터넷이 끊겨도 앱 화면이 열리게 하는 파일
// 화면 파일은 인터넷이 되면 새 것을 받고(새 판 반영), 안 되면 보관본을 쓴다
const CACHE = 'scene-v13';
const FILES = ['./', './index.html', './manifest.json', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // 기록 보내기(구글)는 건드리지 않는다
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(m => m || caches.match('./index.html'))));
});
