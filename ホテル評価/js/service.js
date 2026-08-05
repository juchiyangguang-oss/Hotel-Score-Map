"use strict";

/* ==================================
   接客・サービス評価
================================== */

document.addEventListener("DOMContentLoaded", () => {
  const storageKey =
    "hotelScoreMapDraft";

  /* ==================================
     HTML要素
  ================================== */

  const backButton =
    document.getElementById("backButton");

  const serviceTotalScore =
    document.getElementById(
      "serviceTotalScore"
    );

  const message =
    document.getElementById(
      "serviceFormMessage"
    );

  const saveButton =
    document.getElementById(
      "saveServiceEvaluation"
    );

  /* 対応 */

  const responseInput =
    document.getElementById(
      "responseInput"
    );

  const responseValue =
    document.getElementById(
      "responseValue"
    );

  const responseStarFill =
    document.getElementById(
      "responseStarFill"
    );

  const responsePoint =
    document.getElementById(
      "responsePoint"
    );

  /* 滞在可能時間 */

  const checkInInput =
    document.getElementById(
      "checkInInput"
    );

  const checkOutInput =
    document.getElementById(
      "checkOutInput"
    );

  const stayTimeDisplay =
    document.getElementById(
      "stayTimeDisplay"
    );

  const stayTimePoint =
    document.getElementById(
      "stayTimePoint"
    );

  /* 送迎・荷物 */

  const shuttleInputs =
    document.querySelectorAll(
      'input[name="shuttle"]'
    );

  const luggageInputs =
    document.querySelectorAll(
      'input[name="luggage"]'
    );

  const shuttlePoint =
    document.getElementById(
      "shuttlePoint"
    );

  const luggagePoint =
    document.getElementById(
      "luggagePoint"
    );

  /* その他サービス */

  const extraServiceInputs =
    document.querySelectorAll(
      'input[name="extraService"]'
    );

  const extraServicePoint =
    document.getElementById(
      "extraServicePoint"
    );

  const extraServiceCount =
    document.getElementById(
      "extraServiceCount"
    );

  const clearResponseButton =
    document.querySelector(
      '[data-clear-score="response"]'
    );

  /*
    星スライダーが0でも、
    実際に操作するまでは「未評価」。
  */

  let responseEvaluated = false;

  /* ==================================
     初期処理
  ================================== */

  loadSavedServiceEvaluation();
  updateAll();

  /* ==================================
     イベント
  ================================== */

  responseInput.addEventListener(
    "input",
    () => {
      responseEvaluated = true;

      updateResponseScore();
      updateTotalScore();
    }
  );

  clearResponseButton.addEventListener(
    "click",
    () => {
      responseEvaluated = false;
      responseInput.value = "0";

      updateResponseScore();
      updateTotalScore();
    }
  );

  checkInInput.addEventListener(
    "input",
    () => {
      updateStayTime();
      updateTotalScore();
    }
  );

  checkOutInput.addEventListener(
    "input",
    () => {
      updateStayTime();
      updateTotalScore();
    }
  );

  shuttleInputs.forEach((input) => {
    input.addEventListener(
      "change",
      () => {
        updateShuttleScore();
        updateTotalScore();
      }
    );
  });

  luggageInputs.forEach((input) => {
    input.addEventListener(
      "change",
      () => {
        updateLuggageScore();
        updateTotalScore();
      }
    );
  });

  extraServiceInputs.forEach(
    (input) => {
      input.addEventListener(
        "change",
        () => {
          updateExtraServiceScore();
          updateTotalScore();
        }
      );
    }
  );

  backButton.addEventListener(
    "click",
    () => {
      saveTemporaryDraft();

      window.location.href =
        "add.html";
    }
  );

  saveButton.addEventListener(
    "click",
    () => {
      clearMessage();

      const validation =
        validateServiceEvaluation();

      if (!validation.valid) {
        showMessage(
          validation.message,
          false
        );

        return;
      }

      saveServiceEvaluation();

      showMessage(
        "接客・サービスの評価を保存しました。",
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
    updateResponseScore();
    updateStayTime();
    updateShuttleScore();
    updateLuggageScore();
    updateExtraServiceScore();
    updateTotalScore();
  }

  /* ==================================
     ① 対応
  ================================== */

  function updateResponseScore() {
    if (!responseEvaluated) {
      responseValue.textContent =
        "未評価";

      responseStarFill.style.width =
        "0%";

      responsePoint.textContent =
        "0.000 / 1.000";

      return;
    }

    const score =
      clamp(
        Number(responseInput.value),
        0,
        5
      );

    responseInput.value =
      String(score);

    const point =
      roundToThree(
        score / 5
      );

    responseValue.textContent =
      `☆${formatScore(score)}`;

    responseStarFill.style.width =
      `${(score / 5) * 100}%`;

    responsePoint.textContent =
      `${formatScore(point)} / 1.000`;
  }

  function getResponsePoint() {
    if (!responseEvaluated) {
      return null;
    }

    return roundToThree(
      Number(responseInput.value) /
        5
    );
  }

  /* ==================================
     ② 滞在可能時間
  ================================== */

  function updateStayTime() {
    const stayHours =
      calculateStayHours(
        checkInInput.value,
        checkOutInput.value
      );

    if (stayHours === null) {
      stayTimeDisplay.textContent =
        "時刻を入力してください";

      stayTimePoint.textContent =
        "0.000 / 1.000";

      return;
    }

    const point =
      calculateStayTimePoint(
        stayHours
      );

    stayTimeDisplay.textContent =
      `滞在可能時間：${formatHours(
        stayHours
      )}`;

    stayTimePoint.textContent =
      `${formatScore(point)} / 1.000`;
  }

  function calculateStayHours(
    checkIn,
    checkOut
  ) {
    const checkInMinutes =
      convertTimeToMinutes(
        checkIn
      );

    const checkOutMinutes =
      convertTimeToMinutes(
        checkOut
      );

    if (
      checkInMinutes === null ||
      checkOutMinutes === null
    ) {
      return null;
    }

    /*
      チェックアウトは翌日として計算。
    */

    let difference =
      checkOutMinutes -
      checkInMinutes;

    if (difference <= 0) {
      difference += 24 * 60;
    }

    return difference / 60;
  }

  function calculateStayTimePoint(
    stayHours
  ) {
    if (stayHours >= 21) {
      return 1;
    }

    if (stayHours >= 20) {
      return 0.9;
    }

    return 0.8;
  }

  function getStayTimePoint() {
    const stayHours =
      calculateStayHours(
        checkInInput.value,
        checkOutInput.value
      );

    if (stayHours === null) {
      return null;
    }

    return calculateStayTimePoint(
      stayHours
    );
  }

  /* ==================================
     ③ 送迎
  ================================== */

  function updateShuttleScore() {
    const point =
      getShuttlePoint();

    shuttlePoint.textContent =
      point === null
        ? "0.000 / 1.000"
        : `${formatScore(point)} / 1.000`;
  }

  function getShuttlePoint() {
    const selected =
      document.querySelector(
        'input[name="shuttle"]:checked'
      );

    if (!selected) {
      return null;
    }

    if (
      selected.value ===
        "available" ||
      selected.value ===
        "unnecessary"
    ) {
      return 1;
    }

    return 0.5;
  }

  /* ==================================
     ④ 荷物対応
  ================================== */

  function updateLuggageScore() {
    const point =
      getLuggagePoint();

    luggagePoint.textContent =
      point === null
        ? "0.000 / 1.000"
        : `${formatScore(point)} / 1.000`;
  }

  function getLuggagePoint() {
    const selected =
      document.querySelector(
        'input[name="luggage"]:checked'
      );

    if (!selected) {
      return null;
    }

    return selected.value ===
      "available"
      ? 1
      : 0.5;
  }

  /* ==================================
     ⑤ その他サービス
  ================================== */

  function updateExtraServiceScore() {
    const selectedCount =
      getSelectedExtraServices()
        .length;

    const point =
      calculateExtraServicePoint(
        selectedCount
      );

    extraServiceCount.textContent =
      `選択数：${selectedCount}個`;

    extraServicePoint.textContent =
      `${formatScore(point)} / 1.000`;
  }

  function calculateExtraServicePoint(
    selectedCount
  ) {
    if (selectedCount >= 3) {
      return 1;
    }

    if (selectedCount === 2) {
      return 0.9;
    }

    if (selectedCount === 1) {
      return 0.7;
    }

    return 0.5;
  }

  function getSelectedExtraServices() {
    return Array.from(
      extraServiceInputs
    )
      .filter(
        (input) => input.checked
      )
      .map(
        (input) => input.value
      );
  }

  function getExtraServicePoint() {
    return calculateExtraServicePoint(
      getSelectedExtraServices()
        .length
    );
  }

  /* ==================================
     合計評価
  ================================== */

  function updateTotalScore() {
    const response =
      getResponsePoint();

    const stayTime =
      getStayTimePoint();

    const shuttle =
      getShuttlePoint();

    const luggage =
      getLuggagePoint();

    const extra =
      getExtraServicePoint();

    const requiredValues = [
      response,
      stayTime,
      shuttle,
      luggage
    ];

    const allEntered =
      requiredValues.every(
        (value) => value !== null
      );

    if (!allEntered) {
      serviceTotalScore.textContent =
        "☆―.―――";

      return;
    }

    const total =
      roundToThree(
        response +
          stayTime +
          shuttle +
          luggage +
          extra
      );

    serviceTotalScore.textContent =
      `☆${formatScore(total)}`;
  }

  /* ==================================
     入力チェック
  ================================== */

  function validateServiceEvaluation() {
    if (!responseEvaluated) {
      return {
        valid: false,
        message:
          "対応を評価してください。"
      };
    }

    if (
      !checkInInput.value ||
      !checkOutInput.value
    ) {
      return {
        valid: false,
        message:
          "チェックイン・アウト時刻を入力してください。"
      };
    }

    if (
      getShuttlePoint() === null
    ) {
      return {
        valid: false,
        message:
          "送迎について選択してください。"
      };
    }

    if (
      getLuggagePoint() === null
    ) {
      return {
        valid: false,
        message:
          "荷物対応について選択してください。"
      };
    }

    return {
      valid: true,
      message: ""
    };
  }

  /* ==================================
     確定保存
  ================================== */

  function saveServiceEvaluation() {
    const responseScore =
      roundToThree(
        Number(responseInput.value)
      );

    const responsePointValue =
      getResponsePoint();

    const stayHours =
      calculateStayHours(
        checkInInput.value,
        checkOutInput.value
      );

    const stayPointValue =
      getStayTimePoint();

    const selectedShuttle =
      document.querySelector(
        'input[name="shuttle"]:checked'
      );

    const selectedLuggage =
      document.querySelector(
        'input[name="luggage"]:checked'
      );

    const shuttlePointValue =
      getShuttlePoint();

    const luggagePointValue =
      getLuggagePoint();

    const selectedExtras =
      getSelectedExtraServices();

    const extraPointValue =
      getExtraServicePoint();

    const total =
      roundToThree(
        responsePointValue +
          stayPointValue +
          shuttlePointValue +
          luggagePointValue +
          extraPointValue
      );

    const draft =
      loadDraft();

    draft.categoryScores =
      draft.categoryScores || {};

    draft.categoryDetails =
      draft.categoryDetails || {};

    draft.categoryScores.service =
      total;

    draft.categoryDetails.service = {
      response: {
        score: responseScore,
        point:
          responsePointValue
      },

      stayTime: {
        checkIn:
          checkInInput.value,

        checkOut:
          checkOutInput.value,

        hours:
          roundToThree(
            stayHours
          ),

        point:
          stayPointValue
      },

      shuttle: {
        type:
          selectedShuttle.value,

        point:
          shuttlePointValue
      },

      luggage: {
        type:
          selectedLuggage.value,

        point:
          luggagePointValue
      },

      extraServices: {
        selected:
          selectedExtras,

        count:
          selectedExtras.length,

        point:
          extraPointValue
      },

      score: total
    };

    delete draft.categoryDetails
      .serviceDraft;

    localStorage.setItem(
      storageKey,
      JSON.stringify(draft)
    );
  }

  /* ==================================
     入力途中を保存
  ================================== */

  function saveTemporaryDraft() {
    const draft =
      loadDraft();

    draft.categoryDetails =
      draft.categoryDetails || {};

    const shuttle =
      document.querySelector(
        'input[name="shuttle"]:checked'
      );

    const luggage =
      document.querySelector(
        'input[name="luggage"]:checked'
      );

    draft.categoryDetails
      .serviceDraft = {
        response: {
          value:
            responseInput.value,

          evaluated:
            responseEvaluated
        },

        checkIn:
          checkInInput.value,

        checkOut:
          checkOutInput.value,

        shuttle:
          shuttle?.value ?? "",

        luggage:
          luggage?.value ?? "",

        extraServices:
          getSelectedExtraServices()
      };

    localStorage.setItem(
      storageKey,
      JSON.stringify(draft)
    );
  }

  /* ==================================
     保存済み評価を読み込む
  ================================== */

  function loadSavedServiceEvaluation() {
    const draft =
      loadDraft();

    const saved =
      draft.categoryDetails?.service;

    const temporary =
      draft.categoryDetails
        ?.serviceDraft;

    if (saved) {
      responseInput.value =
        String(
          saved.response?.score ?? 0
        );

      responseEvaluated = true;

      checkInInput.value =
        saved.stayTime?.checkIn ??
        "15:00";

      checkOutInput.value =
        saved.stayTime?.checkOut ??
        "10:00";

      setRadioValue(
        "shuttle",
        saved.shuttle?.type
      );

      setRadioValue(
        "luggage",
        saved.luggage?.type
      );

      setExtraServices(
        saved.extraServices
          ?.selected ?? []
      );

      return;
    }

    if (temporary) {
      responseInput.value =
        temporary.response?.value ??
        "0";

      responseEvaluated =
        Boolean(
          temporary.response
            ?.evaluated
        );

      checkInInput.value =
        temporary.checkIn ??
        "15:00";

      checkOutInput.value =
        temporary.checkOut ??
        "10:00";

      setRadioValue(
        "shuttle",
        temporary.shuttle
      );

      setRadioValue(
        "luggage",
        temporary.luggage
      );

      setExtraServices(
        temporary.extraServices ??
          []
      );
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

  function setExtraServices(
    selectedValues
  ) {
    extraServiceInputs.forEach(
      (input) => {
        input.checked =
          selectedValues.includes(
            input.value
          );
      }
    );
  }

  /* ==================================
     下書き読み込み
  ================================== */

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
     時刻処理
  ================================== */

  function convertTimeToMinutes(
    time
  ) {
    if (
      typeof time !== "string" ||
      !time.includes(":")
    ) {
      return null;
    }

    const [hourText, minuteText] =
      time.split(":");

    const hours =
      Number(hourText);

    const minutes =
      Number(minuteText);

    if (
      !Number.isInteger(hours) ||
      !Number.isInteger(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return null;
    }

    return (
      hours * 60 +
      minutes
    );
  }

  function formatHours(hours) {
    const totalMinutes =
      Math.round(
        hours * 60
      );

    const wholeHours =
      Math.floor(
        totalMinutes / 60
      );

    const remainingMinutes =
      totalMinutes % 60;

    if (
      remainingMinutes === 0
    ) {
      return `${wholeHours}時間`;
    }

    return (
      `${wholeHours}時間` +
      `${remainingMinutes}分`
    );
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

  function roundToThree(
    value
  ) {
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

  function formatScore(
    value
  ) {
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