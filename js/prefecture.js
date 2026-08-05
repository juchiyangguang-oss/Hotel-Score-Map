"use strict";

/* ==================================
   URLから都道府県情報を取得
================================== */

const params =
  new URLSearchParams(window.location.search);

const prefectureCode =
  params.get("code");

const prefectureSlug =
  params.get("pref");

const prefectureName =
  params.get("name");

/* ==================================
   HTML要素
================================== */

const prefectureTitle =
  document.getElementById("prefectureTitle");

const hotelCount =
  document.getElementById("hotelCount");

const hotelList =
  document.getElementById("hotelList");

const sortSelect =
  document.getElementById("sortSelect");

if (
  !prefectureTitle ||
  !hotelCount ||
  !hotelList ||
  !sortSelect
) {
  throw new Error(
    "都道府県ページに必要なHTML要素が見つかりません。"
  );
}

/* ==================================
   状態
================================== */

let groupedHotels = [];

/* ==================================
   初期表示
================================== */

initializePage();

function initializePage() {
  if (
    !prefectureCode ||
    !prefectureSlug ||
    !prefectureName
  ) {
    showPrefectureError();
    return;
  }

  prefectureTitle.textContent =
    prefectureName;

  document.title =
    `${prefectureName} | Hotel Score Map`;

  const records =
    getStoredHotels().filter(
      (hotel) =>
        hotel.prefecture === prefectureSlug
    );

  groupedHotels =
    groupHotelRecords(records);

  hotelCount.textContent =
    `${groupedHotels.length}施設`;

  applySortAndRender();
}

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

    groupMap.get(key).push(hotel);
  });

  return [...groupMap.entries()].map(
    ([key, histories]) => {
      const sortedHistories =
        [...histories].sort(
          sortHistoryNewest
        );

      const latest =
        sortedHistories[0];

      return {
        key,

        name:
          latest.name ||
          "名称未登録",

        address:
          latest.address ||
          latest.prefectureName ||
          prefectureName,

        prefecture:
          latest.prefecture,

        prefectureCode:
          latest.prefectureCode,

        prefectureName:
          latest.prefectureName,

        latitude:
          latest.latitude,

        longitude:
          latest.longitude,

        latestRecord:
          latest,

        histories:
          sortedHistories,

        stayCount:
          sortedHistories.length,

        latestStayDate:
          latest.stayDate,

        latestScore:
          getScore(latest),

        latestRank:
          getHotelRank(latest),

        hallOfFame:
          latest.hallOfFame === true ||
          getScore(latest) > 5.000
      };
    }
  );
}

/* ==================================
   同一ホテル判定
================================== */

