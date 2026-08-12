"use strict";

/* ==================================
   国・地域データ
================================== */

const countries = {
  JP: "日本",
  AU: "オーストラリア",
  US: "アメリカ",
  KR: "韓国",
  TW: "台湾",
  HK: "香港",
  SG: "シンガポール",
  TH: "タイ",
  GB: "イギリス",
  FR: "フランス"
};


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
   評価データ
================================== */

const categoryNames = {
  room: "客室・アメニティ",
  size: "広さ",
  service: "接客・サービス",
  bath: "バス・お風呂",
  facility: "施設・設備",
  meal: "お食事",
  satisfaction: "満足度"
};

const scores = {
  room: null,
  size: null,
  service: null,
  bath: null,
  facility: null,
  meal: null,
  satisfaction: null
};

const scoreWeights = {
  room: 2,
  size: 0.25,
  service: 2,
  bath: 2,
  facility: 1,
  meal: 2,
  satisfaction: 3
};


/* ==================================
   広さ
================================== */

function createDefaultSizeDetails() {
  return {
    roomType: "western",
    score: 3
  };
}

let sizeDetails = null;
let sizeDraft = createDefaultSizeDetails();


/* ==================================
   お食事
================================== */

let mealExcluded = false;
let mealDraftExcluded = false;
let mealDraftScore = null;

let activeCategory = null;


/* ==================================
   編集モード
================================== */

const pageParams = new URLSearchParams(
  window.location.search
);

const editId = pageParams.get("edit");
const isEditMode = Boolean(editId);

let editingHotel = null;


/* ==================================
   地図
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

const countrySelect =
  document.getElementById("countrySelect");

const prefectureRow =
  document.getElementById("prefectureRow");

const prefectureSelect =
  document.getElementById("prefecture");

const foreignRegionRow =
  document.getElementById("foreignRegionRow");

const foreignRegionInput =
  document.getElementById("foreignRegion");

const customCountryRow =
  document.getElementById("customCountryRow");

const customCountryInput =
  document.getElementById("customCountry");

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


/* ==================================
   通常評価
================================== */

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


/* ==================================
   広さ
================================== */

const sizeDialog =
  document.getElementById("sizeDialog");

const closeSizeDialogButton =
  document.getElementById("closeSizeDialogButton");

const cancelSizeButton =
  document.getElementById("cancelSizeButton");

const clearSizeButton =
  document.getElementById("clearSizeButton");

const applySizeButton =
  document.getElementById("applySizeButton");

const roomTypeInputs =
  document.querySelectorAll('input[name="roomType"]');

const westernSizeInputs =
  document.querySelectorAll('input[name="westernSize"]');

const japaneseSizeInputs =
  document.querySelectorAll('input[name="japaneseSize"]');

const westernSizeOptions =
  document.getElementById("westernSizeOptions");

const japaneseSizeOptions =
  document.getElementById("japaneseSizeOptions");

const sizeTypeMessage =
  document.getElementById("sizeTypeMessage");

const sizeScoreDisplay =
  document.getElementById("sizeScoreDisplay");

const sizeTotalScore =
  document.getElementById("sizeTotalScore");


/* ==================================
   食事
================================== */

const mealDialog =
  document.getElementById("mealDialog");

const closeMealDialogButton =
  document.getElementById("closeMealDialogButton");

const mealNoneCheckbox =
  document.getElementById("mealNoneCheckbox");

const mealScoreInputArea =
  document.getElementById("mealScoreInputArea");

const mealScoreInput =
  document.getElementById("mealScoreInput");

const cancelMealButton =
  document.getElementById("cancelMealButton");

const clearMealButton =
  document.getElementById("clearMealButton");

const applyMealButton =
  document.getElementById("applyMealButton");


/* ==================================
   現在地・地図
================================== */

const currentLocationButton =
  document.getElementById("currentLocationButton");

const currentLocationStatus =
  document.getElementById("currentLocationStatus");

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


/* ==================================
   初期化
================================== */

initializePage();

