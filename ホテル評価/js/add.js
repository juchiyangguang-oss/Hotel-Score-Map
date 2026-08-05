"use strict";

/* ==================================
   都道府県データ
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

/* 都道府県ごとの地図初期位置 */

const prefectureCenters = {
  hokkaido: [43.3, 142.7],
  aomori: [40.8, 140.7],
  iwate: [39.7, 141.2],
  miyagi: [38.3, 140.9],
  akita: [39.7, 140.1],
  yamagata: [38.2, 140.3],
  fukushima: [37.8, 140.5],
  ibaraki: [36.3, 140.4],
  tochigi: [36.6, 139.9],
  gunma: [36.4, 139.1],
  saitama: [35.9, 139.6],
  chiba: [35.6, 140.1],
  tokyo: [35.7, 139.7],
  kanagawa: [35.4, 139.6],
  niigata: [37.9, 139.0],
  toyama: [36.7, 137.2],
  ishikawa: [36.6, 136.6],
  fukui: [36.1, 136.2],
  yamanashi: [35.7, 138.6],
  nagano: [36.2, 138.2],
  gifu: [35.4, 136.8],
  shizuoka: [34.98, 138.38],
  aichi: [35.18, 136.91],
  mie: [34.7, 136.5],
  shiga: [35.0, 135.9],
  kyoto: [35.0, 135.8],
  osaka: [34.7, 135.5],
  hyogo: [34.7, 135.2],
  nara: [34.7, 135.8],
  wakayama: [34.2, 135.2],
  tottori: [35.5, 134.2],
  shimane: [35.5, 133.1],
  okayama: [34.7, 133.9],
  hiroshima: [34.4, 132.5],
  yamaguchi: [34.2, 131.5],
  tokushima: [34.1, 134.6],
  kagawa: [34.3, 134.0],
  ehime: [33.8, 132.8],
  kochi: [33.6, 133.5],
  fukuoka: [33.6, 130.4],
  saga: [33.3, 130.3],
  nagasaki: [32.8, 129.9],
  kumamoto: [32.8, 130.7],
  oita: [33.2, 131.6],
  miyazaki: [31.9, 131.4],
  kagoshima: [31.6, 130.6],
  okinawa: [26.3, 127.8]
};

/* ==================================
   評価項目
================================== */

const categoryNames = {
  room: "客室・アメニティ",
  service: "接客・サービス",
  bath: "バス・お風呂",
  facility: "施設・設備",
  meal: "お食事",
  satisfaction: "満足度"
};

const scores = {
  room: null,
  service: null,
  bath: null,
  facility: null,
  meal: null,
  satisfaction: null
};

let activeCategory = null;

/* ==================================
   編集モード
================================== */

const pageParams =
  new URLSearchParams(window.location.search);

const editId =
  pageParams.get("edit");

const isEditMode =
  Boolean(editId);

let editingHotel = null;

/* ==================================
   地図位置
================================== */

let selectedLatitude = null;
let selectedLongitude = null;

let locationMap = null;
let locationMarker = null;

/* ==================================
   HTML要素
================================== */

const pageTitle =
  document.querySelector(".app-title");

const hotelForm =
  document.getElementById("hotelForm");

const hotelNameInput =
  document.getElementById("hotelName");

const prefectureSelect =
  document.getElementById("prefecture");

const addressInput =
  document.getElementById("address");

const stayDateInput =
  document.getElementById("stayDate");

const saveButton =
  document.getElementById("saveButton");

const totalScoreElement =
  document.getElementById("totalScore");

const rankBadge =
  document.getElementById("rankBadge");

const categoryButtons =
  document.querySelectorAll(".category-button");

const repeatMessage =
  document.getElementById("repeatMessage");

const repeatNormal =
  document.getElementById("repeatNormal");

const repeatIntense =
  document.getElementById("repeatIntense");

const formMessage =
  document.getElementById("formMessage");

/* 評価入力ダイアログ */

const scoreDialog =
  document.getElementById("scoreDialog");

const dialogTitle =
  document.getElementById("dialogTitle");

const categoryScoreInput =
  document.getElementById("categoryScore");

const clearScoreButton =
  document.getElementById("clearScoreButton");

const applyScoreButton =
  document.getElementById("applyScoreButton");

/* 位置設定 */

const openLocationDialogButton =
  document.getElementById("openLocationDialogButton");

const locationStatus =
  document.getElementById("locationStatus");

