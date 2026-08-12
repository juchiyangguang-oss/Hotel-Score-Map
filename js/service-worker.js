"use strict";

/* =========================================
   Hotel Score Map
   Service Worker
========================================= */

const CACHE_NAME =
  "hotel-score-map-v5";


/* =========================================
   オフラインで使用する主要ファイル
========================================= */

const CORE_FILES = [

  /* ---------- 基本 ---------- */

  "./",
  "./index.html",
  "./manifest.json",


  /* ---------- HTML ---------- */

  "./add.html",
  "./bath.html",
  "./facility.html",
  "./hotel-history.html",
  "./hotel.html",
  "./list.html",
  "./meal.html",
  "./prefecture.html",
  "./room.html",
  "./satisfaction.html",
  "./service.html",


  /* ---------- CSS ---------- */

  "./css/style.css",
  "./css/add.css",
  "./css/evaluation-detail.css",
  "./css/home.css",
  "./css/hotel-history.css",
  "./css/hotel.css",
  "./css/list.css",
  "./css/prefecture.css",


  /* ---------- JavaScript ---------- */

  "./js/add.js",
  "./js/bath.js",
  "./js/facility.js",
  "./js/home.js",
  "./js/hotel-history.js",
  "./js/hotel.js",
  "./js/list.js",
  "./js/main.js",
  "./js/map.js",
  "./js/meal.js",
  "./js/prefecture.js",
  "./js/pwa.js",
  "./js/room.js",
  "./js/satisfaction.js",
  "./js/service.js",


  /* ---------- データ ---------- */

  "./data/hotels.json",
  "./data/prefectures.json",
  "./data/settings.json",


  /* ---------- 地図画像 ---------- */

  "./img/map/japan.png",
  "./img/map/japan-prefecture-mask.png",


  /* ---------- Leaflet ---------- */

  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"

];


/* =========================================
   インストール
========================================= */

self.addEventListener(
  "install",
  (event) => {

    event.waitUntil(

      caches
        .open(CACHE_NAME)
        .then(
          async (cache) => {

            for (
              const file of CORE_FILES
            ) {

              try {

                await cache.add(
                  file
                );

                console.log(
                  "キャッシュ完了:",
                  file
                );

              } catch (error) {

                console.warn(
                  "キャッシュ失敗:",
                  file,
                  error
                );

              }

            }

          }
        )

    );

    self.skipWaiting();

  }
);


/* =========================================
   有効化
========================================= */

self.addEventListener(
  "activate",
  (event) => {

    event.waitUntil(

      caches
        .keys()
        .then(
          (cacheNames) => {

            return Promise.all(

              cacheNames.map(
                (cacheName) => {

                  if (
                    cacheName !==
                    CACHE_NAME
                  ) {

                    console.log(
                      "古いキャッシュを削除:",
                      cacheName
                    );

                    return caches.delete(
                      cacheName
                    );

                  }

                  return null;

                }
              )

            );

          }
        )

    );

    self.clients.claim();

  }
);


/* =========================================
   通信処理
========================================= */

self.addEventListener(
  "fetch",
  (event) => {

    const request =
      event.request;


    if (
      request.method !== "GET"
    ) {
      return;
    }


    /* ----------
       OpenStreetMap
    ---------- */

    if (
      request.url.includes(
        "tile.openstreetmap.org"
      )
    ) {

      event.respondWith(
        networkFirst(
          request
        )
      );

      return;

    }


    /* ----------
       通常ファイル
    ---------- */

    event.respondWith(
      cacheFirst(
        request
      )
    );

  }
);


/* =========================================
   キャッシュ優先
========================================= */

async function cacheFirst(
  request
) {

  const cachedResponse =
    await caches.match(
      request
    );


  if (
    cachedResponse
  ) {

    /*
      オンラインなら裏で更新
    */

    updateCache(
      request
    );

    return cachedResponse;

  }


  try {

    const networkResponse =
      await fetch(
        request
      );

    await saveResponse(
      request,
      networkResponse
    );

    return networkResponse;

  } catch (error) {


    /*
      HTMLページなら
      ホームへフォールバック
    */

    if (
      request.mode ===
      "navigate"
    ) {

      const home =
        await caches.match(
          "./index.html"
        );

      if (
        home
      ) {
        return home;
      }

    }


    return new Response(
      "オフラインのため、このデータを読み込めません。",
      {
        status: 503,

        headers: {
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );

  }

}


/* =========================================
   ネットワーク優先
========================================= */

async function networkFirst(
  request
) {

  try {

    const networkResponse =
      await fetch(
        request
      );

    await saveResponse(
      request,
      networkResponse
    );

    return networkResponse;

  } catch (error) {

    const cachedResponse =
      await caches.match(
        request
      );

    if (
      cachedResponse
    ) {
      return cachedResponse;
    }


    return new Response(
      "",
      {
        status: 503
      }
    );

  }

}


/* =========================================
   バックグラウンド更新
========================================= */

async function updateCache(
  request
) {

  try {

    const networkResponse =
      await fetch(
        request
      );

    await saveResponse(
      request,
      networkResponse
    );

  } catch (error) {

    /*
      オフライン時は何もしない
    */

  }

}


/* =========================================
   キャッシュへ保存
========================================= */

async function saveResponse(
  request,
  response
) {

  if (
    !response
  ) {
    return;
  }


  if (
    response.status !== 200 &&
    response.type !== "opaque"
  ) {
    return;
  }


  const cache =
    await caches.open(
      CACHE_NAME
    );


  try {

    await cache.put(
      request,
      response.clone()
    );

  } catch (error) {

    console.warn(
      "キャッシュ保存失敗:",
      request.url,
      error
    );

  }

}