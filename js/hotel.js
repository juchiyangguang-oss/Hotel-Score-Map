"use strict";

/* ==================================
   URLからホテルIDを取得
================================== */

const params =
  new URLSearchParams(window.location.search);

const hotelId =
  params.get("id");

/* ==================================
   HTML要素
================================== */

const hotelTitle =
  document.getElementById("hotelTitle");

const backButton =
  document.getElementById("backButton");

const editButton =
  document.getElementById("editButton");

const deleteButton =
  document.getElementById("deleteButton");

const hotelLocation =
  document.getElementById("hotelLocation");

const hotelStayDate =
  document.getElementById("hotelStayDate");

const hotelScore =
  document.getElementById("hotelScore");

const hotelRank =
  document.getElementById("hotelRank");

const scoreRoom =
  document.getElementById("scoreRoom");

const scoreService =
  document.getElementById("scoreService");

const scoreBath =
  document.getElementById("scoreBath");

const scoreFacility =
  document.getElementById("scoreFacility");

const scoreMeal =
  document.getElementById("scoreMeal");

const scoreSatisfaction =
  document.getElementById("scoreSatisfaction");

const normalScore =
  document.getElementById("normalScore");

const repeatPoint =
  document.getElementById("repeatPoint");

const repeatType =
  document.getElementById("repeatType");

const deleteDialog =
  document.getElementById("deleteDialog");

const confirmDeleteButton =
  document.getElementById("confirmDeleteButton");

if (
  !hotelTitle ||
  !backButton ||
  !editButton ||
  !deleteButton ||
  !hotelLocation ||
  !hotelStayDate ||
  !hotelScore ||
  !hotelRank ||
  !scoreRoom ||
  !scoreService ||
  !scoreBath ||
  !scoreFacility ||
  !scoreMeal ||
  !scoreSatisfaction ||
  !normalScore ||
  !repeatPoint ||
  !repeatType ||
  !deleteDialog ||
  !confirmDeleteButton
) {
  throw new Error(
    "ホテル詳細画面に必要なHTML要素が見つかりません。"
  );
}

/* ==================================
   保存済みホテル
================================== */

let hotels =
  getStoredHotels();

const hotel =
  hotels.find(
    (item) => item.id === hotelId
  );

/* ==================================
   初期表示
================================== */

initializePage();

function initializePage() {
  if (!hotelId || !hotel) {
    showHotelNotFound();
    return;
  }

  hotelTitle.textContent =
    hotel.name || "ホテル詳細";

  document.title =
    `${hotel.name || "ホテル詳細"} | Hotel Score Map`;

  hotelLocation.textContent =
    hotel.address ||
    hotel.prefectureName ||
    "所在地未登録";

  hotelStayDate.textContent =
    `宿泊日：${formatDate(hotel.stayDate)}`;

  hotelScore.textContent =
    formatScore(hotel.finalScore);

  setRankDisplay(hotel);

  const savedScores =
    hotel.scores ?? {};

  scoreRoom.textContent =
    formatCategoryScore(
      savedScores.room
    );

  scoreService.textContent =
    formatCategoryScore(
      savedScores.service
    );

  scoreBath.textContent =
    formatCategoryScore(
      savedScores.bath
    );

  scoreFacility.textContent =
    formatCategoryScore(
      savedScores.facility
    );

  scoreMeal.textContent =
    formatCategoryScore(
      savedScores.meal
    );

  scoreSatisfaction.textContent =
    formatCategoryScore(
      savedScores.satisfaction
    );

  normalScore.textContent =
    formatScore(
      hotel.normalScore
    );

  repeatPoint.textContent =
    formatRepeatPoint(
      hotel.repeatPoint
    );

  repeatType.textContent =
    formatRepeatType(
      hotel.repeatType
    );
}

/* ==================================
   ランク表示
================================== */

