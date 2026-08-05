"use strict";

/* ==================================
   HTML要素
================================== */

const hotelMapElement =
  document.getElementById("hotelMap");

const registeredHotelCount =
  document.getElementById("registeredHotelCount");

const displayedPinCount =
  document.getElementById("displayedPinCount");

const resetMapButton =
  document.getElementById("resetMapButton");

const mapStatus =
  document.getElementById("mapStatus");

if (
  !hotelMapElement ||
  !registeredHotelCount ||
  !displayedPinCount ||
  !resetMapButton ||
  !mapStatus
) {
  throw new Error(
    "ホーム画面に必要なHTML要素が見つかりません。"
  );
}

if (typeof L === "undefined") {
  mapStatus.textContent =
    "地図の読み込みに失敗しました。インターネット接続を確認してください。";

  throw new Error(
    "Leafletを読み込めませんでした。"
  );
}

/* ==================================
   地図
================================== */

const JAPAN_CENTER = [37.2, 137.2];
const JAPAN_ZOOM = 5;

const map = L.map("hotelMap", {
  center: JAPAN_CENTER,
  zoom: JAPAN_ZOOM,

  minZoom: 4,
  maxZoom: 18,

  zoomControl: true,
  attributionControl: true,

  dragging: true,
  touchZoom: true,
  scrollWheelZoom: true,
  doubleClickZoom: true,
  keyboard: true
});

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,

    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }
).addTo(map);

const markerLayer =
  L.layerGroup().addTo(map);

/* ==================================
   保存済みデータ
================================== */

const allHotelRecords =
  getStoredHotels();

/*
  宿泊記録の総数
*/

registeredHotelCount.textContent =
  `${allHotelRecords.length}件`;

/*
  同じホテル名＋住所を
  1施設へまとめる
*/

const groupedHotels =
  groupHotelRecords(
    allHotelRecords
  );

/*
  緯度・経度が有効な施設だけ表示
*/

const mappableHotels =
  groupedHotels.filter(
    hasValidCoordinates
  );

displayedPinCount.textContent =
  `${mappableHotels.length}施設`;

renderHotelMarkers(
  mappableHotels
);

updateMapStatus(
  groupedHotels,
  mappableHotels
);

/* ==================================
   同じホテルをまとめる
================================== */

function groupHotelRecords(records) {
  const groupMap =
    new Map();

  records.forEach((hotel) => {
    const key =
      createHotelKey(hotel);

    if (!groupMap.has(key)) {
      groupMap.set(key, []);
    }

    groupMap
      .get(key)
      .push(hotel);
  });

  return [...groupMap.entries()].map(
    ([key, histories]) => {
      const sortedHistories =
        [...histories].sort(
          sortHistoryNewest
        );

      /*
        最新の宿泊記録を
        地図表示用データにする
      */

      const latestRecord =
        sortedHistories[0];

      /*
        最新記録に座標がない場合は、
        同じホテルの過去記録から
        座標があるものを探す
      */

      const coordinateRecord =
        sortedHistories.find(
          hasValidCoordinates
        ) ?? latestRecord;

      return {
        key,

        id:
          latestRecord.id,

        name:
          latestRecord.name ||
          "名称未登録",

        address:
          latestRecord.address ||
          latestRecord.prefectureName ||
          "所在地未登録",

        prefecture:
          latestRecord.prefecture,

        prefectureCode:
          latestRecord.prefectureCode,

        prefectureName:
          latestRecord.prefectureName,

        latitude:
          coordinateRecord.latitude,

        longitude:
          coordinateRecord.longitude,

        stayCount:
          sortedHistories.length,

        latestStayDate:
          latestRecord.stayDate,

        finalScore:
          latestRecord.finalScore,

        normalScore:
          latestRecord.normalScore,

        rank:
          getHotelRank(
            latestRecord
          ),

        hallOfFame:
          latestRecord.hallOfFame === true ||
          getScore(latestRecord) > 5.000
      };
    }
  );
}