const locationDialog =
  document.getElementById("locationDialog");

const closeLocationDialogButton =
  document.getElementById("closeLocationDialogButton");

const locationSearchInput =
  document.getElementById("locationSearchInput");

const locationSearchButton =
  document.getElementById("locationSearchButton");

const locationSearchMessage =
  document.getElementById("locationSearchMessage");

const latitudeDisplay =
  document.getElementById("latitudeDisplay");

const longitudeDisplay =
  document.getElementById("longitudeDisplay");

const clearLocationButton =
  document.getElementById("clearLocationButton");

const applyLocationButton =
  document.getElementById("applyLocationButton");

/* 必須要素確認 */

if (
  !pageTitle ||
  !hotelForm ||
  !hotelNameInput ||
  !prefectureSelect ||
  !addressInput ||
  !stayDateInput ||
  !saveButton ||
  !totalScoreElement ||
  !rankBadge ||
  !repeatMessage ||
  !repeatNormal ||
  !repeatIntense ||
  !formMessage ||
  !scoreDialog ||
  !dialogTitle ||
  !categoryScoreInput ||
  !clearScoreButton ||
  !applyScoreButton ||
  !openLocationDialogButton ||
  !locationStatus ||
  !locationDialog ||
  !closeLocationDialogButton ||
  !locationSearchInput ||
  !locationSearchButton ||
  !locationSearchMessage ||
  !latitudeDisplay ||
  !longitudeDisplay ||
  !clearLocationButton ||
  !applyLocationButton
) {
  throw new Error(
    "評価画面に必要なHTML要素が見つかりません。"
  );
}

if (typeof L === "undefined") {
  throw new Error(
    "Leafletを読み込めませんでした。"
  );
}

/* ==================================
   初期化
================================== */

initializePage();

function initializePage() {
  createPrefectureOptions();
  setupCategoryButtons();
  setupRepeatControls();
  setupLocationControls();

  if (isEditMode) {
    initializeEditMode();
  } else {
    initializeNewMode();
  }

  updateEvaluation();
}

/* ==================================
   新規登録モード
================================== */

function initializeNewMode() {
  pageTitle.textContent =
    "評価追加";

  document.title =
    "評価追加 | Hotel Score Map";

  saveButton.textContent =
    "評価を保存";

  setDefaultDate();
}

/* ==================================
   編集モード
================================== */

function initializeEditMode() {
  const storedHotels =
    getStoredHotels();

  editingHotel =
    storedHotels.find(
      (hotel) =>
        hotel.id === editId
    );

  if (!editingHotel) {
    showEditDataError();
    return;
  }

  pageTitle.textContent =
    "評価編集";

  document.title =
    `${editingHotel.name || "評価"}を編集 | Hotel Score Map`;

  saveButton.textContent =
    "評価を更新";

  fillEditingHotelData(
    editingHotel
  );
}

function fillEditingHotelData(hotel) {
  hotelNameInput.value =
    hotel.name ?? "";

  prefectureSelect.value =
    hotel.prefecture ?? "";

  addressInput.value =
    hotel.address ?? "";

  stayDateInput.value =
    hotel.stayDate ?? "";

  const savedScores =
    hotel.scores ?? {};

  Object.keys(scores).forEach(
    (category) => {
      const value =
        savedScores[category];

      scores[category] =
        isValidScore(value)
          ? roundToThree(Number(value))
          : null;

      updateCategoryDisplay(
        category
      );
    }
  );

  setRepeatSelection(
    hotel.repeatType ?? "none"
  );

  const latitude =
    Number(hotel.latitude);

  const longitude =
    Number(hotel.longitude);

  if (
    isValidLatitude(latitude) &&
    isValidLongitude(longitude)
  ) {
    selectedLatitude =
      roundCoordinate(latitude);

    selectedLongitude =
      roundCoordinate(longitude);

    updateLocationStatus();
    updateCoordinateDisplay();
  } else {
    clearLocationValues();
  }
}

function showEditDataError() {
  pageTitle.textContent =
    "評価編集";

  saveButton.disabled = true;

  formMessage.style.color =
    "#d32f2f";

  formMessage.textContent =
    "編集するホテルデータが見つかりませんでした。";
}

/* ==================================
   都道府県選択肢
================================== */

function createPrefectureOptions() {
  prefectures.forEach(
    (prefecture) => {
      const option =
        document.createElement("option");

      option.value =
        prefecture.slug;

      option.textContent =
        prefecture.name;

      option.dataset.code =
        prefecture.code;

      prefectureSelect.appendChild(
        option
      );
    }
  );
}