function createHotelKey(hotel) {
  const normalizedName =
    normalizeText(hotel.name);

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
   宿泊履歴の順番
================================== */

function sortHistoryNewest(a, b) {
  return (
    getDateTimestamp(b) -
    getDateTimestamp(a)
  );
}

/* ==================================
   並び替え
================================== */

sortSelect.addEventListener(
  "change",
  applySortAndRender
);

function applySortAndRender() {
  const sortType =
    sortSelect.value;

  const sorted =
    [...groupedHotels].sort(
      getSortFunction(sortType)
    );

  renderHotels(sorted);
}

function getSortFunction(sortType) {
  switch (sortType) {
    case "score-asc":
      return sortByScoreAscending;

    case "date-desc":
      return sortByDateDescending;

    case "date-asc":
      return sortByDateAscending;

    case "count-desc":
      return sortByCountDescending;

    case "rank":
      return sortByRank;

    case "name":
      return sortByName;

    case "score-desc":
    default:
      return sortByScoreDescending;
  }
}

function sortByScoreDescending(a, b) {
  const difference =
    b.latestScore -
    a.latestScore;

  if (difference !== 0) {
    return difference;
  }

  return sortByDateDescending(a, b);
}

function sortByScoreAscending(a, b) {
  const difference =
    a.latestScore -
    b.latestScore;

  if (difference !== 0) {
    return difference;
  }

  return sortByDateDescending(a, b);
}

function sortByDateDescending(a, b) {
  return (
    getDateTimestamp(
      b.latestRecord
    ) -
    getDateTimestamp(
      a.latestRecord
    )
  );
}

function sortByDateAscending(a, b) {
  return (
    getDateTimestamp(
      a.latestRecord
    ) -
    getDateTimestamp(
      b.latestRecord
    )
  );
}

function sortByCountDescending(a, b) {
  const difference =
    b.stayCount -
    a.stayCount;

  if (difference !== 0) {
    return difference;
  }

  return sortByDateDescending(a, b);
}

function sortByRank(a, b) {
  const difference =
    a.latestRank -
    b.latestRank;

  if (difference !== 0) {
    return difference;
  }

  return sortByScoreDescending(a, b);
}

function sortByName(a, b) {
  return a.name.localeCompare(
    b.name,
    "ja"
  );
}

/* ==================================
   ホテル一覧表示
================================== */

function renderHotels(hotels) {
  hotelList.innerHTML = "";

  if (hotels.length === 0) {
    hotelList.innerHTML = `
      <p class="empty-message">
        この都道府県には
        まだホテルが登録されていません
      </p>
    `;

    return;
  }

  hotels.forEach((hotel) => {
    const card =
      document.createElement("a");

    const query =
      new URLSearchParams({
        key: hotel.key,
        code:
          hotel.prefectureCode ?? "",
        pref:
          hotel.prefecture ?? "",
        name:
          hotel.prefectureName ??
          prefectureName
      });

    card.href =
      `hotel-history.html?${query.toString()}`;

    card.className =
      "hotel-card";

    if (hotel.hallOfFame) {
      card.classList.add(
        "hall-of-fame"
      );
    }

    const info =
      document.createElement("div");

    info.className =
      "hotel-info";

    const name =
      document.createElement("h2");

    name.className =
      "hotel-name";

    name.textContent =
      hotel.name;

    const location =
      document.createElement("p");

    location.className =
      "hotel-location";

    location.textContent =
      hotel.address;

    const historyMeta =
      document.createElement("p");

    historyMeta.className =
      "hotel-history-meta";

    const stayCount =
      document.createElement("span");

    stayCount.innerHTML =
      `宿泊回数 <strong>${hotel.stayCount}回</strong>`;

    const latestDate =
      document.createElement("span");

    latestDate.innerHTML =
      `最新宿泊 <strong>${formatDate(
        hotel.latestStayDate
      )}</strong>`;

    historyMeta.append(
      stayCount,
      latestDate
    );

    info.append(
      name,
      location,
      historyMeta
    );

    const scoreArea =
      document.createElement("div");

    scoreArea.className =
      "hotel-score-area";

    const scoreBlock =
      document.createElement("div");

    scoreBlock.className =
      "hotel-score-block";

    const scoreLabel =
      document.createElement("span");

    scoreLabel.className =
      "hotel-score-label";

    scoreLabel.textContent =
      "最新評価";

    const score =
      document.createElement("div");

    score.className =
      `hotel-score rank-${hotel.latestRank}`;

    score.textContent =
      formatScore(
        hotel.latestScore
      );

    scoreBlock.append(
      scoreLabel,
      score
    );

    const arrow =
      document.createElement("span");

    arrow.className =
      "hotel-arrow";

    arrow.textContent = "›";

    scoreArea.append(
      scoreBlock,
      arrow
    );

    card.append(
      info,
      scoreArea
    );

    hotelList.appendChild(card);
  });
}

/* ==================================
   評価・ランク
================================== */

function getScore(hotel) {
  const finalScore =
    Number(hotel.finalScore);

  if (Number.isFinite(finalScore)) {
    return finalScore;
  }

  const normalScore =
    Number(hotel.normalScore);

  if (Number.isFinite(normalScore)) {
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
   日付
================================== */

function getDateTimestamp(hotel) {
  const stayDate =
    Date.parse(
      hotel.stayDate ?? ""
    );

  if (Number.isFinite(stayDate)) {
    return stayDate;
  }

  const createdAt =
    Date.parse(
      hotel.createdAt ?? ""
    );

  if (Number.isFinite(createdAt)) {
    return createdAt;
  }

  return 0;
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

/* ==================================
   評価表示
================================== */

function formatScore(value) {
  const score =
    Number(value);

  if (!Number.isFinite(score)) {
    return "---";
  }

  return score.toFixed(3);
}

/* ==================================
   エラー
================================== */

function showPrefectureError() {
  prefectureTitle.textContent =
    "都道府県";

  hotelCount.textContent =
    "0施設";

  hotelList.innerHTML = `
    <p class="empty-message">
      都道府県情報を取得できませんでした
    </p>
  `;

  sortSelect.disabled = true;
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
      "保存済みホテルの読み込みに失敗しました。",
      error
    );

    return [];
  }
}