/* ==================================
   同一ホテル判定
================================== */

function createHotelKey(hotel) {
  const normalizedName =
    normalizeText(
      hotel.name
    );

  const normalizedAddress =
    normalizeText(
      hotel.address ||
      hotel.prefectureName ||
      hotel.prefecture
    );

  return `${normalizedName}::${normalizedAddress}`;
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[‐-‒–—―ー－]/g, "-")
    .trim();
}

/* ==================================
   宿泊日の順番
================================== */

function sortHistoryNewest(a, b) {
  return (
    getDateTimestamp(b) -
    getDateTimestamp(a)
  );
}

function getDateTimestamp(hotel) {
  const stayDateTimestamp =
    Date.parse(
      hotel.stayDate ?? ""
    );

  if (
    Number.isFinite(
      stayDateTimestamp
    )
  ) {
    return stayDateTimestamp;
  }

  const createdAtTimestamp =
    Date.parse(
      hotel.createdAt ?? ""
    );

  if (
    Number.isFinite(
      createdAtTimestamp
    )
  ) {
    return createdAtTimestamp;
  }

  return 0;
}

/* ==================================
   座標確認
================================== */

function hasValidCoordinates(hotel) {
  const latitude =
    Number(hotel.latitude);

  const longitude =
    Number(hotel.longitude);

  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

/* ==================================
   マーカー表示
================================== */

function renderHotelMarkers(hotels) {
  markerLayer.clearLayers();

  const coordinates = [];

  hotels.forEach((hotel) => {
    const latitude =
      Number(hotel.latitude);

    const longitude =
      Number(hotel.longitude);

    const marker =
      createHotelMarker(
        hotel,
        latitude,
        longitude
      );

    marker.addTo(
      markerLayer
    );

    coordinates.push([
      latitude,
      longitude
    ]);
  });

  /*
    施設が1つだけの場合
  */

  if (coordinates.length === 1) {
    map.setView(
      coordinates[0],
      12
    );

    return;
  }

  /*
    施設が2つ以上の場合
  */

  if (coordinates.length >= 2) {
    const bounds =
      L.latLngBounds(
        coordinates
      );

    map.fitBounds(
      bounds,
      {
        padding: [45, 45],
        maxZoom: 13
      }
    );
  }
}

function createHotelMarker(
  hotel,
  latitude,
  longitude
) {
  const rank =
    getHotelRank(hotel);

  const hallOfFame =
    hotel.hallOfFame === true ||
    getScore(hotel) > 5.000;

  const icon =
    createHotelIcon(
      rank,
      hallOfFame
    );

  const marker =
    L.marker(
      [latitude, longitude],
      {
        icon,

        title:
          hotel.name ||
          "ホテル"
      }
    );

  marker.bindPopup(
    createPopupContent(hotel),
    {
      maxWidth: 280,
      closeButton: true
    }
  );

  return marker;
}

/* ==================================
   ピンの見た目
================================== */

function createHotelIcon(
  rank,
  hallOfFame
) {
  const markerClasses = [
    "hotel-marker",
    `rank-${rank}`
  ];

  if (hallOfFame) {
    markerClasses.push(
      "hall-of-fame"
    );
  }

  const iconSize =
    hallOfFame
      ? 34
      : 30;

  return L.divIcon({
    className:
      "hotel-marker-wrapper",

    html: `
      <div
        class="${markerClasses.join(" ")}"
        aria-hidden="true"
      ></div>
    `,

    iconSize: [
      iconSize,
      iconSize
    ],

    iconAnchor: [
      iconSize / 2,
      iconSize
    ],

    popupAnchor: [
      0,
      -iconSize + 5
    ]
  });
}

/* ==================================
   ポップアップ
================================== */

function createPopupContent(hotel) {
  const historyQuery =
    new URLSearchParams({
      key:
        hotel.key,

      code:
        hotel.prefectureCode ?? "",

      pref:
        hotel.prefecture ?? "",

      name:
        hotel.prefectureName ?? ""
    });

  const hotelName =
    escapeHtml(
      hotel.name
    );

  const address =
    escapeHtml(
      hotel.address
    );

  const stayDate =
    escapeHtml(
      formatDate(
        hotel.latestStayDate
      )
    );

  const score =
    formatScore(
      hotel.finalScore
    );

  return `
    <div class="hotel-popup">

      <p class="hotel-popup-name">
        ${hotelName}
      </p>

      <p class="hotel-popup-meta">
        ${address}
      </p>

      <p class="hotel-popup-meta">
        宿泊回数：${hotel.stayCount}回
      </p>

      <p class="hotel-popup-meta">
        最新宿泊：${stayDate}
      </p>

      <p class="hotel-popup-score">
        ${score}
      </p>

      <a
        href="hotel-history.html?${historyQuery.toString()}"
        class="hotel-popup-link"
      >
        宿泊履歴を見る
      </a>

    </div>
  `;
}

/* ==================================
   評価・ランク
================================== */

function getScore(hotel) {
  const finalScore =
    Number(hotel.finalScore);

  if (
    Number.isFinite(finalScore)
  ) {
    return finalScore;
  }

  const normalScore =
    Number(hotel.normalScore);

  if (
    Number.isFinite(normalScore)
  ) {
    return normalScore;
  }

  return -Infinity;
}

function getHotelRank(hotel) {
  const savedRank =
    Number(hotel.rank);

  if (
    Number.isInteger(savedRank) &&
    savedRank >= 1 &&
    savedRank <= 6
  ) {
    return savedRank;
  }

  const score =
    getScore(hotel);

  if (score >= 4.800) {
    return 1;
  }

  if (score >= 4.500) {
    return 2;
  }

  if (score >= 4.000) {
    return 3;
  }

  if (score >= 3.000) {
    return 4;
  }

  if (score >= 2.000) {
    return 5;
  }

  return 6;
}

/* ==================================
   全国表示
================================== */

resetMapButton.addEventListener(
  "click",
  () => {
    map.setView(
      JAPAN_CENTER,
      JAPAN_ZOOM
    );
  }
);

/* ==================================
   状態表示
================================== */

function updateMapStatus(
  allHotels,
  visibleHotels
) {
  if (allHotels.length === 0) {
    mapStatus.textContent =
      "ホテルを登録すると地図にピンが表示されます";

    return;
  }

  const missingCount =
    allHotels.length -
    visibleHotels.length;

  if (missingCount > 0) {
    mapStatus.textContent =
      `位置未設定のホテルが${missingCount}施設あります`;

    return;
  }

  mapStatus.textContent =
    "すべての登録施設を地図に表示しています";
}

/* ==================================
   表示形式
================================== */

function formatScore(value) {
  const score =
    Number(value);

  if (
    !Number.isFinite(score)
  ) {
    return "---";
  }

  return score.toFixed(3);
}

function formatDate(dateString) {
  if (!dateString) {
    return "未登録";
  }

  const date =
    new Date(dateString);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return dateString;
  }

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }
  ).format(date);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ==================================
   localStorage
================================== */

function getStoredHotels() {
  const stored =
    localStorage.getItem(
      "hotelScoreMap.hotels"
    );

  if (!stored) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch (error) {
    console.error(
      "ホテルデータの読み込みに失敗しました。",
      error
    );

    mapStatus.textContent =
      "保存データの読み込みに失敗しました";

    return [];
  }
}

/* ==================================
   地図サイズ補正
================================== */

window.addEventListener(
  "load",
  () => {
    window.setTimeout(
      () => {
        map.invalidateSize();
      },
      100
    );
  }
);

window.addEventListener(
  "resize",
  () => {
    map.invalidateSize();
  }
);