prefectureSelect.addEventListener(
  "change",
  () => {
    const center =
      prefectureCenters[
        prefectureSelect.value
      ];

    if (
      locationMap &&
      center &&
      selectedLatitude === null
    ) {
      locationMap.setView(
        center,
        9
      );
    }
  }
);

/* ==================================
   宿泊日
================================== */

function setDefaultDate() {
  const today =
    new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      today.getDate()
    ).padStart(2, "0");

  stayDateInput.value =
    `${year}-${month}-${day}`;
}

/* ==================================
   評価項目
================================== */

function setupCategoryButtons() {
  categoryButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          const category =
            button.dataset.category;

          if (
            !category ||
            !(category in scores)
          ) {
            return;
          }

          openScoreDialog(
            category
          );
        }
      );
    }
  );
}

function openScoreDialog(category) {
  activeCategory =
    category;

  dialogTitle.textContent =
    categoryNames[category];

  const currentScore =
    scores[category];

  categoryScoreInput.value =
    currentScore === null
      ? ""
      : currentScore.toFixed(3);

  scoreDialog.showModal();

  window.setTimeout(
    () => {
      categoryScoreInput.focus();
      categoryScoreInput.select();
    },
    50
  );
}

applyScoreButton.addEventListener(
  "click",
  () => {
    if (!activeCategory) {
      return;
    }

    const inputValue =
      categoryScoreInput.value.trim();

    const score =
      Number(inputValue);

    if (
      inputValue === "" ||
      !isValidScore(score)
    ) {
      formMessage.style.color =
        "#d32f2f";

      formMessage.textContent =
        "評価は0.000から5.000の間で入力してください。";

      return;
    }

    scores[activeCategory] =
      roundToThree(score);

    updateCategoryDisplay(
      activeCategory
    );

    updateEvaluation();

    clearFormMessage();

    scoreDialog.close();
  }
);

clearScoreButton.addEventListener(
  "click",
  () => {
    if (!activeCategory) {
      return;
    }

    scores[activeCategory] =
      null;

    updateCategoryDisplay(
      activeCategory
    );

    updateEvaluation();

    clearFormMessage();

    scoreDialog.close();
  }
);

categoryScoreInput.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyScoreButton.click();
    }
  }
);

scoreDialog.addEventListener(
  "close",
  () => {
    activeCategory = null;
  }
);

function updateCategoryDisplay(
  category
) {
  const button =
    document.querySelector(
      `[data-category="${category}"]`
    );

  const valueElement =
    button?.querySelector(
      ".category-value"
    );

  if (!valueElement) {
    return;
  }

  const score =
    scores[category];

  valueElement.textContent =
    score === null
      ? "未評価"
      : score.toFixed(3);
}

/* ==================================
   リピートポイント
================================== */

function setupRepeatControls() {
  document
    .querySelectorAll(
      'input[name="repeatType"]'
    )
    .forEach(
      (input) => {
        input.addEventListener(
          "change",
          updateEvaluation
        );
      }
    );
}

function setRepeatSelection(type) {
  const radio =
    document.querySelector(
      `input[name="repeatType"][value="${type}"]`
    );

  if (radio) {
    radio.checked = true;
  } else {
    resetRepeatSelection();
  }
}

function updateRepeatEligibility(
  normalScore
) {
  const scoreValues =
    Object.values(scores);

  const allEvaluated =
    scoreValues.every(
      (score) =>
        score !== null
    );

  const allAtLeast4300 =
    allEvaluated &&
    scoreValues.every(
      (score) =>
        score >= 4.300
    );

  const canNormal =
    allAtLeast4300 &&
    normalScore !== null &&
    normalScore >= 4.500;

  const canIntense =
    allAtLeast4300 &&
    normalScore !== null &&
    normalScore >= 4.800;

  repeatNormal.disabled =
    !canNormal;

  repeatIntense.disabled =
    !canIntense;

  if (!allEvaluated) {
    resetRepeatSelection();

    repeatMessage.textContent =
      "6項目すべてを入力すると、自動判定します。";

    return;
  }

  if (!allAtLeast4300) {
    resetRepeatSelection();

    repeatMessage.textContent =
      "4.300未満の項目があるため、リピートポイントは付与できません。";

    return;
  }

  if (!canNormal) {
    resetRepeatSelection();

    repeatMessage.textContent =
      "通常評価が4.500未満のため、リピートポイントは付与できません。";

    return;
  }

  if (canIntense) {
    repeatMessage.textContent =
      "リピあり・激リピありを選択できます。";
  } else {
    repeatMessage.textContent =
      "リピありを選択できます。激リピありには通常評価4.800以上が必要です。";
  }

  const selectedType =
    getSelectedRepeatType();

  if (
    selectedType === "intense" &&
    !canIntense
  ) {
    resetRepeatSelection();
  }
}