function setRankDisplay(hotelData) {
  hotelRank.className =
    "hotel-rank";

  const finalScore =
    Number(hotelData.finalScore);

  const rank =
    getRank(
      Number.isFinite(finalScore)
        ? finalScore
        : Number(hotelData.normalScore)
    );

  hotelRank.classList.add(
    `rank-${rank}`
  );

  const overviewCard =
    document.querySelector(
      ".overview-card"
    );

  if (
    hotelData.hallOfFame ||
    finalScore > 5.000
  ) {
    hotelRank.textContent =
      "殿堂入り";

    overviewCard?.classList.add(
      "hall-of-fame"
    );

    return;
  }

  hotelRank.textContent =
    `総合ランク${rank}`;
}

function getRank(score) {
  if (!Number.isFinite(score)) {
    return 6;
  }

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
   戻る
================================== */

backButton.addEventListener(
  "click",
  () => {
    if (hotel?.prefecture) {
      const query =
        new URLSearchParams({
          code:
            hotel.prefectureCode ?? "",

          pref:
            hotel.prefecture,

          name:
            hotel.prefectureName ?? ""
        });

      window.location.href =
        `prefecture.html?${query.toString()}`;

      return;
    }

    window.location.href =
      "list.html";
  }
);

/* ==================================
   編集
================================== */

editButton.addEventListener(
  "click",
  () => {
    if (!hotel?.id) {
      return;
    }

    const query =
      new URLSearchParams({
        edit: hotel.id
      });

    window.location.href =
      `add.html?${query.toString()}`;
  }
);

/* ==================================
   削除
================================== */

deleteButton.addEventListener(
  "click",
  () => {
    if (!hotel) {
      return;
    }

    deleteDialog.showModal();
  }
);

confirmDeleteButton.addEventListener(
  "click",
  () => {
    if (!hotelId) {
      return;
    }

    hotels =
      hotels.filter(
        (item) =>
          item.id !== hotelId
      );

    saveStoredHotels(hotels);

    deleteDialog.close();

    if (hotel?.prefecture) {
      const query =
        new URLSearchParams({
          code:
            hotel.prefectureCode ?? "",

          pref:
            hotel.prefecture,

          name:
            hotel.prefectureName ?? ""
        });

      window.location.href =
        `prefecture.html?${query.toString()}`;

      return;
    }

    window.location.href =
      "list.html";
  }
);

/* ==================================
   ホテルが見つからない場合
================================== */

function showHotelNotFound() {
  hotelTitle.textContent =
    "ホテル詳細";

  document.title =
    "ホテル詳細 | Hotel Score Map";

  hotelLocation.textContent =
    "ホテル情報を取得できませんでした";

  hotelStayDate.textContent =
    "";

  hotelScore.textContent =
    "---";

  hotelRank.className =
    "hotel-rank rank-unset";

  hotelRank.textContent =
    "未登録";

  editButton.disabled =
    true;

  deleteButton.disabled =
    true;

  [
    scoreRoom,
    scoreService,
    scoreBath,
    scoreFacility,
    scoreMeal,
    scoreSatisfaction
  ].forEach((element) => {
    element.textContent =
      "未評価";
  });

  normalScore.textContent =
    "---";

  repeatPoint.textContent =
    "+0.000";

  repeatType.textContent =
    "なし";
}

/* ==================================
   表示形式
================================== */

function formatCategoryScore(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "未評価";
  }

  const number =
    Number(value);

  if (!Number.isFinite(number)) {
    return "未評価";
  }

  return number.toFixed(3);
}

function formatScore(value) {
  const number =
    Number(value);

  if (!Number.isFinite(number)) {
    return "---";
  }

  return number.toFixed(3);
}

function formatRepeatPoint(value) {
  const number =
    Number(value);

  if (!Number.isFinite(number)) {
    return "+0.000";
  }

  return `+${number.toFixed(3)}`;
}

function formatRepeatType(type) {
  if (type === "intense") {
    return "激リピあり";
  }

  if (type === "normal") {
    return "リピあり";
  }

  return "なし";
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

function saveStoredHotels(hotelData) {
  localStorage.setItem(
    "hotelScoreMap.hotels",
    JSON.stringify(hotelData)
  );
}