function initializePage() {
  createPrefectureOptions();

  setupCountrySelect();
  setupCategoryButtons();
  setupGenericScoreDialog();
  setupSizeDialog();
  setupMealDialog();
  setupRepeatControls();
  setupCurrentLocationControls();
  setupLocationControls();

  if (isEditMode) {
    initializeEditMode();
  } else {
    initializeNewMode();
  }

  updateAllCategoryDisplays();
  updateEvaluation();
}


/* ==================================
   新規登録
================================== */

function initializeNewMode() {
  pageTitle.textContent = "評価追加";

  document.title =
    "評価追加 | Hotel Score Map";

  saveButton.textContent = "評価を保存";

  countrySelect.value = "JP";

  updateCountryFields();
  setDefaultDate();

  updateLocationStatus();
  updateCoordinateDisplay();
  updateCurrentLocationStatus();
}


/* ==================================
   編集
================================== */

function initializeEditMode() {
  const storedHotels = getStoredHotels();

  editingHotel = storedHotels.find(
    (hotel) => hotel.id === editId
  );

  if (!editingHotel) {
    pageTitle.textContent = "評価編集";
    saveButton.disabled = true;

    showFormError(
      "編集するホテルデータが見つかりませんでした。"
    );

    return;
  }

  pageTitle.textContent = "評価編集";

  document.title =
    "評価編集 | Hotel Score Map";

  saveButton.textContent = "評価を更新";

  fillEditingHotelData(editingHotel);
}


function fillEditingHotelData(hotel) {
  hotelNameInput.value = hotel.name ?? "";

  let countryCode = hotel.countryCode;

  /*
    以前の日本国内データとの互換性
  */
  if (!countryCode) {
    countryCode =
      hotel.prefecture ? "JP" : "OTHER";
  }

  if (
    countryCode === "OTHER" ||
    countries[countryCode]
  ) {
    countrySelect.value = countryCode;
  } else {
    countrySelect.value = "OTHER";
  }

  updateCountryFields();

  if (isJapan()) {
    prefectureSelect.value =
      hotel.prefecture ?? "";
  } else {
    foreignRegionInput.value =
      hotel.region ?? "";
  }

  if (isCustomCountry()) {
    customCountryInput.value =
      hotel.countryName ?? "";
  }

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
          ? roundToThree(value)
          : null;
    }
  );

  if (
    scores.size === null &&
    isValidScore(hotel.sizeScore)
  ) {
    scores.size =
      roundToThree(hotel.sizeScore);
  }

  if (
    hotel.sizeDetails &&
    typeof hotel.sizeDetails === "object"
  ) {
    sizeDetails =
      normalizeSizeDetails(
        hotel.sizeDetails
      );

    scores.size =
      sizeDetails.score;
  } else if (
    scores.size !== null
  ) {
    sizeDetails = {
      roomType:
        hotel.roomType ?? "western",
      score:
        scores.size
    };
  }

  mealExcluded =
    hotel.mealExcluded === true;

  if (mealExcluded) {
    scores.meal = null;
  }

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
  }

  updateLocationStatus();
  updateCoordinateDisplay();
  updateCurrentLocationStatus();
}


/* ==================================
   国・地域
================================== */

function setupCountrySelect() {
  countrySelect.addEventListener(
    "change",
    updateCountryFields
  );
}


function isJapan() {
  return countrySelect.value === "JP";
}


function isCustomCountry() {
  return countrySelect.value === "OTHER";
}


function updateCountryFields() {
  const japan = isJapan();
  const custom = isCustomCountry();

  /*
    日本なら都道府県
  */
  prefectureRow.hidden = !japan;

  /*
    海外なら州・地域
  */
  foreignRegionRow.hidden = japan;

  /*
    その他の場合だけ国名を自由入力
  */
  customCountryRow.hidden = !custom;

  prefectureSelect.required = japan;
  customCountryInput.required = custom;

  if (japan) {
    foreignRegionInput.required = false;
  } else {
    foreignRegionInput.required = false;
  }

  /*
    まだ位置を決めていない場合のみ
    地図の表示位置も変更
  */
  if (
    locationMap &&
    selectedLatitude === null
  ) {
    if (japan) {
      const center =
        prefectureCenters[
          prefectureSelect.value
        ];

      locationMap.setView(
        center ?? [37.2, 137.2],
        center ? 9 : 5
      );
    } else {
      locationMap.setView(
        [20, 0],
        2
      );
    }
  }
}


