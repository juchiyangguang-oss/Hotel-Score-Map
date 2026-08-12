"use strict";

/* ==================================
   Hotel Score Map
   PWA / Service Worker 登録
================================== */

if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    async () => {

      try {

        const registration =
          await navigator.serviceWorker.register(
            "./service-worker.js"
          );

        console.log(
          "Service Worker 登録成功:",
          registration.scope
        );

        /*
          サイト更新時に
          新しいService Workerがあるか確認
        */

        registration.update();

      } catch (error) {

        console.error(
          "Service Worker 登録失敗:",
          error
        );

      }

    }
  );

}


/* ==================================
   オンライン・オフライン状態
================================== */

window.addEventListener(
  "online",
  () => {

    console.log(
      "Hotel Score Map：オンライン"
    );

  }
);


window.addEventListener(
  "offline",
  () => {

    console.log(
      "Hotel Score Map：オフライン"
    );

  }
);