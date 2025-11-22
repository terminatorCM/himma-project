const cacheName = self.location.pathname
const pages = [

  "/book_content/muslim_manners/%D8%A7%D9%84%D9%85%D9%82%D8%AF%D9%85%D8%A9/",
  "/book_content/muslim_manners/p2/",
  "/book_content/muslim_manners/%D8%A7%D9%84%D8%AE%D8%A7%D8%AA%D9%85%D8%A9/",
  "/",
  "/book_content/book2/",
  "/book_content/book2/ohio/",
  "/categories/",
  "/tags/",
  "/book_content/",
  "/book_content/muslim_manners/",
  "/book.min.8be08ee19c78fece5778ccbad7b7920c47943153ee0c9e856094873c56dca415.css",
  "/en.search-data.min.4ac5fbd88d161b3fbcc455e7d40929293feb93be7c6198af4effdba30cf7acf3.json",
  "/en.search.min.6ecf8409c0395b3d5e05b1af50958dca3b9d9252feac263fea31b7d745502e56.js",
  
];

self.addEventListener("install", function (event) {
  self.skipWaiting();

  caches.open(cacheName).then((cache) => {
    return cache.addAll(pages);
  });
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  /**
   * @param {Response} response
   * @returns {Promise<Response>}
   */
  function saveToCache(response) {
    if (cacheable(response)) {
      return caches
        .open(cacheName)
        .then((cache) => cache.put(request, response.clone()))
        .then(() => response);
    } else {
      return response;
    }
  }

  /**
   * @param {Error} error
   */
  function serveFromCache(error) {
    return caches.open(cacheName).then((cache) => cache.match(request.url));
  }

  /**
   * @param {Response} response
   * @returns {Boolean}
   */
  function cacheable(response) {
    return response.type === "basic" && response.ok && !response.headers.has("Content-Disposition")
  }

  event.respondWith(fetch(request).then(saveToCache).catch(serveFromCache));
});
