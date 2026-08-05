"use strict";

/* ==================================
   都道府県
================================== */

const prefectures = [
  { code: "01", name: "北海道", slug: "hokkaido" },
  { code: "02", name: "青森県", slug: "aomori" },
  { code: "03", name: "岩手県", slug: "iwate" },
  { code: "04", name: "宮城県", slug: "miyagi" },
  { code: "05", name: "秋田県", slug: "akita" },
  { code: "06", name: "山形県", slug: "yamagata" },
  { code: "07", name: "福島県", slug: "fukushima" },
  { code: "08", name: "茨城県", slug: "ibaraki" },
  { code: "09", name: "栃木県", slug: "tochigi" },
  { code: "10", name: "群馬県", slug: "gunma" },
  { code: "11", name: "埼玉県", slug: "saitama" },
  { code: "12", name: "千葉県", slug: "chiba" },
  { code: "13", name: "東京都", slug: "tokyo" },
  { code: "14", name: "神奈川県", slug: "kanagawa" },
  { code: "15", name: "新潟県", slug: "niigata" },
  { code: "16", name: "富山県", slug: "toyama" },
  { code: "17", name: "石川県", slug: "ishikawa" },
  { code: "18", name: "福井県", slug: "fukui" },
  { code: "19", name: "山梨県", slug: "yamanashi" },
  { code: "20", name: "長野県", slug: "nagano" },
  { code: "21", name: "岐阜県", slug: "gifu" },
  { code: "22", name: "静岡県", slug: "shizuoka" },
  { code: "23", name: "愛知県", slug: "aichi" },
  { code: "24", name: "三重県", slug: "mie" },
  { code: "25", name: "滋賀県", slug: "shiga" },
  { code: "26", name: "京都府", slug: "kyoto" },
  { code: "27", name: "大阪府", slug: "osaka" },
  { code: "28", name: "兵庫県", slug: "hyogo" },
  { code: "29", name: "奈良県", slug: "nara" },
  { code: "30", name: "和歌山県", slug: "wakayama" },
  { code: "31", name: "鳥取県", slug: "tottori" },
  { code: "32", name: "島根県", slug: "shimane" },
  { code: "33", name: "岡山県", slug: "okayama" },
  { code: "34", name: "広島県", slug: "hiroshima" },
  { code: "35", name: "山口県", slug: "yamaguchi" },
  { code: "36", name: "徳島県", slug: "tokushima" },
  { code: "37", name: "香川県", slug: "kagawa" },
  { code: "38", name: "愛媛県", slug: "ehime" },
  { code: "39", name: "高知県", slug: "kochi" },
  { code: "40", name: "福岡県", slug: "fukuoka" },
  { code: "41", name: "佐賀県", slug: "saga" },
  { code: "42", name: "長崎県", slug: "nagasaki" },
  { code: "43", name: "熊本県", slug: "kumamoto" },
  { code: "44", name: "大分県", slug: "oita" },
  { code: "45", name: "宮崎県", slug: "miyazaki" },
  { code: "46", name: "鹿児島県", slug: "kagoshima" },
  { code: "47", name: "沖縄県", slug: "okinawa" }
];

/* ==================================
   HTML要素
================================== */

const hotelSearch =
  document.getElementById("hotelSearch");

const clearSearchButton =
  document.getElementById("clearSearchButton");

const searchStatus =
  document.getElementById("searchStatus");

const searchResultSection =
  document.getElementById("searchResultSection");

const searchResultCount =
  document.getElementById("searchResultCount");

const hotelSearchResults =
  document.getElementById("hotelSearchResults");

const prefectureSection =
  document.getElementById("prefectureSection");

const prefectureHotelCount =
  document.getElementById("prefectureHotelCount");

const prefList =
  document.getElementById("prefList");

if (
  !hotelSearch ||
  !clearSearchButton ||
  !searchStatus ||
  !searchResultSection ||
  !searchResultCount ||
  !hotelSearchResults ||
  !prefectureSection ||
  !prefectureHotelCount ||
  !prefList
) {
  throw new Error(
    "検索画面に必要なHTML要素が見つかりません。"
  );
}