function resetRepeatSelection() {
  const noneRadio =
    document.querySelector(
      'input[name="repeatType"][value="none"]'
    );

  if (noneRadio) {
    noneRadio.checked = true;
  }
}

function getSelectedRepeatType() {
  const selectedRadio =
    document.querySelector(
      'input[name="repeatType"]:checked'
    );

  return selectedRadio?.value ??
    "none";
}

function getRepeatPoint(type) {
  if (type === "normal") {
    return 0.050;
  }

  if (type === "intense") {
    return 0.100;
  }

  return 0;
}

/* ==================================
   総合評価
================================== */

function calculateNormalScore() {
  const values =
    Object.values(scores);

  const evaluatedValues =
    values.filter(
      (score) =>
        score !== null
    );

  if (
    evaluatedValues.length === 0
  ) {
    return null;
  }

  const total =
    evaluatedValues.reduce(
      (sum, score) =>
        sum + score,
      0
    );

  return total /
    evaluatedValues.length;
}

function updateEvaluation() {
  const normalScore =
    calculateNormalScore();

  updateRepeatEligibility(
    normalScore
  );

  if (normalScore === null) {
    totalScoreElement.textContent =
      "---";

    updateRankBadge(null);

    return;
  }

  const repeatType =
    getSelectedRepeatType();

  const repeatPoint =
    getRepeatPoint(
      repeatType
    );

  const finalScore =
    roundToThree(
      normalScore +
      repeatPoint
    );

  totalScoreElement.textContent =
    finalScore.toFixed(3);

  updateRankBadge(
    finalScore
  );
}

function getRank(score) {
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

function updateRankBadge(score) {
  rankBadge.className =
    "rank-badge";

  if (score === null) {
    rankBadge.classList.add(
      "rank-unset"
    );

    rankBadge.textContent =
      "未評価";

    return;
  }

  const rank =
    getRank(score);

  rankBadge.classList.add(
    `rank-${rank}`
  );

  if (score > 5.000) {
    rankBadge.textContent =
      "👑 殿堂入り";
  } else {
    rankBadge.textContent =
      `総合ランク${rank}`;
  }
}

/* ==================================
   位置設定
================================== */

function setupLocationControls() {
  openLocationDialogButton.addEventListener(
    "click",
    openLocationDialog
  );

  closeLocationDialogButton.addEventListener(
    "click",
    () => {
      locationDialog.close();
    }
  );

  locationSearchButton.addEventListener(
    "click",
    handleLocationSearch
  );

  locationSearchInput.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleLocationSearch();
      }
    }
  );

  clearLocationButton.addEventListener(
    "click",
    clearSelectedLocation
  );

  applyLocationButton.addEventListener(
    "click",
    applySelectedLocation
  );
}

function openLocationDialog() {
  locationSearchInput.value =
    [
      hotelNameInput.value.trim(),
      addressInput.value.trim()
    ]
      .filter(Boolean)
      .join(" ");

  locationDialog.showModal();

  window.setTimeout(
    () => {
      initializeLocationMap();

      locationMap.invalidateSize();

      if (
        selectedLatitude !== null &&
        selectedLongitude !== null
      ) {
        setLocationMarker(
          selectedLatitude,
          selectedLongitude,
          true
        );

        return;
      }

      const center =
        prefectureCenters[
          prefectureSelect.value
        ];

      if (center) {
        locationMap.setView(
          center,
          9
        );
      } else {
        locationMap.setView(
          [37.2, 137.2],
          5
        );
      }
    },
    100
  );
}

function initializeLocationMap() {
  if (locationMap) {
    return;
  }

  locationMap =
    L.map("locationMap", {
      center: [37.2, 137.2],
      zoom: 5,
      minZoom: 4,
      maxZoom: 19
    });

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
  ).addTo(locationMap);

  locationMap.on(
    "click",
    (event) => {
      setLocationMarker(
        event.latlng.lat,
        event.latlng.lng,
        false
      );
    }
  );
}

