"use strict";

/* ==================================
   URLパラメータ
================================== */

const params =
  new URLSearchParams(window.location.search);

const hotelKey =
  params.get("key");

const prefectureCode =
  params.get("code");

const prefectureSlug =
  params.get("pref");

const prefectureName =
  params.get("name");

/* ==================================
   HTML要素
================================== */

const historyTitle =
  document.getElementById("historyTitle");

const backButton =
  document.getElementById("backButton");

const stayCount =
  document.getElementById("stayCount");

const hotelName =
  document.getElementById("hotelName");

const hotelAddress =
  document.getElementById("hotelAddress");

const latestScore =
  document.getElementById("latestScore");

const latestRank =
  document.getElementById("latestRank");

const historySort =
  document.getElementById("historySort");

const historyList =
  document.getElementById("historyList");

if (
  !historyTitle ||
  !backButton ||
  !stayCount ||
  !hotelName ||
  !hotelAddress ||
  !latestScore ||
  !latestRank ||
  !historySort ||
  !historyList
) {
  throw new Error(
    "宿泊履歴ページに必要なHTML要素が見つかりません。"
  );
}

/* ==================================
   状態
================================== */

let hotelHistories = [];

/* ==================================
   初期化
================================== */

initializePage();

function initializePage() {
  if (!hotelKey) {
    showHistoryError(
      "ホテル情報を取得できませんでした"
    );

    return;
  }

  const allHotels =
    getStoredHotels();

  hotelHistories =
    allHotels
      .filter(
        (hotel) =>
          createHotelKey(hotel) === hotelKey
      )
      .sort(sortByDateDescending);

  if (hotelHistories.length === 0) {
    showHistoryError(
      "宿泊履歴が見つかりませんでした"
    );

    return;
  }

  const latestRecord =
    hotelHistories[0];

  const displayName =
    latestRecord.name ||
    "ホテル名未登録";

  const displayAddress =
    latestRecord.address ||
    latestRecord.prefectureName ||
    "所在地未登録";

  historyTitle.textContent =
    displayName;

  document.title =
    `${displayName} 宿泊履歴 | Hotel Score Map`;

  hotelName.textContent =
    displayName;

  hotelAddress.textContent =
    displayAddress;

  stayCount.textContent =
    `${hotelHistories.length}回`;

  latestScore.textContent =
    formatScore(
      latestRecord.finalScore
    );

  updateLatestRank(
    latestRecord
  );

  renderHistories(
    hotelHistories
  );
}

/* ==================================
   戻る
================================== */

backButton.addEventListener(
  "click",
  () => {
    const query =
      new URLSearchParams({
        code:
          prefectureCode ?? "",

        pref:
          prefectureSlug ??
          hotelHistories[0]?.prefecture ??
          "",

        name:
          prefectureName ??
          hotelHistories[0]?.prefectureName ??
          ""
      });

    window.location.href =
      `prefecture.html?${query.toString()}`;
  }
);

/* ==================================
   並び替え
================================== */

historySort.addEventListener(
  "change",
  () => {
    const sorted =
      [...hotelHistories].sort(
        getSortFunction(
          historySort.value
        )
      );

    renderHistories(sorted);
  }
);

function getSortFunction(sortType) {
  switch (sortType) {
    case "date-asc":
      return sortByDateAscending;

    case "score-desc":
      return sortByScoreDescending;

    case "score-asc":
      return sortByScoreAscending;

    case "date-desc":
    default:
      return sortByDateDescending;
  }
}

function sortByDateDescending(a, b) {
  return (
    getDateTimestamp(b) -
    getDateTimestamp(a)
  );
}

function sortByDateAscending(a, b) {
  return (
    getDateTimestamp(a) -
    getDateTimestamp(b)
  );
}

function sortByScoreDescending(a, b) {
  const difference =
    getScore(b) -
    getScore(a);

  if (difference !== 0) {
    return difference;
  }

  return sortByDateDescending(a, b);
}