function getSelectedCountryName() {
  if (isCustomCountry()) {
    return customCountryInput
      .value
      .trim();
  }

  return countries[
    countrySelect.value
  ] ?? "";
}


/* ==================================
   都道府県
================================== */

function createPrefectureOptions() {
  prefectures.forEach(
    (prefecture) => {
      const option =
        document.createElement(
          "option"
        );

      option.value =
        prefecture.slug;

      option.textContent =
        prefecture.name;

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
   日付
================================== */

function setDefaultDate() {
  const today = new Date();

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
   評価ボタン
================================== */

function setupCategoryButtons() {
  categoryButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          const category =
            button.dataset.category;

          if (category === "size") {
            openSizeDialog();
            return;
          }

          if (category === "meal") {
            openMealDialog();
            return;
          }

          openGenericScoreDialog(
            category
          );
        }
      );
    }
  );
}


/* ==================================
   評価表示
================================== */

function updateAllCategoryDisplays() {
  Object.keys(scores).forEach(
    updateCategoryDisplay
  );
}


function updateCategoryDisplay(category) {
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

  if (
    category === "meal" &&
    mealExcluded
  ) {
    valueElement.textContent =
      "食事なし";

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
   通常評価ダイアログ
================================== */

function setupGenericScoreDialog() {
  applyScoreButton.addEventListener(
    "click",
    applyGenericScore
  );

  clearScoreButton.addEventListener(
    "click",
    clearGenericScore
  );
}


function openGenericScoreDialog(category) {
  activeCategory = category;

  dialogTitle.textContent =
    categoryNames[category];

  categoryScoreInput.value =
    scores[category] === null
      ? ""
      : scores[category].toFixed(3);

  scoreDialog.showModal();
}


function applyGenericScore() {
  const value =
    Number(categoryScoreInput.value);

  if (!isValidScore(value)) {
    showFormError(
      "評価は0.000から5.000の間で入力してください。"
    );
    return;
  }

  scores[activeCategory] =
    roundToThree(value);

  updateCategoryDisplay(
    activeCategory
  );

  updateEvaluation();

  scoreDialog.close();
}


function clearGenericScore() {
  scores[activeCategory] = null;

  updateCategoryDisplay(
    activeCategory
  );

  updateEvaluation();

  scoreDialog.close();
}


/* ==================================
   広さ
================================== */

function normalizeSizeDetails(source) {
  return {
    roomType:
      source.roomType ?? "western",

    score:
      isValidScore(source.score)
        ? roundToThree(source.score)
        : 3
  };
}


function copySizeDetails(source) {
  return {
    roomType: source.roomType,
    score: source.score
  };
}


function setupSizeDialog() {
  roomTypeInputs.forEach(
    (input) => {
      input.addEventListener(
        "change",
        () => {
          sizeDraft.roomType =
            input.value;

          updateSizeDialogDisplay();
        }
      );
    }
  );

  [
    ...westernSizeInputs,
    ...japaneseSizeInputs
  ].forEach(
    (input) => {
      input.addEventListener(
        "change",
        () => {
          sizeDraft.score =
            Number(input.value);

          updateSizeDialogDisplay();
        }
      );
    }
  );

  closeSizeDialogButton.addEventListener(
    "click",
    () => sizeDialog.close()
  );

  cancelSizeButton.addEventListener(
    "click",
    () => sizeDialog.close()
  );

  clearSizeButton.addEventListener(
    "click",
    clearSizeScore
  );

  applySizeButton.addEventListener(
    "click",
    applySizeScore
  );
}


function openSizeDialog() {
  sizeDraft =
    sizeDetails
      ? copySizeDetails(sizeDetails)
      : createDefaultSizeDetails();

  updateSizeDialogDisplay();

  sizeDialog.showModal();
}


function clearSizeScore() {
  sizeDetails = null;
  scores.size = null;

  updateCategoryDisplay("size");
  updateEvaluation();

  sizeDialog.close();
}


function applySizeScore() {
  sizeDetails =
    copySizeDetails(sizeDraft);

  scores.size =
    roundToThree(
      sizeDetails.score
    );

  updateCategoryDisplay("size");
  updateEvaluation();

  sizeDialog.close();
}


function updateSizeDialogDisplay() {
  roomTypeInputs.forEach(
    (input) => {
      input.checked =
        input.value ===
        sizeDraft.roomType;
    }
  );

  /*
    和室のみなら畳、
    洋室・和洋室なら㎡
  */
  const japanese =
    sizeDraft.roomType ===
    "japanese";

  westernSizeOptions.hidden =
    japanese;

  japaneseSizeOptions.hidden =
    !japanese;

  if (sizeDraft.roomType === "japanese") {
    sizeTypeMessage.textContent =
      "和室の広さを選択";
  } else if (
    sizeDraft.roomType === "mixed"
  ) {
    sizeTypeMessage.textContent =
      "和洋室の広さを㎡で選択";
  } else {
    sizeTypeMessage.textContent =
      "洋室の広さを選択";
  }

  const targetInputs =
    japanese
      ? japaneseSizeInputs
      : westernSizeInputs;

  targetInputs.forEach(
    (input) => {
      input.checked =
        Number(input.value) ===
        Number(sizeDraft.score);
    }
  );

  sizeScoreDisplay.textContent =
    Number(sizeDraft.score).toFixed(3);

  sizeTotalScore.textContent =
    Number(sizeDraft.score).toFixed(3);
}


/* ==================================
   食事
================================== */

function setupMealDialog() {
  mealNoneCheckbox.addEventListener(
    "change",
    () => {
      mealDraftExcluded =
        mealNoneCheckbox.checked;

      updateMealDialogDisplay();
    }
  );

  closeMealDialogButton.addEventListener(
    "click",
    () => mealDialog.close()
  );

  cancelMealButton.addEventListener(
    "click",
    () => mealDialog.close()
  );

  clearMealButton.addEventListener(
    "click",
    clearMealScore
  );

  applyMealButton.addEventListener(
    "click",
    applyMealScore
  );
}


function openMealDialog() {
  mealDraftExcluded =
    mealExcluded;

  mealDraftScore =
    scores.meal;

  mealNoneCheckbox.checked =
    mealDraftExcluded;

  mealScoreInput.value =
    mealDraftScore === null
      ? ""
      : mealDraftScore.toFixed(3);

  updateMealDialogDisplay();

  mealDialog.showModal();
}


function clearMealScore() {
  mealExcluded = false;
  scores.meal = null;

  updateCategoryDisplay("meal");
  updateEvaluation();

  mealDialog.close();
}


function applyMealScore() {
  if (mealDraftExcluded) {
    mealExcluded = true;
    scores.meal = null;

    updateCategoryDisplay("meal");
    updateEvaluation();

    mealDialog.close();
    return;
  }

  const value =
    Number(mealScoreInput.value);

  if (!isValidScore(value)) {
    showFormError(
      "お食事の評価は0.000から5.000の間で入力してください。"
    );
    return;
  }

  mealExcluded = false;

  scores.meal =
    roundToThree(value);

  updateCategoryDisplay("meal");
  updateEvaluation();

  mealDialog.close();
}


function updateMealDialogDisplay() {
  mealScoreInput.disabled =
    mealDraftExcluded;

  mealScoreInputArea.classList.toggle(
    "disabled",
    mealDraftExcluded
  );
}


/* ==================================
   総合評価
================================== */

function calculateNormalScore() {
  let total = 0;
  let weightTotal = 0;

  Object.entries(scores).forEach(
    ([category, score]) => {
      if (score === null) {
        return;
      }

      if (
        category === "meal" &&
        mealExcluded
      ) {
        return;
      }

      const weight =
        scoreWeights[category];

      total += score * weight;
      weightTotal += weight;
    }
  );

  if (weightTotal === 0) {
    return null;
  }

  return roundToThree(
    total / weightTotal
  );
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

  const finalScore =
    roundToThree(
      normalScore +
      getRepeatPoint(repeatType)
    );

  totalScoreElement.textContent =
    finalScore.toFixed(3);

  updateRankBadge(finalScore);
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


function getSelectedRepeatType() {
  return (
    document.querySelector(
      'input[name="repeatType"]:checked'
    )?.value ?? "none"
  );
}


function setRepeatSelection(type) {
  const input =
    document.querySelector(
      `input[name="repeatType"][value="${type}"]`
    );

  if (input) {
    input.checked = true;
  }
}


function resetRepeatSelection() {
  setRepeatSelection("none");
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


function updateRepeatEligibility(
  normalScore
) {
  const requiredCategories = [
    "room",
    "size",
    "service",
    "bath",
    "facility",
    "satisfaction"
  ];

  const complete =
    requiredCategories.every(
      (category) =>
        scores[category] !== null
    );

  if (!complete) {
    repeatNormal.disabled = true;
    repeatIntense.disabled = true;

    repeatMessage.textContent =
      "評価を入力すると、付与可能か自動判定します。";

    resetRepeatSelection();

    return;
  }

  const checkCategories = [
    "room",
    "service",
    "bath",
    "facility",
    "satisfaction"
  ];

  if (!mealExcluded) {
    if (scores.meal === null) {
      repeatNormal.disabled = true;
      repeatIntense.disabled = true;

      repeatMessage.textContent =
        "お食事の評価を入力してください。";

      resetRepeatSelection();

      return;
    }

    checkCategories.push("meal");
  }

  const all4300 =
    checkCategories.every(
      (category) =>
        scores[category] !== null &&
        scores[category] >= 4.300
    );

  const canNormal =
    all4300 &&
    normalScore >= 4.500;

  const canIntense =
    all4300 &&
    normalScore >= 4.800;

  repeatNormal.disabled =
    !canNormal;

  repeatIntense.disabled =
    !canIntense;

  if (canIntense) {
    repeatMessage.textContent =
      "激リピあり（＋0.100）を付与できます。";
  } else if (canNormal) {
    repeatMessage.textContent =
      "リピあり（＋0.050）を付与できます。";
  } else {
    repeatMessage.textContent =
      "リピートポイントの付与条件を満たしていません。";
  }

  const selected =
    getSelectedRepeatType();

  if (
    selected === "intense" &&
    !canIntense
  ) {
    resetRepeatSelection();
  }

  if (
    selected === "normal" &&
    !canNormal
  ) {
    resetRepeatSelection();
  }
}


/* ==================================
   ランク
================================== */

function getRank(score) {
  if (score >= 4.800) return 1;
  if (score >= 4.500) return 2;
  if (score >= 4.000) return 3;
  if (score >= 3.000) return 4;
  if (score >= 2.000) return 5;

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

  rankBadge.textContent =
    score > 5.000
      ? "👑 殿堂入り"
      : `総合ランク${rank}`;
}


/* ==================================
   現在地
================================== */

function setupCurrentLocationControls() {
  currentLocationButton.addEventListener(
    "click",
    getCurrentLocation
  );
}


function getCurrentLocation() {
  if (!navigator.geolocation) {
    currentLocationStatus.textContent =
      "この端末では現在地を取得できません。";

    return;
  }

  currentLocationButton.disabled = true;

  currentLocationStatus.textContent =
    "現在地を取得しています…";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      selectedLatitude =
        roundCoordinate(
          position.coords.latitude
        );

      selectedLongitude =
        roundCoordinate(
          position.coords.longitude
        );

      currentLocationButton.disabled =
        false;

      currentLocationStatus.textContent =
        "現在地を取得しました";

      currentLocationStatus.className =
        "location-status location-set";

      updateLocationStatus();
      updateCoordinateDisplay();

      if (locationMap) {
        setLocationMarker(
          selectedLatitude,
          selectedLongitude,
          true
        );
      }
    },

    (error) => {
      currentLocationButton.disabled =
        false;

      if (
        error.code ===
        error.PERMISSION_DENIED
      ) {
        currentLocationStatus.textContent =
          "位置情報の使用が許可されていません。";
      } else if (
        error.code ===
        error.TIMEOUT
      ) {
        currentLocationStatus.textContent =
          "現在地の取得がタイムアウトしました。";
      } else {
        currentLocationStatus.textContent =
          "現在地の取得に失敗しました。";
      }

      currentLocationStatus.className =
        "location-status location-unset";
    },

    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }
  );
}


function updateCurrentLocationStatus() {
  if (selectedLatitude === null) {
    currentLocationStatus.textContent =
      "現在地未取得";

    currentLocationStatus.className =
      "location-status location-unset";
  }
}


/* ==================================
   地図
================================== */

function setupLocationControls() {
  openLocationDialogButton.addEventListener(
    "click",
    openLocationDialog
  );

  closeLocationDialogButton.addEventListener(
    "click",
    () => locationDialog.close()
  );

  clearLocationButton.addEventListener(
    "click",
    clearSelectedLocation
  );

  applyLocationButton.addEventListener(
    "click",
    applySelectedLocation
  );

  /*
    検索欄は残してあるが、
    外部住所検索APIは使わない。
    入力内容に応じて都道府県中心へ移動する。
  */
  locationSearchButton.addEventListener(
    "click",
    searchLocationLocally
  );

  locationSearchInput.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        searchLocationLocally();
      }
    }
  );
}


