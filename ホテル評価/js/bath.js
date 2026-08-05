"use strict";

/* ==================================
   Hotel Score Map
   バス・お風呂評価
================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ==================================
     保存キー
  ================================== */

  const storageKey =
    "hotelScoreMapDraft";

  /* ==================================
     共通要素
  ================================== */

  const backButton =
    document.getElementById("backButton");

  const bathTotalScore =
    document.getElementById(
      "bathTotalScore"
    );

  const message =
    document.getElementById(
      "bathFormMessage"
    );

  const saveButton =
    document.getElementById(
      "saveBathEvaluation"
    );

  /* ==================================
     温泉・大浴場
  ================================== */

  const bathTypeInputs =
    document.querySelectorAll(
      'input[name="bathType"]'
    );

  const bathTypePoint =
    document.getElementById(
      "bathTypePoint"
    );

  /* ==================================
     泉質
  ================================== */

  const springQualitySection =
    document.getElementById(
      "springQualitySection"
    );

  const springQualityInput =
    document.getElementById(
      "springQualityInput"
    );

  const springQualityValue =
    document.getElementById(
      "springQualityValue"
    );

  const springQualityStarFill =
    document.getElementById(
      "springQualityStarFill"
    );

  const springQualityPoint =
    document.getElementById(
      "springQualityPoint"
    );

  const springQualityDescription =
    document.getElementById(
      "springQualityDescription"
    );

  const clearSpringQualityButton =
    document.getElementById(
      "clearSpringQuality"
    );

  const springTypeInput =
    document.getElementById(
      "springTypeInput"
    );

  const springQualityExcludedMessage =
    document.getElementById(
      "springQualityExcludedMessage"
    );

  /* ==================================
     星評価項目
  ================================== */

  const starItems = {
    cleanliness: {
      input:
        document.getElementById(
          "bathCleanlinessInput"
        ),

      value:
        document.getElementById(
          "bathCleanlinessValue"
        ),

      fill:
        document.getElementById(
          "bathCleanlinessStarFill"
        ),

      point:
        document.getElementById(
          "bathCleanlinessPoint"
        ),

      evaluated: false,

      name: "清潔感"
    },

    atmosphere: {
      input:
        document.getElementById(
          "bathAtmosphereInput"
        ),

      value:
        document.getElementById(
          "bathAtmosphereValue"
        ),

      fill:
        document.getElementById(
          "bathAtmosphereStarFill"
        ),

      point:
        document.getElementById(
          "bathAtmospherePoint"
        ),

      evaluated: false,

      name: "景色・雰囲気"
    },

    supplies: {
      input:
        document.getElementById(
          "bathSuppliesInput"
        ),

      value:
        document.getElementById(
          "bathSuppliesValue"
        ),

      fill:
        document.getElementById(
          "bathSuppliesStarFill"
        ),

      point:
        document.getElementById(
          "bathSuppliesPoint"
        ),

      evaluated: false,

      name: "備品"
    }
  };

  /*
    泉質は温泉ありの場合だけ評価。
  */

  let springQualityEvaluated =
    false;

  /* ==================================
     初期処理
  ================================== */

  loadSavedBathEvaluation();
  updateAll();

  /* ==================================
     温泉・大浴場の選択
  ================================== */

  bathTypeInputs.forEach(
    (input) => {
      input.addEventListener(
        "change",
        () => {
          updateBathType();
          updateSpringQualityState();
          updateTotalScore();
        }
      );
    }
  );

  /* ==================================
     通常の星評価
  ================================== */

  Object.entries(starItems)
    .forEach(
      ([key, item]) => {
        item.input.addEventListener(
          "input",
          () => {
            item.evaluated = true;

            updateStarItem(key);
            updateTotalScore();
          }
        );
      }
    );

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

          if (
            key ===
            "spring-quality"
          ) {
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
     泉質の星評価
  ================================== */

  springQualityInput.addEventListener(
    "input",
    () => {
      if (
        springQualityInput.disabled
      ) {
        return;
      }

      springQualityEvaluated = true;

      updateSpringQualityScore();
      updateTotalScore();
    }
  );

  clearSpringQualityButton
    .addEventListener(
      "click",
      () => {
        if (
          clearSpringQualityButton
            .disabled
        ) {
          return;
        }

        springQualityEvaluated =
          false;

        springQualityInput.value =
          "0";

        updateSpringQualityScore();
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
        validateBathEvaluation();

      if (!validation.valid) {
        showMessage(
          validation.message,
          false
        );

        return;
      }

      saveBathEvaluation();

      showMessage(
        "バス・お風呂の評価を保存しました。",
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
    updateBathType();

    Object.keys(starItems)
      .forEach(updateStarItem);

    updateSpringQualityState();
    updateSpringQualityScore();
    updateTotalScore();
  }

  /* ==================================
     ① 温泉・大浴場
  ================================== */

  function getSelectedBathType() {
    return document.querySelector(
      'input[name="bathType"]:checked'
    );
  }

  function getBathTypePoint() {
    const selected =
      getSelectedBathType();

    if (!selected) {
      return null;
    }

    if (
      selected.value === "onsen"
    ) {
      return 1;
    }

    if (
      selected.value ===
      "large-bath"
    ) {
      return 0.8;
    }

    return 0.5;
  }

  function updateBathType() {
    const point =
      getBathTypePoint();

    bathTypePoint.textContent =
      point === null
        ? "0.000 / 1.000"
        : `${formatScore(point)} / 1.000`;
  }

  function isOnsenSelected() {
    const selected =
      getSelectedBathType();

    return (
      selected?.value === "onsen"
    );
  }

  /* ==================================
     ② 清潔感
     ④ 景色・雰囲気
     ⑤ 備品
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
     ③ 泉質
  ================================== */

  function updateSpringQualityState() {
    const onsen =
      isOnsenSelected();

    springQualityInput.disabled =
      !onsen;

    clearSpringQualityButton.disabled =
      !onsen;

    springTypeInput.disabled =
      !onsen;

    springQualitySection.classList
      .toggle(
        "is-excluded",
        !onsen
      );

    springQualityExcludedMessage
      .classList.toggle(
        "is-hidden",
        onsen
      );

    if (onsen) {
      springQualityDescription
        .textContent =
        "温泉の泉質や肌触りなどを評価";

      if (!springQualityEvaluated) {
        springQualityPoint
          .textContent =
          "0.000 / 1.000";
      }

      return;
    }

    /*
      温泉なしの場合は
      泉質を評価対象外へ戻す。
    */

    springQualityEvaluated =
      false;

    springQualityInput.value =
      "0";

    springQualityValue.textContent =
      "評価対象外";

    springQualityStarFill.style.width =
      "0%";

    springQualityPoint.textContent =
      "評価対象外";

    springQualityDescription
      .textContent =
      "温泉がないため評価対象外";

    springTypeInput.value = "";
  }

  function updateSpringQualityScore() {
    if (!isOnsenSelected()) {
      springQualityValue.textContent =
        "評価対象外";

      springQualityStarFill.style.width =
        "0%";

      springQualityPoint.textContent =
        "評価対象外";

      return;
    }

    if (
      !springQualityEvaluated
    ) {
      springQualityValue.textContent =
        "未評価";

      springQualityStarFill.style.width =
        "0%";

      springQualityPoint.textContent =
        "0.000 / 1.000";

      return;
    }

    const score =
      clamp(
        Number(
          springQualityInput.value
        ),
        0,
        5
      );

    springQualityInput.value =
      String(score);

    const point =
      roundToThree(
        score / 5
      );

    springQualityValue.textContent =
      `☆${formatScore(score)}`;

    springQualityStarFill.style.width =
      `${(score / 5) * 100}%`;

    springQualityPoint.textContent =
      `${formatScore(point)} / 1.000`;
  }

  function getSpringQualityPoint() {
    if (!isOnsenSelected()) {
      return null;
    }

    if (
      !springQualityEvaluated
    ) {
      return null;
    }

    return roundToThree(
      Number(
        springQualityInput.value
      ) / 5
    );
  }

  /* ==================================
     合計評価
  ================================== */

  function calculateBathScore() {
    const bathType =
      getBathTypePoint();

    const cleanliness =
      getStarItemPoint(
        "cleanliness"
      );

    const atmosphere =
      getStarItemPoint(
        "atmosphere"
      );

    const supplies =
      getStarItemPoint(
        "supplies"
      );

    if (
      bathType === null ||
      cleanliness === null ||
      atmosphere === null ||
      supplies === null
    ) {
      return null;
    }

    if (isOnsenSelected()) {
      const springQuality =
        getSpringQualityPoint();

      if (
        springQuality === null
      ) {
        return null;
      }

      /*
        温泉あり：
        5項目をそのまま合計。
      */

      return roundToThree(
        bathType +
        cleanliness +
        springQuality +
        atmosphere +
        supplies
      );
    }

    /*
      温泉なし：
      泉質を評価対象外にする。

      残り4項目の合計を
      5.000点満点に換算する。
    */

    const fourItemTotal =
      bathType +
      cleanliness +
      atmosphere +
      supplies;

    return roundToThree(
      fourItemTotal *
      (5 / 4)
    );
  }

  function updateTotalScore() {
    const total =
      calculateBathScore();

    if (total === null) {
      bathTotalScore.textContent =
        "☆―.―――";

      return;
    }

    bathTotalScore.textContent =
      `☆${formatScore(total)}`;
  }

  /* ==================================
     入力確認
  ================================== */

  function validateBathEvaluation() {
    if (
      getBathTypePoint() === null
    ) {
      return {
        valid: false,
        message:
          "温泉・大浴場について選択してください。"
      };
    }

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

    if (
      isOnsenSelected() &&
      !springQualityEvaluated
    ) {
      return {
        valid: false,
        message:
          "泉質を評価してください。"
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

  function saveBathEvaluation() {
    const selectedBathType =
      getSelectedBathType();

    const bathTypePointValue =
      getBathTypePoint();

    const cleanlinessScore =
      roundToThree(
        Number(
          starItems.cleanliness
            .input.value
        )
      );

    const cleanlinessPoint =
      getStarItemPoint(
        "cleanliness"
      );

    const atmosphereScore =
      roundToThree(
        Number(
          starItems.atmosphere
            .input.value
        )
      );

    const atmospherePoint =
      getStarItemPoint(
        "atmosphere"
      );

    const suppliesScore =
      roundToThree(
        Number(
          starItems.supplies
            .input.value
        )
      );

    const suppliesPoint =
      getStarItemPoint(
        "supplies"
      );

    const onsen =
      isOnsenSelected();

    const springQualityScore =
      onsen
        ? roundToThree(
            Number(
              springQualityInput.value
            )
          )
        : null;

    const springQualityPointValue =
      onsen
        ? getSpringQualityPoint()
        : null;

    const total =
      calculateBathScore();

    const draft =
      loadDraft();

    draft.categoryScores =
      draft.categoryScores || {};

    draft.categoryDetails =
      draft.categoryDetails || {};

    draft.categoryScores.bath =
      total;

    draft.categoryDetails.bath = {
      bathType: {
        type:
          selectedBathType.value,

        point:
          bathTypePointValue
      },

      cleanliness: {
        score:
          cleanlinessScore,

        point:
          cleanlinessPoint
      },

      springQuality: {
        applicable:
          onsen,

        score:
          springQualityScore,

        point:
          springQualityPointValue,

        springType:
          onsen
            ? springTypeInput.value
            : ""
      },

      atmosphere: {
        score:
          atmosphereScore,

        point:
          atmospherePoint
      },

      supplies: {
        score:
          suppliesScore,

        point:
          suppliesPoint
      },

      rescaled:
        !onsen,

      score:
        total
    };

    delete draft.categoryDetails
      .bathDraft;

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

    const selectedBathType =
      getSelectedBathType();

    draft.categoryDetails
      .bathDraft = {
        bathType:
          selectedBathType?.value ??
          "",

        stars: {
          cleanliness: {
            value:
              starItems.cleanliness
                .input.value,

            evaluated:
              starItems.cleanliness
                .evaluated
          },

          atmosphere: {
            value:
              starItems.atmosphere
                .input.value,

            evaluated:
              starItems.atmosphere
                .evaluated
          },

          supplies: {
            value:
              starItems.supplies
                .input.value,

            evaluated:
              starItems.supplies
                .evaluated
          }
        },

        springQuality: {
          value:
            springQualityInput.value,

          evaluated:
            springQualityEvaluated,

          springType:
            springTypeInput.value
        }
      };

    saveDraft(draft);
  }

  /* ==================================
     保存済み内容を読み込む
  ================================== */

  function loadSavedBathEvaluation() {
    const draft =
      loadDraft();

    const saved =
      draft.categoryDetails?.bath;

    const temporary =
      draft.categoryDetails
        ?.bathDraft;

    if (saved) {
      setRadioValue(
        "bathType",
        saved.bathType?.type
      );

      setStarItem(
        "cleanliness",
        saved.cleanliness?.score,
        true
      );

      setStarItem(
        "atmosphere",
        saved.atmosphere?.score,
        true
      );

      setStarItem(
        "supplies",
        saved.supplies?.score,
        true
      );

      if (
        saved.springQuality
          ?.applicable
      ) {
        springQualityInput.value =
          String(
            saved.springQuality
              ?.score ?? 0
          );

        springQualityEvaluated =
          true;

        springTypeInput.value =
          saved.springQuality
            ?.springType ?? "";
      }

      return;
    }

    if (temporary) {
      setRadioValue(
        "bathType",
        temporary.bathType
      );

      setTemporaryStar(
        "cleanliness",
        temporary.stars
          ?.cleanliness
      );

      setTemporaryStar(
        "atmosphere",
        temporary.stars
          ?.atmosphere
      );

      setTemporaryStar(
        "supplies",
        temporary.stars
          ?.supplies
      );

      springQualityInput.value =
        temporary.springQuality
          ?.value ?? "0";

      springQualityEvaluated =
        Boolean(
          temporary.springQuality
            ?.evaluated
        );

      springTypeInput.value =
        temporary.springQuality
          ?.springType ?? "";
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

  function setTemporaryStar(
    key,
    savedItem
  ) {
    if (!savedItem) {
      return;
    }

    setStarItem(
      key,
      savedItem.value,
      savedItem.evaluated
    );
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
      storageKey,
      JSON.stringify(draft)
    );
  }

  function loadDraft() {
    try {
      const saved =
        localStorage.getItem(
          storageKey
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