function sortByScoreAscending(a, b) {
  const difference =
    getScore(a) -
    getScore(b);

  if (difference !== 0) {
    return difference;
  }

  return sortByDateDescending(a, b);
}

/* ==================================
   履歴表示
================================== */

function renderHistories(histories) {
  historyList.innerHTML = "";

  if (histories.length === 0) {
    historyList.innerHTML = `
      <p class="empty-message">
        宿泊履歴がありません
      </p>
    `;

    return;
  }

  const newestTimestamp =
    Math.max(
      ...hotelHistories.map(
        getDateTimestamp
      )
    );

  histories.forEach((hotel) => {
    const card =
      document.createElement("a");

    const query =
      new URLSearchParams({
        id: hotel.id
      });

    card.href =
      `hotel.html?${query.toString()}`;

    card.className =
      "history-card";

    const isLatest =
      getDateTimestamp(hotel) ===
      newestTimestamp;

    if (isLatest) {
      card.classList.add("latest");
    }

    const main =
      document.createElement("div");

    main.className =
      "history-card-main";

    const date =
      document.createElement("p");

    date.className =
      "history-date";

    date.textContent =
      formatDate(
        hotel.stayDate
      );

    if (isLatest) {
      const badge =
        document.createElement("span");

      badge.className =
        "latest-badge";

      badge.textContent =
        "最新";

      date.appendChild(badge);
    }

    const location =
      document.createElement("p");

    location.className =
      "history-location";

    location.textContent =
      hotel.address ||
      hotel.prefectureName ||
      "所在地未登録";

    main.append(
      date,
      location
    );

    const scoreArea =
      document.createElement("div");

    scoreArea.className =
      "history-score-area";

    const score =
      document.createElement("div");

    const rank =
      getHotelRank(hotel);

    score.className =
      `history-score rank-${rank}`;

    score.textContent =
      formatScore(
        hotel.finalScore
      );

    const arrow =
      document.createElement("span");

    arrow.className =
      "history-arrow";

    arrow.textContent =
      "›";

    scoreArea.append(
      score,
      arrow
    );

    card.append(
      main,
      scoreArea
    );

    historyList.appendChild(card);
  });
}

/* ==================================
   最新ランク表示
================================== */

function updateLatestRank(hotel) {
  latestRank.className =
    "latest-rank";

  const score =
    getScore(hotel);

  const rank =
    getHotelRank(hotel);

  latestRank.classList.add(
    `rank-${rank}`
  );

  if (
    hotel.hallOfFame ||
    score > 5.000
  ) {
    latestRank.textContent =
      "👑 殿堂入り";

    return;
  }

  latestRank.textContent =
    `総合ランク${rank}`;
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
   評価・ランク
================================== */

function getScore(hotel) {
  const finalScoreValue =
    Number(hotel.finalScore);

  if (
    Number.isFinite(
      finalScoreValue
    )
  ) {
    return finalScoreValue;
  }

  const normalScoreValue =
    Number(hotel.normalScore);

  if (
    Number.isFinite(
      normalScoreValue
    )
  ) {
    return normalScoreValue;
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

function formatDate(dateString) {
  if (!dateString) {
    return "宿泊日未登録";
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

  if (
    !Number.isFinite(score)
  ) {
    return "---";
  }

  return score.toFixed(3);
}

/* ==================================
   エラー表示
================================== */

function showHistoryError(message) {
  historyTitle.textContent =
    "宿泊履歴";

  stayCount.textContent =
    "0回";

  hotelName.textContent =
    "ホテル情報なし";

  hotelAddress.textContent =
    message;

  latestScore.textContent =
    "---";

  latestRank.className =
    "latest-rank rank-unset";

  latestRank.textContent =
    "未評価";

  historyList.innerHTML = `
    <p class="empty-message">
      ${escapeHtml(message)}
    </p>
  `;

  historySort.disabled =
    true;
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
      "宿泊履歴の読み込みに失敗しました。",
      error
    );

    return [];
  }
}

/* ==================================
   HTMLエスケープ
================================== */

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}