/* ==================================
   保存データ
================================== */

const allHotelRecords =
  getStoredHotels();

const groupedHotels =
  groupHotelRecords(allHotelRecords);

const prefectureCounts =
  countHotelsByPrefecture(groupedHotels);

/* ==================================
   初期表示
================================== */

prefectureHotelCount.textContent =
  `${groupedHotels.length}施設`;

renderPrefectures();

searchStatus.textContent =
  "ホテル名・地域・住所から検索できます";

/* ==================================
   検索
================================== */

hotelSearch.addEventListener(
  "input",
  handleSearch
);

clearSearchButton.addEventListener(
  "click",
  clearSearch
);

function handleSearch() {
  const keyword =
    normalizeSearchText(
      hotelSearch.value
    );

  if (keyword === "") {
    showPrefectureList();
    return;
  }

  const matchedHotels =
    groupedHotels
      .filter((hotel) =>
        doesHotelMatch(
          hotel,
          keyword
        )
      )
      .sort(sortSearchResults);

  renderSearchResults(
    matchedHotels
  );
}

function clearSearch() {
  hotelSearch.value = "";

  hotelSearch.focus();

  showPrefectureList();
}

function showPrefectureList() {
  searchResultSection.hidden =
    true;

  prefectureSection.hidden =
    false;

  hotelSearchResults.innerHTML =
    "";

  searchResultCount.textContent =
    "0施設";

  searchStatus.textContent =
    "ホテル名・地域・住所から検索できます";
}

/* ==================================
   検索対象
================================== */

function doesHotelMatch(
  hotel,
  keyword
) {
  const searchableTexts = [
    hotel.name,
    hotel.address,
    hotel.prefectureName,
    hotel.prefecture,
    hotel.latestRecord?.name,
    hotel.latestRecord?.address
  ];

  return searchableTexts.some(
    (value) =>
      normalizeSearchText(value)
        .includes(keyword)
  );
}

function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[‐-‒–—―ー－]/g, "-")
    .replace(/[ヶケ]/g, "ケ")
    .trim();
}

/* ==================================
   検索結果表示
================================== */

function renderSearchResults(hotels) {
  searchResultSection.hidden =
    false;

  prefectureSection.hidden =
    true;

  hotelSearchResults.innerHTML =
    "";

  searchResultCount.textContent =
    `${hotels.length}施設`;

  if (hotels.length === 0) {
    searchStatus.textContent =
      "該当するホテルや地域がありません";

    hotelSearchResults.innerHTML = `
      <p class="empty-message">
        条件に一致するホテルがありません
      </p>
    `;

    return;
  }

  searchStatus.textContent =
    `${hotels.length}施設見つかりました`;

  hotels.forEach((hotel) => {
    const card =
      createSearchHotelCard(hotel);

    hotelSearchResults.appendChild(
      card
    );
  });
}

function createSearchHotelCard(hotel) {
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
        hotel.prefectureName ?? ""
    });

  card.href =
    `hotel-history.html?${query.toString()}`;

  card.className =
    "search-hotel-card";

  if (hotel.hallOfFame) {
    card.classList.add(
      "hall-of-fame"
    );
  }

  const info =
    document.createElement("div");

  info.className =
    "search-hotel-info";

  const name =
    document.createElement("h3");

  name.className =
    "search-hotel-name";

  name.textContent =
    hotel.name;

  const address =
    document.createElement("p");

  address.className =
    "search-hotel-address";

  address.textContent =
    hotel.address ||
    hotel.prefectureName ||
    "所在地未登録";

  const meta =
    document.createElement("p");

  meta.className =
    "search-hotel-meta";

  const prefecture =
    document.createElement("span");

  prefecture.innerHTML =
    `地域 <strong>${escapeHtml(
      hotel.prefectureName ||
      "未登録"
    )}</strong>`;

  const count =
    document.createElement("span");

  count.innerHTML =
    `宿泊回数 <strong>${hotel.stayCount}回</strong>`;

  const latest =
    document.createElement("span");

  latest.innerHTML =
    `最新宿泊 <strong>${escapeHtml(
      formatDate(
        hotel.latestStayDate
      )
    )}</strong>`;

  meta.append(
    prefecture,
    count,
    latest
  );

  info.append(
    name,
    address,
    meta
  );

  const scoreArea =
    document.createElement("div");

  scoreArea.className =
    "search-hotel-score-area";

  const score =
    document.createElement("div");

  score.className =
    `search-hotel-score rank-${hotel.latestRank}`;

  score.textContent =
    formatScore(
      hotel.latestScore
    );

  const arrow =
    document.createElement("span");

  arrow.className =
    "search-hotel-arrow";

  arrow.textContent =
    "›";

  scoreArea.append(
    score,
    arrow
  );

  card.append(
    info,
    scoreArea
  );

  return card;
}