function handleLocationSearch() {
  const keyword =
    locationSearchInput.value.trim();

  if (keyword === "") {
    locationSearchMessage.textContent =
      "ホテル名または住所を入力してください。";

    return;
  }

  const center =
    prefectureCenters[
      prefectureSelect.value
    ];

  if (!center) {
    locationSearchMessage.textContent =
      "先に都道府県を選択してください。";

    return;
  }

  locationMap.setView(
    center,
    11
  );

  locationSearchMessage.textContent =
    "地図を拡大し、ホテルの位置をタップしてください。";
}

function setLocationMarker(
  latitude,
  longitude,
  moveMap
) {
  selectedLatitude =
    roundCoordinate(latitude);

  selectedLongitude =
    roundCoordinate(longitude);

  if (!locationMarker) {
    locationMarker =
      L.marker(
        [
          selectedLatitude,
          selectedLongitude
        ],
        {
          draggable: true
        }
      ).addTo(locationMap);

    locationMarker.on(
      "dragend",
      () => {
        const position =
          locationMarker.getLatLng();

        selectedLatitude =
          roundCoordinate(
            position.lat
          );

        selectedLongitude =
          roundCoordinate(
            position.lng
          );

        updateCoordinateDisplay();
      }
    );
  } else {
    locationMarker.setLatLng(
      [
        selectedLatitude,
        selectedLongitude
      ]
    );
  }

  if (moveMap) {
    locationMap.setView(
      [
        selectedLatitude,
        selectedLongitude
      ],
      15
    );
  }

  updateCoordinateDisplay();

  locationSearchMessage.textContent =
    "ピンをドラッグして位置を微調整できます。";
}

function clearSelectedLocation() {
  clearLocationValues();

  if (
    locationMap &&
    locationMarker
  ) {
    locationMap.removeLayer(
      locationMarker
    );

    locationMarker = null;
  }

  updateCoordinateDisplay();
  updateLocationStatus();

  locationSearchMessage.textContent =
    "位置を解除しました。";
}

function clearLocationValues() {
  selectedLatitude = null;
  selectedLongitude = null;
}

function applySelectedLocation() {
  if (
    selectedLatitude === null ||
    selectedLongitude === null
  ) {
    locationSearchMessage.textContent =
      "地図をタップして位置を設定してください。";

    return;
  }

  updateLocationStatus();

  locationDialog.close();
}

function updateCoordinateDisplay() {
  latitudeDisplay.textContent =
    selectedLatitude === null
      ? "未設定"
      : selectedLatitude.toFixed(6);

  longitudeDisplay.textContent =
    selectedLongitude === null
      ? "未設定"
      : selectedLongitude.toFixed(6);
}

function updateLocationStatus() {
  if (
    selectedLatitude === null ||
    selectedLongitude === null
  ) {
    locationStatus.className =
      "location-status location-unset";

    locationStatus.textContent =
      "位置未設定";

    return;
  }

  locationStatus.className =
    "location-status location-set";

  locationStatus.textContent =
    `位置設定済み（${selectedLatitude.toFixed(5)}, ${selectedLongitude.toFixed(5)}）`;
}

/* ==================================
   保存
================================== */

hotelForm.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    clearFormMessage();

    const validationMessage =
      validateForm();

    if (validationMessage) {
      showFormError(
        validationMessage
      );

      return;
    }

    const selectedPrefecture =
      prefectures.find(
        (prefecture) =>
          prefecture.slug ===
          prefectureSelect.value
      );

    if (!selectedPrefecture) {
      showFormError(
        "都道府県を選択してください。"
      );

      return;
    }

    const normalScore =
      calculateNormalScore();

    if (normalScore === null) {
      showFormError(
        "評価を入力してください。"
      );

      return;
    }

    const repeatType =
      getSelectedRepeatType();

    const repeatPoint =
      getRepeatPoint(
        repeatType
      );

    const finalScore =
      roundToThree(
        normalScore +
        repeatPoint
      );

    const hotelData =
      createHotelData({
        selectedPrefecture,
        normalScore,
        repeatType,
        repeatPoint,
        finalScore
      });

    try {
      if (isEditMode) {
        updateStoredHotel(
          hotelData
        );

        showFormSuccess(
          "評価を更新しました。"
        );

        window.setTimeout(
          () => {
            window.location.href =
              `hotel.html?id=${encodeURIComponent(hotelData.id)}`;
          },
          600
        );
      } else {
        addStoredHotel(
          hotelData
        );

        showFormSuccess(
          "評価を保存しました。"
        );

        window.setTimeout(
          () => {
            const query =
              new URLSearchParams({
                code:
                  selectedPrefecture.code,

                pref:
                  selectedPrefecture.slug,

                name:
                  selectedPrefecture.name
              });

            window.location.href =
              `prefecture.html?${query.toString()}`;
          },
          600
        );
      }
    } catch (error) {
      console.error(error);

      showFormError(
        "保存中にエラーが発生しました。"
      );
    }
  }
);