function openLocationDialog() {
  locationSearchMessage.textContent = "";

  locationDialog.showModal();

  setTimeout(
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

      if (isJapan()) {
        const center =
          prefectureCenters[
            prefectureSelect.value
          ];

        locationMap.setView(
          center ?? [37.2, 137.2],
          center ? 9 : 5
        );
      } else {
        locationMap.setView(
          [20, 0],
          2
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

  locationMap = L.map(
    "locationMap",
    {
      center: [37.2, 137.2],
      zoom: 5,
      minZoom: 2,
      maxZoom: 19
    }
  );

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        "&copy; OpenStreetMap contributors"
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
    locationMarker = L.marker(
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
}


function clearSelectedLocation() {
  selectedLatitude = null;
  selectedLongitude = null;

  if (
    locationMarker &&
    locationMap
  ) {
    locationMap.removeLayer(
      locationMarker
    );

    locationMarker = null;
  }

  updateCoordinateDisplay();
  updateLocationStatus();

  currentLocationStatus.textContent =
    "現在地未取得";

  currentLocationStatus.className =
    "location-status location-unset";
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
    locationStatus.textContent =
      "位置未設定";

    locationStatus.className =
      "location-status location-unset";

    return;
  }

  locationStatus.textContent =
    `位置設定済み（${selectedLatitude.toFixed(5)}, ${selectedLongitude.toFixed(5)}）`;

  locationStatus.className =
    "location-status location-set";
}


/* ==================================
   地図内の簡易検索
================================== */

function searchLocationLocally() {
  const query =
    locationSearchInput.value
      .trim();

  if (query === "") {
    locationSearchMessage.textContent =
      "検索する地域を入力してください。";

    return;
  }

  /*
    日本なら入力文字列から都道府県を探す
  */
  const prefecture =
    prefectures.find(
      (item) =>
        query.includes(item.name)
    );

  if (prefecture) {
    const center =
      prefectureCenters[
        prefecture.slug
      ];

    locationMap.setView(
      center,
      10
    );

    locationSearchMessage.textContent =
      `${prefecture.name}付近を表示しました。地図上で正確な位置を指定してください。`;

    return;
  }

  /*
    選択済み都道府県がある場合
  */
  if (
    isJapan() &&
    prefectureSelect.value
  ) {
    const selectedPrefecture =
      prefectures.find(
        (item) =>
          item.slug ===
          prefectureSelect.value
      );

    const center =
      prefectureCenters[
        prefectureSelect.value
      ];

    if (center) {
      locationMap.setView(
        center,
        10
      );

      locationSearchMessage.textContent =
        `${selectedPrefecture.name}付近を表示しました。地図上で位置を指定してください。`;

      return;
    }
  }

  locationSearchMessage.textContent =
    "この検索欄では住所の自動検索は行いません。地図を動かして位置を指定してください。";
}


/* ==================================
   保存
================================== */

hotelForm.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    clearFormError();

    const message =
      validateForm();

    if (message) {
      showFormError(message);
      return;
    }

    const selectedPrefecture =
      isJapan()
        ? prefectures.find(
            (prefecture) =>
              prefecture.slug ===
              prefectureSelect.value
          )
        : null;

    const normalScore =
      calculateNormalScore();

    const repeatType =
      getSelectedRepeatType();

    const repeatPoint =
      getRepeatPoint(repeatType);

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

    if (isEditMode) {
      updateStoredHotel(hotelData);

      window.location.href =
        `hotel.html?id=${encodeURIComponent(
          hotelData.id
        )}`;

      return;
    }

    addStoredHotel(hotelData);

    /*
      日本なら従来どおり都道府県画面へ
  */
    if (
      isJapan() &&
      selectedPrefecture
    ) {
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

      return;
    }

    /*
      海外は全ホテル一覧へ
  */
    window.location.href =
      "list.html";
  }
);


/* ==================================
   入力チェック
================================== */

function validateForm() {
  if (
    hotelNameInput.value.trim() === ""
  ) {
    return "ホテル・旅館名を入力してください。";
  }

  if (
    isJapan() &&
    prefectureSelect.value === ""
  ) {
    return "都道府県を選択してください。";
  }

  if (
    isCustomCountry() &&
    customCountryInput.value
      .trim() === ""
  ) {
    return "国・地域名を入力してください。";
  }

  if (
    stayDateInput.value === ""
  ) {
    return "宿泊日を入力してください。";
  }

  const requiredCategories = [
    "room",
    "size",
    "service",
    "bath",
    "facility",
    "satisfaction"
  ];

  if (
    requiredCategories.some(
      (category) =>
        scores[category] === null
    )
  ) {
    return "お食事以外の6項目を入力してください。";
  }

  if (
    !mealExcluded &&
    scores.meal === null
  ) {
    return "お食事を評価するか、「食事なし」を選択してください。";
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
   保存データ作成
================================== */

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

    countryCode:
      countrySelect.value,

    countryName:
      getSelectedCountryName(),

    region:
      isJapan()
        ? selectedPrefecture?.name ?? ""
        : foreignRegionInput.value.trim(),

    prefectureCode:
      isJapan()
        ? selectedPrefecture?.code ?? ""
        : "",

    prefecture:
      isJapan()
        ? selectedPrefecture?.slug ?? ""
        : "",

    prefectureName:
      isJapan()
        ? selectedPrefecture?.name ?? ""
        : "",

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

    scoreWeights: {
      ...scoreWeights
    },

    sizeDetails:
      sizeDetails
        ? { ...sizeDetails }
        : null,

    roomType:
      sizeDetails?.roomType ?? null,

    sizeScore:
      scores.size,

    mealExcluded,

    normalScore,

    repeatType,

    repeatPoint,

    finalScore,

    rank:
      getRank(finalScore),

    hallOfFame:
      finalScore > 5.000,

    createdAt:
      isEditMode
        ? editingHotel.createdAt ?? now
        : now,

    updatedAt:
      now
  };
}


/* ==================================
   localStorage
================================== */

function getStoredHotels() {
  try {
    const data =
      JSON.parse(
        localStorage.getItem(
          "hotelScoreMap.hotels"
        )
      );

    return Array.isArray(data)
      ? data
      : [];
  } catch {
    return [];
  }
}


function saveStoredHotels(hotels) {
  localStorage.setItem(
    "hotelScoreMap.hotels",
    JSON.stringify(hotels)
  );
}


function addStoredHotel(hotel) {
  const hotels =
    getStoredHotels();

  hotels.push(hotel);

  saveStoredHotels(hotels);
}


function updateStoredHotel(hotel) {
  const hotels =
    getStoredHotels();

  const index =
    hotels.findIndex(
      (item) =>
        item.id === editId
    );

  if (index === -1) {
    return;
  }

  hotels[index] = hotel;

  saveStoredHotels(hotels);
}


/* ==================================
   共通
================================== */

function createHotelId() {
  if (
    window.crypto &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }

  return (
    `hotel-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`
  );
}


function showFormError(message) {
  formMessage.textContent =
    message;

  formMessage.style.color =
    "#d32f2f";
}


function clearFormError() {
  formMessage.textContent = "";
}


function isValidScore(value) {
  if (
    value === null ||
    value === "" ||
    typeof value === "undefined"
  ) {
    return false;
  }

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
  return (
    Math.round(
      Number(value) * 1000
    ) / 1000
  );
}


function roundCoordinate(value) {
  return (
    Math.round(
      Number(value) * 1000000
    ) / 1000000
  );
}