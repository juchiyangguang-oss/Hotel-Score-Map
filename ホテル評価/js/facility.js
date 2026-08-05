"use strict";

/* ==================================
   Hotel Score Map
   施設・設備評価
================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ==================================
     保存キー
  ================================== */

  const STORAGE_KEY =
    "hotelScoreMapDraft";

  /* ==================================
     共通要素
  ================================== */

  const backButton =
    document.getElementById("backButton");

  const facilityTotalScore =
    document.getElementById(
      "facilityTotalScore"
    );

  const message =
    document.getElementById(
      "facilityFormMessage"
    );

  const saveButton =
    document.getElementById(
      "saveFacilityEvaluation"
    );

  /* ==================================
     売店
  ================================== */

  const shopAvailabilityInputs =
    document.querySelectorAll(
      'input[name="shopAvailability"]'
    );

  const shopPoint =
    document.getElementById(
      "shopPoint"
    );

  const shopRatingArea =
    document.getElementById(
      "shopRatingArea"
    );

  const shopInput =
    document.getElementById(
      "shopInput"
    );

  const shopValue =
    document.getElementById(
      "shopValue"
    );

  const shopStarFill =
    document.getElementById(
      "shopStarFill"
    );

  const clearShopScore =
    document.getElementById(
      "clearShopScore"
    );

  const shopNoneMessage =
    document.getElementById(
      "shopNoneMessage"
    );

  /* ==================================
     星評価項目
  ================================== */

  const starItems = {
    cleanliness: {
      name: "清潔感",

      input:
        document.getElementById(
          "facilityCleanlinessInput"
        ),

      value:
        document.getElementById(
          "facilityCleanlinessValue"
        ),

      fill:
        document.getElementById(
          "facilityCleanlinessStarFill"
        ),

      point:
        document.getElementById(
          "facilityCleanlinessPoint"
        ),

      evaluated: false
    },

    lounge: {
      name: "ラウンジ・ロビー",

      input:
        document.getElementById(
          "loungeInput"
        ),

      value:
        document.getElementById(
          "loungeValue"
        ),

      fill:
        document.getElementById(
          "loungeStarFill"
        ),

      point:
        document.getElementById(
          "loungePoint"
        ),

      evaluated: false
    },

    wifi: {
      name: "Wi-Fi",

      input:
        document.getElementById(
          "wifiInput"
        ),

      value:
        document.getElementById(
          "wifiValue"
        ),

      fill:
        document.getElementById(
          "wifiStarFill"
        ),

      point:
        document.getElementById(
          "wifiPoint"
        ),

      evaluated: false
    },

    access: {
      name: "アクセス",

      input:
        document.getElementById(
          "accessInput"
        ),

      value:
        document.getElementById(
          "accessValue"
        ),

      fill:
        document.getElementById(
          "accessStarFill"
        ),

      point:
        document.getElementById(
          "accessPoint"
        ),

      evaluated: false
    }
  };

  /*
    売店ありの場合のみ
    星評価を使用する。
  */

  let shopEvaluated = false;

  /* ==================================
     初期処理
  ================================== */

  loadSavedFacilityEvaluation();
  updateAll();

  /* ==================================
     通常の星評価
  ================================== */

  Object.entries(starItems)
    .forEach(([key, item]) => {
      item.input.addEventListener(
        "input",
        () => {
          item.evaluated = true;

          updateStarItem(key);
          updateTotalScore();
        }
      );
    });

  /* ==================================
     通常項目を未評価へ戻す
  ================================== */

  document
    .querySelectorAll(
      "[data-clear-score]"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          const key =
            button.dataset.clearScore;

          if (key === "shop") {
            return;
          }

          const item =
            starItems[key];

          if (!item) {
            return;
          }

          item.evaluated = false;
          item.input.value = "0";

          updateStarItem(key);
          updateTotalScore();
        }
      );
    });

  /* ==================================
     売店の有無
  ================================== */

  shopAvailabilityInputs.forEach(
    (input) => {
      input.addEventListener(
        "change",
        () => {
          updateShopState();
          updateShopScore();
          updateTotalScore();
        }
      );
    }
  );

  /* ==================================
     売店の星評価
  ================================== */

  shopInput.addEventListener(
    "input",
    () => {
      if (shopInput.disabled) {
        return;
      }

      shopEvaluated = true;

      updateShopScore();
      updateTotalScore();
    }
  );

  clearShopScore.addEventListener(
    "click",
    () => {
      if (
        clearShopScore.disabled
      ) {
        return;
      }

      shopEvaluated = false;
      shopInput.value = "0";

      updateShopScore();
      updateTotalScore();
    }
  );

  /* ==================================
     戻る
  ================================== */

  backButton.addEventListener(
    "click",
    () => {
      saveTemporaryDraft();

      window.location.href =
        "add.html";
    }
  );

  /* ==================================
     確定保存
  ================================== */

  saveButton.addEventListener(
    "click",
    () => {
      clearMessage();

      const validation =
        validateFacilityEvaluation();

      if (!validation.valid) {
        showMessage(
          validation.message,
          false
        );

        return;
      }

      saveFacilityEvaluation();

      showMessage(
        "施設・設備の評価を保存しました。",
        true
      );

      window.setTimeout(() => {
        window.location.href =
          "add.html";
      }, 300);
    }
  );

  /* ==================================
     全項目更新
  ================================== */

  function updateAll() {
    Object.keys(starItems)
      .forEach(updateStarItem);

    updateShopState();
    updateShopScore();
    updateTotalScore();
  }

  /* ==================================
     通常の星評価
  ================================== */

  function updateStarItem(key) {
    const item =
      starItems[key];

    if (!item.evaluated) {
      item.value.textContent =
        "未評価";

      item.fill.style.width =
        "0%";

      item.point.textContent =
        "0.000 / 1.000";

      return;
    }

    const score =
      clamp(
        Number(item.input.value),
        0,
        5
      );

    item.input.value =
      String(score);

    const point =
      roundToThree(
        score / 5
      );

    item.value.textContent =
      `☆${formatScore(score)}`;

    item.fill.style.width =
      `${(score / 5) * 100}%`;

    item.point.textContent =
      `${formatScore(point)} / 1.000`;
  }

  function getStarItemPoint(key) {
    const item =
      starItems[key];

    if (!item.evaluated) {
      return null;
    }

    return roundToThree(
      Number(item.input.value) / 5
    );
  }

  /* ==================================
     売店
  ================================== */

  function getSelectedShopAvailability() {
    return document.querySelector(
      'input[name="shopAvailability"]:checked'
    );
  }

  function isShopAvailable() {
    const selected =
      getSelectedShopAvailability();

    return (
      selected?.value ===
      "available"
    );
  }

  function updateShopState() {
    const selected =
      getSelectedShopAvailability();

    const shopAvailable =
      selected?.value ===
      "available";

    shopInput.disabled =
      !shopAvailable;

    clearShopScore.disabled =
      !shopAvailable;

    shopRatingArea.classList.toggle(
      "is-disabled",
      !shopAvailable
    );

    shopNoneMessage.classList.toggle(
      "is-hidden",
      shopAvailable
    );

    if (!selected) {
      shopEvaluated = false;
      shopInput.value = "0";

      return;
    }

    if (!shopAvailable) {
      /*
        売店なしの場合は
        0.500点固定。
      */

      shopEvaluated = false;
      shopInput.value = "0";

      shopValue.textContent =
        "売店なし";

      shopStarFill.style.width =
        "0%";
    }
  }

  function updateShopScore() {
    const selected =
      getSelectedShopAvailability();

    if (!selected) {
      shopPoint.textContent =
        "0.000 / 1.000";

      shopValue.textContent =
        "未選択";

      shopStarFill.style.width =
        "0%";

      return;
    }

    if (
      selected.value === "none"
    ) {
      shopPoint.textContent =
        "0.500 / 1.000";

      shopValue.textContent =
        "売店なし";

      shopStarFill.style.width =
        "0%";

      return;
    }

    if (!shopEvaluated) {
      shopPoint.textContent =
        "0.000 / 1.000";

      shopValue.textContent =
        "未評価";

      shopStarFill.style.width =
        "0%";

      return;
    }

    const score =
      clamp(
        Number(shopInput.value),
        0,
        5
      );

    shopInput.value =
      String(score);

    const point =
      roundToThree(
        score / 5
      );

    shopValue.textContent =
      `☆${formatScore(score)}`;

    shopStarFill.style.width =
      `${(score / 5) * 100}%`;

    shopPoint.textContent =
      `${formatScore(point)} / 1.000`;
  }

  function getShopPoint() {
    const selected =
      getSelectedShopAvailability();

    if (!selected) {
      return null;
    }

    if (
      selected.value === "none"
    ) {
      return 0.5;
    }

    if (!shopEvaluated) {
      return null;
    }

    return roundToThree(
      Number(shopInput.value) / 5
    );
  }

  /* ==================================
     合計評価
  ================================== */

  function calculateFacilityScore() {
    const cleanliness =
      getStarItemPoint(
        "cleanliness"
      );

    const lounge =
      getStarItemPoint(
        "lounge"
      );

    const shop =
      getShopPoint();

    const wifi =
      getStarItemPoint(
        "wifi"
      );

    const access =
      getStarItemPoint(
        "access"
      );

    const points = [
      cleanliness,
      lounge,
      shop,
      wifi,
      access
    ];

    const allEntered =
      points.every(
        (point) =>
          point !== null
      );

    if (!allEntered) {
      return null;
    }

    return roundToThree(
      points.reduce(
        (sum, point) =>
          sum + point,
        0
      )
    );
  }

  function updateTotalScore() {
    const total =
      calculateFacilityScore();

    if (total === null) {
      facilityTotalScore.textContent =
        "☆―.―――";

      return;
    }

    facilityTotalScore.textContent =
      `☆${formatScore(total)}`;
  }

  /* ==================================
     入力確認
  ================================== */

  function validateFacilityEvaluation() {
    for (
      const item of
      Object.values(starItems)
    ) {
      if (!item.evaluated) {
        return {
          valid: false,
          message:
            `${item.name}を評価してください。`
        };
      }
    }

    const shopAvailability =
      getSelectedShopAvailability();

    if (!shopAvailability) {
      return {
        valid: false,
        message:
          "売店の有無を選択してください。"
      };
    }

    if (
      isShopAvailable() &&
      !shopEvaluated
    ) {
      return {
        valid: false,
        message:
          "売店を評価してください。"
      };
    }

    return {
      valid: true,
      message: ""
    };
  }

  /* ==================================
     正式保存
  ================================== */

  function saveFacilityEvaluation() {
    const shopAvailability =
      getSelectedShopAvailability();

    const shopAvailable =
      isShopAvailable();

    const cleanlinessScore =
      roundToThree(
        Number(
          starItems.cleanliness
            .input.value
        )
      );

    const loungeScore =
      roundToThree(
        Number(
          starItems.lounge
            .input.value
        )
      );

    const wifiScore =
      roundToThree(
        Number(
          starItems.wifi
            .input.value
        )
      );

    const accessScore =
      roundToThree(
        Number(
          starItems.access
            .input.value
        )
      );

    const shopScore =
      shopAvailable
        ? roundToThree(
            Number(
              shopInput.value
            )
          )
        : null;

    const total =
      calculateFacilityScore();

    const draft =
      loadDraft();

    draft.categoryScores =
      draft.categoryScores || {};

    draft.categoryDetails =
      draft.categoryDetails || {};

    draft.categoryScores.facility =
      total;

    draft.categoryDetails.facility = {
      cleanliness: {
        score:
          cleanlinessScore,

        point:
          getStarItemPoint(
            "cleanliness"
          )
      },

      lounge: {
        score:
          loungeScore,

        point:
          getStarItemPoint(
            "lounge"
          )
      },

      shop: {
        available:
          shopAvailable,

        type:
          shopAvailability.value,

        score:
          shopScore,

        point:
          getShopPoint()
      },

      wifi: {
        score:
          wifiScore,

        point:
          getStarItemPoint(
            "wifi"
          )
      },

      access: {
        score:
          accessScore,

        point:
          getStarItemPoint(
            "access"
          )
      },

      score:
        total
    };

    delete draft.categoryDetails
      .facilityDraft;

    saveDraft(draft);
  }

  /* ==================================
     入力途中を保存
  ================================== */

  function saveTemporaryDraft() {
    const draft =
      loadDraft();

    draft.categoryDetails =
      draft.categoryDetails || {};

    const selectedShop =
      getSelectedShopAvailability();

    const stars = {};

    Object.entries(starItems)
      .forEach(([key, item]) => {
        stars[key] = {
          value:
            item.input.value,

          evaluated:
            item.evaluated
        };
      });

    draft.categoryDetails
      .facilityDraft = {
        stars,

        shop: {
          availability:
            selectedShop?.value ??
            "",

          value:
            shopInput.value,

          evaluated:
            shopEvaluated
        }
      };

    saveDraft(draft);
  }

  /* ==================================
     保存済み内容を読み込む
  ================================== */

  function loadSavedFacilityEvaluation() {
    const draft =
      loadDraft();

    const saved =
      draft.categoryDetails
        ?.facility;

    const temporary =
      draft.categoryDetails
        ?.facilityDraft;

    if (saved) {
      setStarItem(
        "cleanliness",
        saved.cleanliness?.score,
        true
      );

      setStarItem(
        "lounge",
        saved.lounge?.score,
        true
      );

      setStarItem(
        "wifi",
        saved.wifi?.score,
        true
      );

      setStarItem(
        "access",
        saved.access?.score,
        true
      );

      setRadioValue(
        "shopAvailability",
        saved.shop?.type
      );

      if (
        saved.shop?.available
      ) {
        shopInput.value =
          String(
            saved.shop?.score ?? 0
          );

        shopEvaluated = true;
      }

      return;
    }

    if (temporary) {
      Object.keys(starItems)
        .forEach((key) => {
          const savedItem =
            temporary.stars?.[key];

          if (!savedItem) {
            return;
          }

          setStarItem(
            key,
            savedItem.value,
            savedItem.evaluated
          );
        });

      setRadioValue(
        "shopAvailability",
        temporary.shop
          ?.availability
      );

      shopInput.value =
        temporary.shop?.value ??
        "0";

      shopEvaluated =
        Boolean(
          temporary.shop
            ?.evaluated
        );
    }
  }

  function setStarItem(
    key,
    score,
    evaluated
  ) {
    const item =
      starItems[key];

    if (!item) {
      return;
    }

    item.input.value =
      String(score ?? 0);

    item.evaluated =
      Boolean(evaluated);
  }

  function setRadioValue(
    name,
    value
  ) {
    if (!value) {
      return;
    }

    const input =
      document.querySelector(
        `input[name="${name}"][value="${value}"]`
      );

    if (input) {
      input.checked = true;
    }
  }

  /* ==================================
     下書き保存・読み込み
  ================================== */

  function saveDraft(draft) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(draft)
    );
  }

  function loadDraft() {
    try {
      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!saved) {
        return {};
      }

      const parsed =
        JSON.parse(saved);

      return (
        parsed &&
        typeof parsed === "object"
      )
        ? parsed
        : {};
    } catch (error) {
      console.error(
        "下書きを読み込めませんでした。",
        error
      );

      return {};
    }
  }

  /* ==================================
     数値処理
  ================================== */

  function clamp(
    value,
    minimum,
    maximum
  ) {
    return Math.min(
      maximum,
      Math.max(
        minimum,
        Number(value)
      )
    );
  }

  function roundToThree(value) {
    return (
      Math.round(
        (
          Number(value) +
          Number.EPSILON
        ) *
          1000
      ) / 1000
    );
  }

  function formatScore(value) {
    return Number(value)
      .toFixed(3);
  }

  /* ==================================
     メッセージ
  ================================== */

  function showMessage(
    text,
    success
  ) {
    message.textContent =
      text;

    message.classList.toggle(
      "success",
      success
    );
  }

  function clearMessage() {
    message.textContent = "";

    message.classList.remove(
      "success"
    );
  }
});