function createHotelData({
  selectedPrefecture,
  normalScore,
  repeatType,
  repeatPoint,
  finalScore
}) {
  const now =
    new Date().toISOString();

  return {
    id:
      isEditMode
        ? editingHotel.id
        : createHotelId(),

    name:
      hotelNameInput.value.trim(),

    prefectureCode:
      selectedPrefecture.code,

    prefecture:
      selectedPrefecture.slug,

    prefectureName:
      selectedPrefecture.name,

    address:
      addressInput.value.trim(),

    latitude:
      selectedLatitude,

    longitude:
      selectedLongitude,

    stayDate:
      stayDateInput.value,

    scores: {
      ...scores
    },

    normalScore:
      roundToThree(
        normalScore
      ),

    repeatType,

    repeatPoint,

    finalScore,

    rank:
      getRank(finalScore),

    hallOfFame:
      finalScore > 5.000,

    createdAt:
      isEditMode
        ? editingHotel.createdAt ??
          now
        : now,

    updatedAt:
      now
  };
}

function validateForm() {
  if (
    hotelNameInput.value.trim() === ""
  ) {
    return "ホテル・旅館名を入力してください。";
  }

  if (
    prefectureSelect.value === ""
  ) {
    return "都道府県を選択してください。";
  }

  if (
    stayDateInput.value === ""
  ) {
    return "宿泊日を入力してください。";
  }

  const allScoresEntered =
    Object.values(scores).every(
      (score) =>
        score !== null
    );

  if (!allScoresEntered) {
    return "6つの評価項目をすべて入力してください。";
  }

  if (
    selectedLatitude === null ||
    selectedLongitude === null
  ) {
    return "地図上の位置を設定してください。";
  }

  return "";
}

/* ==================================
   localStorage
================================== */

function addStoredHotel(hotelData) {
  const hotels =
    getStoredHotels();

  hotels.push(
    hotelData
  );

  saveStoredHotels(
    hotels
  );
}

function updateStoredHotel(
  hotelData
) {
  const hotels =
    getStoredHotels();

  const hotelIndex =
    hotels.findIndex(
      (hotel) =>
        hotel.id === editId
    );

  if (hotelIndex === -1) {
    throw new Error(
      "更新するホテルが見つかりません。"
    );
  }

  hotels[hotelIndex] =
    hotelData;

  saveStoredHotels(
    hotels
  );
}

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

    return [];
  }
}

function saveStoredHotels(hotels) {
  localStorage.setItem(
    "hotelScoreMap.hotels",
    JSON.stringify(hotels)
  );
}

/* ==================================
   ID作成
================================== */

function createHotelId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }

  return `hotel-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

/* ==================================
   メッセージ
================================== */

function clearFormMessage() {
  formMessage.textContent = "";
  formMessage.style.color = "";
}

function showFormError(message) {
  formMessage.style.color =
    "#d32f2f";

  formMessage.textContent =
    message;
}

function showFormSuccess(message) {
  formMessage.style.color =
    "#2e7d32";

  formMessage.textContent =
    message;
}

/* ==================================
   数値確認
================================== */

function isValidScore(value) {
  const number =
    Number(value);

  return (
    Number.isFinite(number) &&
    number >= 0 &&
    number <= 5
  );
}

function isValidLatitude(value) {
  return (
    Number.isFinite(value) &&
    value >= -90 &&
    value <= 90
  );
}

function isValidLongitude(value) {
  return (
    Number.isFinite(value) &&
    value >= -180 &&
    value <= 180
  );
}

function roundToThree(value) {
  return Math.round(
    (Number(value) +
      Number.EPSILON) *
      1000
  ) / 1000;
}

function roundCoordinate(value) {
  return Math.round(
    Number(value) *
      1000000
  ) / 1000000;
}