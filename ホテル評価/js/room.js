"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const storageKey = "hotelScoreMapDraft";

  const backButton =
    document.getElementById("backButton");

  const roomSizeInput =
    document.getElementById("roomSizeInput");

  const roomSizePoint =
    document.getElementById("roomSizePoint");

  const roomTotalScore =
    document.getElementById("roomTotalScore");

  const message =
    document.getElementById("roomFormMessage");

  const saveButton =
    document.getElementById("saveRoomEvaluation");

  const scoreItems = {
    cleanliness: {
      input: document.getElementById("cleanlinessInput"),
      value: document.getElementById("cleanlinessValue"),
      fill: document.getElementById("cleanlinessStarFill"),
      point: document.getElementById("cleanlinessPoint"),
      evaluated: false
    },

    bedding: {
      input: document.getElementById("beddingInput"),
      value: document.getElementById("beddingValue"),
      fill: document.getElementById("beddingStarFill"),
      point: document.getElementById("beddingPoint"),
      evaluated: false
    },

    view: {
      input: document.getElementById("viewInput"),
      value: document.getElementById("viewValue"),
      fill: document.getElementById("viewStarFill"),
      point: document.getElementById("viewPoint"),
      evaluated: false
    },

    amenity: {
      input: document.getElementById("amenityInput"),
      value: document.getElementById("amenityValue"),
      fill: document.getElementById("amenityStarFill"),
      point: document.getElementById("amenityPoint"),
      evaluated: false
    }
  };

  loadSavedEvaluation();
  updateAll();

  roomSizeInput.addEventListener(
    "input",
    updateAll
  );

  Object.entries(scoreItems).forEach(
    ([key, item]) => {
      item.input.addEventListener(
        "input",
        () => {
          item.evaluated = true;
          updateStarItem(key);
          updateTotal();
        }
      );
    }
  );

  document
    .querySelectorAll("[data-clear-score]")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          const key =
            button.dataset.clearScore;

          const item =
            scoreItems[key];

          if (!item) {
            return;
          }

          item.evaluated = false;
          item.input.value = "0";

          updateStarItem(key);
          updateTotal();
        }
      );
    });

  backButton.addEventListener(
    "click",
    () => {
      saveTemporaryDraft();
      window.location.href = "add.html";
    }
  );

  saveButton.addEventListener(
    "click",
    () => {
      clearMessage();

      const validation =
        validate();

      if (!validation.valid) {
        showMessage(
          validation.message,
          false
        );

        return;
      }

      saveEvaluation();

      showMessage(
        "客室・アメニティの評価を保存しました。",
        true
      );

      window.setTimeout(() => {
        window.location.href =
          "add.html";
      }, 300);
    }
  );

  function updateAll() {
    updateRoomSize();

    Object.keys(scoreItems)
      .forEach(updateStarItem);

    updateTotal();
  }

  function updateRoomSize() {
    const size =
      parseNumber(
        roomSizeInput.value
      );

    const point =
      size === null
        ? 0
        : calculateRoomSizePoint(
            size
          );

    roomSizePoint.textContent =
      `${formatScore(point)} / 1.000`;
  }

  function updateStarItem(key) {
    const item =
      scoreItems[key];

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
      Number(item.input.value);

    const safeScore =
      clamp(score, 0, 5);

    item.input.value =
      String(safeScore);

    item.value.textContent =
      `☆${formatScore(safeScore)}`;

    item.fill.style.width =
      `${(safeScore / 5) * 100}%`;

    item.point.textContent =
      `${formatScore(safeScore / 5)} / 1.000`;
  }

  function updateTotal() {
    const roomSize =
      parseNumber(
        roomSizeInput.value
      );

    const allStarsEvaluated =
      Object.values(scoreItems)
        .every(
          (item) =>
            item.evaluated
        );

    if (
      roomSize === null ||
      !allStarsEvaluated
    ) {
      roomTotalScore.textContent =
        "☆―.―――";

      return;
    }

    const total =
      calculateRoomSizePoint(
        roomSize
      ) +
      Object.values(scoreItems)
        .reduce(
          (sum, item) =>
            sum +
            Number(item.input.value) /
              5,
          0
        );

    roomTotalScore.textContent =
      `☆${formatScore(
        roundToThree(total)
      )}`;
  }

  function validate() {
    const roomSize =
      parseNumber(
        roomSizeInput.value
      );

    if (
      roomSize === null ||
      roomSize <= 0
    ) {
      return {
        valid: false,
        message:
          "客室の広さを入力してください。"
      };
    }

    const missing =
      Object.values(scoreItems)
        .some(
          (item) =>
            !item.evaluated
        );

    if (missing) {
      return {
        valid: false,
        message:
          "すべての星評価を入力してください。"
      };
    }

    return {
      valid: true,
      message: ""
    };
  }

  function saveEvaluation() {
    const roomSize =
      Number(roomSizeInput.value);

    const details = {};

    let total =
      calculateRoomSizePoint(
        roomSize
      );

    Object.entries(scoreItems)
      .forEach(
        ([key, item]) => {
          const score =
            roundToThree(
              Number(
                item.input.value
              )
            );

          const point =
            roundToThree(
              score / 5
            );

          details[key] = {
            score,
            point
          };

          total += point;
        }
      );

    total =
      roundToThree(total);

    const draft =
      loadDraft();

    draft.categoryScores =
      draft.categoryScores || {};

    draft.categoryDetails =
      draft.categoryDetails || {};

    draft.categoryScores.room =
      total;

    draft.categoryDetails.room = {
      roomSize,

      roomSizePoint:
        calculateRoomSizePoint(
          roomSize
        ),

      details,

      score: total
    };

    delete draft.categoryDetails.roomDraft;

    localStorage.setItem(
      storageKey,
      JSON.stringify(draft)
    );
  }

  function saveTemporaryDraft() {
    const draft =
      loadDraft();

    draft.categoryDetails =
      draft.categoryDetails || {};

    const starDraft = {};

    Object.entries(scoreItems)
      .forEach(
        ([key, item]) => {
          starDraft[key] = {
            value:
              item.input.value,

            evaluated:
              item.evaluated
          };
        }
      );

    draft.categoryDetails.roomDraft = {
      roomSize:
        roomSizeInput.value,

      stars:
        starDraft
    };

    localStorage.setItem(
      storageKey,
      JSON.stringify(draft)
    );
  }

  function loadSavedEvaluation() {
    const draft =
      loadDraft();

    const saved =
      draft.categoryDetails?.room;

    const temporary =
      draft.categoryDetails?.roomDraft;

    if (saved) {
      roomSizeInput.value =
        saved.roomSize ?? "";

      Object.entries(scoreItems)
        .forEach(
          ([key, item]) => {
            const savedItem =
              saved.details?.[key];

            if (!savedItem) {
              return;
            }

            item.input.value =
              String(
                savedItem.score
              );

            item.evaluated = true;
          }
        );

      return;
    }

    if (temporary) {
      roomSizeInput.value =
        temporary.roomSize ?? "";

      Object.entries(scoreItems)
        .forEach(
          ([key, item]) => {
            const savedItem =
              temporary.stars?.[key];

            if (!savedItem) {
              return;
            }

            item.input.value =
              savedItem.value ?? "0";

            item.evaluated =
              Boolean(
                savedItem.evaluated
              );
          }
        );
    }
  }

  function calculateRoomSizePoint(
    squareMeters
  ) {
    if (squareMeters < 20) {
      return 0.2;
    }

    if (squareMeters < 40) {
      return 0.4;
    }

    if (squareMeters < 60) {
      return 0.6;
    }

    if (squareMeters < 80) {
      return 0.8;
    }

    return 1;
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

      return JSON.parse(saved) || {};
    } catch (error) {
      console.error(
        "下書きを読み込めませんでした。",
        error
      );

      return {};
    }
  }

  function parseNumber(value) {
    if (
      String(value).trim() === ""
    ) {
      return null;
    }

    const number =
      Number(value);

    return Number.isFinite(number)
      ? number
      : null;
  }

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