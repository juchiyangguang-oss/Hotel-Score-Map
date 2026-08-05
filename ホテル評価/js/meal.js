"use strict";

/* ==================================
   Hotel Score Map
   お食事評価
================================== */

document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY =
    "hotelScoreMapDraft";

  /* ==================================
     共通要素
  ================================== */

  const backButton =
    document.getElementById("backButton");

  const mealTotalScore =
    document.getElementById(
      "mealTotalScore"
    );

  const mealScoreMax =
    document.getElementById(
      "mealScoreMax"
    );

  const mealPlanStatus =
    document.getElementById(
      "mealPlanStatus"
    );

  const mealExcludedMessage =
    document.getElementById(
      "mealExcludedMessage"
    );

  const message =
    document.getElementById(
      "mealFormMessage"
    );

  const saveButton =
    document.getElementById(
      "saveMealEvaluation"
    );

  /* ==================================
     食事プラン
  ================================== */

  const mealPlanInputs =
    document.querySelectorAll(
      'input[name="mealPlan"]'
    );

  /* ==================================
     星評価項目
  ================================== */

  const mealItems = {
    dinner: {
      name: "夕食",

      section:
        document.getElementById(
          "dinnerSection"
        ),

      description:
        document.getElementById(
          "dinnerDescription"
        ),

      input:
        document.getElementById(
          "dinnerInput"
        ),

      value:
        document.getElementById(
          "dinnerValue"
        ),

      fill:
        document.getElementById(
          "dinnerStarFill"
        ),

      point:
        document.getElementById(
          "dinnerPoint"
        ),

      clearButton:
        document.getElementById(
          "clearDinnerScore"
        ),

      evaluated: false,
      applicable: false
    },

    breakfast: {
      name: "朝食",

      section:
        document.getElementById(
          "breakfastSection"
        ),

      description:
        document.getElementById(
          "breakfastDescription"
        ),

      input:
        document.getElementById(
          "breakfastInput"
        ),

      value:
        document.getElementById(
          "breakfastValue"
        ),

      fill:
        document.getElementById(
          "breakfastStarFill"
        ),

      point:
        document.getElementById(
          "breakfastPoint"
        ),

      clearButton:
        document.getElementById(
          "clearBreakfastScore"
        ),

      evaluated: false,
      applicable: false
    },

    taste: {
      name: "味",

      section:
        document.getElementById(
          "tasteSection"
        ),

      input:
        document.getElementById(
          "tasteInput"
        ),

      value:
        document.getElementById(
          "tasteValue"
        ),

      fill:
        document.getElementById(
          "tasteStarFill"
        ),

      point:
        document.getElementById(
          "tastePoint"
        ),

      clearButton:
        document.getElementById(
          "clearTasteScore"
        ),

      evaluated: false,
      applicable: false
    },

    quantity: {
      name: "品数・量",

      section:
        document.getElementById(
          "quantitySection"
        ),

      input:
        document.getElementById(
          "quantityInput"
        ),

      value:
        document.getElementById(
          "quantityValue"
        ),

      fill:
        document.getElementById(
          "quantityStarFill"
        ),

      point:
        document.getElementById(
          "quantityPoint"
        ),

      clearButton:
        document.getElementById(
          "clearQuantityScore"
        ),

      evaluated: false,
      applicable: false
    },

    service: {
      name: "接客",

      section:
        document.getElementById(
          "mealServiceSection"
        ),

      input:
        document.getElementById(
          "mealServiceInput"
        ),

      value:
        document.getElementById(
          "mealServiceValue"
        ),

      fill:
        document.getElementById(
          "mealServiceStarFill"
        ),

      point:
        document.getElementById(
          "mealServicePoint"
        ),

      clearButton:
        document.getElementById(
          "clearMealServiceScore"
        ),

      evaluated: false,
      applicable: false
    }
  };

  /* ==================================
     初期処理
  ================================== */

  loadSavedMealEvaluation();
  updateAll();

  /* ==================================
     食事プラン変更
  ================================== */

  mealPlanInputs.forEach((input) => {
    input.addEventListener(
      "change",
      () => {
        updateMealPlanState();
        updateAllItemDisplays();
        updateTotalScore();
      }
    );
  });

  /* ==================================
     星評価操作
  ================================== */

  Object.entries(mealItems)
    .forEach(([key, item]) => {
      item.input.addEventListener(
        "input",
        () => {
          if (
            item.input.disabled ||
            !item.applicable
          ) {
            return;
          }

          item.evaluated = true;

          updateMealItem(key);
          updateTotalScore();
        }
      );

      item.clearButton.addEventListener(
        "click",
        () => {
          if (
            item.clearButton.disabled ||
            !item.applicable
          ) {
            return;
          }

          item.evaluated = false;
          item.input.value = "0";

          updateMealItem(key);
          updateTotalScore();
        }
      );
    });

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
        validateMealEvaluation();

      if (!validation.valid) {
        showMessage(
          validation.message,
          false
        );

        return;
      }

      saveMealEvaluation();

      showMessage(
        "お食事の評価を保存しました。",
        true
      );

      window.setTimeout(() => {
        window.location.href =
          "add.html";
      }, 300);
    }
  );

  /* ==================================
     全体更新
  ================================== */

  function updateAll() {
    updateMealPlanState();
    updateAllItemDisplays();
    updateTotalScore();
  }

  function updateAllItemDisplays() {
    Object.keys(mealItems)
      .forEach(updateMealItem);
  }

  /* ==================================
     食事プラン
  ================================== */

  function getSelectedMealPlan() {
    return document.querySelector(
      'input[name="mealPlan"]:checked'
    );
  }

  function getMealPlanValue() {
    return (
      getSelectedMealPlan()?.value ??
      ""
    );
  }

  function updateMealPlanState() {
    const plan =
      getMealPlanValue();

    const hasDinner =
      plan === "dinner-breakfast" ||
      plan === "dinner-only";

    const hasBreakfast =
      plan === "dinner-breakfast" ||
      plan === "breakfast-only";

    const hasAnyMeal =
      hasDinner || hasBreakfast;

    mealItems.dinner.applicable =
      hasDinner;

    mealItems.breakfast.applicable =
      hasBreakfast;

    mealItems.taste.applicable =
      hasAnyMeal;

    mealItems.quantity.applicable =
      hasAnyMeal;

    mealItems.service.applicable =
      hasAnyMeal;

    Object.values(mealItems)
      .forEach((item) => {
        item.input.disabled =
          !item.applicable;

        item.clearButton.disabled =
          !item.applicable;

        item.section.classList.toggle(
          "is-excluded",
          !item.applicable
        );

        if (!item.applicable) {
          item.evaluated = false;
          item.input.value = "0";
        }
      });

    mealExcludedMessage.classList.toggle(
      "is-hidden",
      plan !== "none"
    );

    if (!plan) {
      mealPlanStatus.textContent =
        "未選択";

      mealScoreMax.textContent =
        "5.000点満点";

      return;
    }

    if (
      plan === "dinner-breakfast"
    ) {
      mealPlanStatus.textContent =
        "夕食・朝食あり";

      mealScoreMax.textContent =
        "5.000点満点";

      return;
    }

    if (plan === "dinner-only") {
      mealPlanStatus.textContent =
        "夕食のみ";

      mealScoreMax.textContent =
        "朝食は評価対象外";

      return;
    }

    if (
      plan === "breakfast-only"
    ) {
      mealPlanStatus.textContent =
        "朝食のみ";

      mealScoreMax.textContent =
        "夕食は評価対象外";

      return;
    }

    mealPlanStatus.textContent =
      "食事なし";

    mealScoreMax.textContent =
      "評価対象外";
  }

  /* ==================================
     星評価表示
  ================================== */

  function updateMealItem(key) {
    const item =
      mealItems[key];

    if (!item.applicable) {
      item.value.textContent =
        "評価対象外";

      item.fill.style.width =
        "0%";

      item.point.textContent =
        "評価対象外";

      return;
    }

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

    const rawPoint =
      roundToThree(
        score / 5
      );

    item.value.textContent =
      `☆${formatScore(score)}`;

    item.fill.style.width =
      `${(score / 5) * 100}%`;

    item.point.textContent =
      `${formatScore(rawPoint)} / 1.000`;
  }

  function getMealItemRawPoint(key) {
    const item =
      mealItems[key];

    if (
      !item.applicable ||
      !item.evaluated
    ) {
      return null;
    }

    return roundToThree(
      Number(item.input.value) / 5
    );
  }

  /* ==================================
     お食事合計
  ================================== */

  function calculateMealScore() {
    const plan =
      getMealPlanValue();

    if (!plan) {
      return null;
    }

    if (plan === "none") {
      return "excluded";
    }

    const applicableItems =
      Object.entries(mealItems)
        .filter(
          ([, item]) =>
            item.applicable
        );

    const points =
      applicableItems.map(
        ([key]) =>
          getMealItemRawPoint(key)
      );

    const allEvaluated =
      points.every(
        (point) =>
          point !== null
      );

    if (!allEvaluated) {
      return null;
    }

    /*
      夕食・朝食ありなら5項目の合計。

      夕食のみ、朝食のみなら
      4項目の合計を5.000点満点へ換算。
    */

    const rawTotal =
      points.reduce(
        (sum, point) =>
          sum + point,
        0
      );

    const maximumRawScore =
      applicableItems.length;

    return roundToThree(
      rawTotal *
      (5 / maximumRawScore)
    );
  }

  function updateTotalScore() {
    const result =
      calculateMealScore();

    if (result === "excluded") {
      mealTotalScore.textContent =
        "評価対象外";

      return;
    }

    if (result === null) {
      mealTotalScore.textContent =
        "☆―.―――";

      return;
    }

    mealTotalScore.textContent =
      `☆${formatScore(result)}`;
  }

  /* ==================================
     入力チェック
  ================================== */

  function validateMealEvaluation() {
    const plan =
      getMealPlanValue();

    if (!plan) {
      return {
        valid: false,
        message:
          "食事プランを選択してください。"
      };
    }

    if (plan === "none") {
      return {
        valid: true,
        message: ""
      };
    }

    for (
      const item of
      Object.values(mealItems)
    ) {
      if (
        item.applicable &&
        !item.evaluated
      ) {
        return {
          valid: false,
          message:
            `${item.name}を評価してください。`
        };
      }
    }

    return {
      valid: true,
      message: ""
    };
  }

  /* ==================================
     正式保存
  ================================== */

  function saveMealEvaluation() {
    const plan =
      getMealPlanValue();

    const draft =
      loadDraft();

    draft.categoryScores =
      draft.categoryScores || {};

    draft.categoryDetails =
      draft.categoryDetails || {};

    /*
      食事なしは0点ではなく、
      categoryScoresから削除して
      総合平均から除外する。
    */

    if (plan === "none") {
      delete draft.categoryScores.meal;

      draft.categoryDetails.meal = {
        plan,
        applicable: false,
        score: null,
        items: {}
      };

      delete draft.categoryDetails
        .mealDraft;

      saveDraft(draft);

      return;
    }

    const items = {};

    Object.entries(mealItems)
      .forEach(([key, item]) => {
        if (!item.applicable) {
          items[key] = {
            applicable: false,
            score: null,
            rawPoint: null
          };

          return;
        }

        const score =
          roundToThree(
            Number(item.input.value)
          );

        items[key] = {
          applicable: true,
          score,
          rawPoint:
            roundToThree(
              score / 5
            )
        };
      });

    const total =
      calculateMealScore();

    draft.categoryScores.meal =
      total;

    draft.categoryDetails.meal = {
      plan,
      applicable: true,
      rescaled:
        plan !==
        "dinner-breakfast",

      items,
      score: total
    };

    delete draft.categoryDetails
      .mealDraft;

    saveDraft(draft);
  }

  /* ==================================
     入力途中保存
  ================================== */

  function saveTemporaryDraft() {
    const draft =
      loadDraft();

    draft.categoryDetails =
      draft.categoryDetails || {};

    const items = {};

    Object.entries(mealItems)
      .forEach(([key, item]) => {
        items[key] = {
          value:
            item.input.value,

          evaluated:
            item.evaluated
        };
      });

    draft.categoryDetails.mealDraft = {
      plan:
        getMealPlanValue(),

      items
    };

    saveDraft(draft);
  }

  /* ==================================
     保存済みデータ読み込み
  ================================== */

  function loadSavedMealEvaluation() {
    const draft =
      loadDraft();

    const saved =
      draft.categoryDetails?.meal;

    const temporary =
      draft.categoryDetails
        ?.mealDraft;

    if (saved) {
      setRadioValue(
        "mealPlan",
        saved.plan
      );

      if (!saved.applicable) {
        return;
      }

      Object.entries(mealItems)
        .forEach(([key, item]) => {
          const savedItem =
            saved.items?.[key];

          if (
            !savedItem ||
            !savedItem.applicable
          ) {
            return;
          }

          item.input.value =
            String(
              savedItem.score ?? 0
            );

          item.evaluated = true;
        });

      return;
    }

    if (temporary) {
      setRadioValue(
        "mealPlan",
        temporary.plan
      );

      Object.entries(mealItems)
        .forEach(([key, item]) => {
          const savedItem =
            temporary.items?.[key];

          if (!savedItem) {
            return;
          }

          item.input.value =
            savedItem.value ?? "0";

          item.evaluated =
            Boolean(
              savedItem.evaluated
            );
        });
    }
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
    return Number(value).toFixed(3);
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