/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxPluginMode is set to "InjectManifest"
 */

import { precacheAndRoute } from 'workbox-precaching'

const MOCK = false

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install')
  e.waitUntil((async () => {
    // const cache = await caches.open(cacheName)
    console.log('[Service Worker] Caching all: app shell and content')
    // await cache.addAll(contentToCache)
  })())
})

if (MOCK) {
  self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
      const r = await caches.match(e.request)
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`)
      if (r) {
        return r
      }
      const response = await fetch(e.request)
      // const cache = await caches.open(cacheName)
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`)
      // cache.put(e.request, response.clone())
      return response
    })())
  })
}