/* ==================================
   検索結果の並び順
================================== */

function sortSearchResults(a, b) {
  const scoreDifference =
    b.latestScore -
    a.latestScore;

  if (scoreDifference !== 0) {
    return scoreDifference;
  }

  const dateDifference =
    getDateTimestamp(
      b.latestRecord
    ) -
    getDateTimestamp(
      a.latestRecord
    );

  if (dateDifference !== 0) {
    return dateDifference;
  }

  return a.name.localeCompare(
    b.name,
    "ja"
  );
}

/* ==================================
   都道府県一覧
================================== */

function renderPrefectures() {
  prefList.innerHTML = "";

  prefectures.forEach(
    (prefecture) => {
      const link =
        document.createElement("a");

      const query =
        new URLSearchParams({
          code:
            prefecture.code,
          pref:
            prefecture.slug,
          name:
            prefecture.name
        });

      link.href =
        `prefecture.html?${query.toString()}`;

      link.className =
        "pref-item";

      const name =
        document.createElement("span");

      name.className =
        "pref-name";

      name.textContent =
        prefecture.name;

      const count =
        document.createElement("span");

      count.className =
        "pref-count";

      const facilityCount =
        prefectureCounts[
          prefecture.slug
        ] ?? 0;

      count.textContent =
        `${facilityCount}施設`;

      const arrow =
        document.createElement("span");

      arrow.className =
        "pref-arrow";

      arrow.textContent =
        "›";

      link.append(
        name,
        count,
        arrow
      );

      prefList.appendChild(link);
    }
  );
}

function countHotelsByPrefecture(
  hotels
) {
  return hotels.reduce(
    (counts, hotel) => {
      const slug =
        hotel.prefecture;

      if (!slug) {
        return counts;
      }

      counts[slug] =
        (counts[slug] ?? 0) + 1;

      return counts;
    },
    {}
  );
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

    groupMap.get(key).push(
      hotel
    );
  });

  return [...groupMap.entries()]
    .map(
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
            "所在地未登録",

          prefecture:
            latest.prefecture,

          prefectureCode:
            latest.prefectureCode,

          prefectureName:
            latest.prefectureName,

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
    normalizeSearchText(
      hotel.name
    );

  const normalizedAddress =
    normalizeSearchText(
      hotel.address ||
      hotel.prefectureName ||
      hotel.prefecture
    );

  return `${normalizedName}::${normalizedAddress}`;
}

/* ==================================
   評価
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
   日付
================================== */

function sortHistoryNewest(a, b) {
  return (
    getDateTimestamp(b) -
    getDateTimestamp(a)
  );
}

function getDateTimestamp(hotel) {
  const stayDate =
    Date.parse(
      hotel.stayDate ?? ""
    );

  if (
    Number.isFinite(stayDate)
  ) {
    return stayDate;
  }

  const createdAt =
    Date.parse(
      hotel.createdAt ?? ""
    );

  if (
    Number.isFinite(createdAt)
  ) {
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
   表示
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

function escapeHtml(value) {
  return String(value)
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
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