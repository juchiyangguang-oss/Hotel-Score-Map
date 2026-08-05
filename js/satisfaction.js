"use strict";

/* ==================================
   Hotel Score Map
   満足度評価
================================== */

document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY =
    "hotelScoreMapDraft";

  /* ==================================
     HTML要素
  ================================== */

  const backButton =
    document.getElementById(
      "backButton"
    );

  const satisfactionTotalScore =
    document.getElementById(
      "satisfactionTotalScore"
    );

  const message =
    document.getElementById(
      "satisfactionFormMessage"
    );

  const saveButton =
    document.getElementById(
      "saveSatisfactionEvaluation"
    );

  /* ==================================
     星評価項目
  ================================== */

  const scoreItems = {
    basic: {
      name:
        "根本的な満足度",

      input:
        document.getElementById(
          "basicSatisfactionInput"
        ),

      value:
        document.getElementById(
          "basicSatisfactionValue"
        ),

      fill:
        document.getElementById(
          "basicSatisfactionStarFill"
        ),

      point:
        document.getElementById(
          "basicSatisfactionPoint"
        ),

      evaluated:
        false
    },

    comfort: {
      name:
        "快適さ",

      input:
        document.getElementById(
          "comfortInput"
        ),

      value:
        document.getElementById(
          "comfortValue"
        ),

      fill:
        document.getElementById(
          "comfortStarFill"
        ),

      point:
        document.getElementById(
          "comfortPoint"
        ),

      evaluated:
        false
    }
  };

  /* ==================================
     初期処理
  ================================== */

  loadSavedSatisfactionEvaluation();
  updateAll();

  /* ==================================
     星スライダー操作
  ================================== */

  Object.entries(
    scoreItems
  ).forEach(
    ([key, item]) => {
      item.input.addEventListener(
        "input",
        () => {
          item.evaluated =
            true;

          updateScoreItem(
            key
          );

          updateTotalScore();
        }
      );
    }
  );

  /* ==================================
     未評価へ戻す
  ================================== */

  document
    .querySelectorAll(
      "[data-clear-score]"
    )
    .forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            const key =
              button.dataset
                .clearScore;

            const item =
              scoreItems[key];

            if (!item) {
              return;
            }

            item.evaluated =
              false;

            item.input.value =
              "0";

            updateScoreItem(
              key
            );

            updateTotalScore();
          }
        );
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
        validateSatisfactionEvaluation();

      if (
        !validation.valid
      ) {
        showMessage(
          validation.message,
          false
        );

        return;
      }

      saveSatisfactionEvaluation();

      showMessage(
        "満足度の評価を保存しました。",
        true
      );

      window.setTimeout(
        () => {
          window.location.href =
            "add.html";
        },
        300
      );
    }
  );

  /* ==================================
     全体更新
  ================================== */

  function updateAll() {
    Object.keys(
      scoreItems
    ).forEach(
      updateScoreItem
    );

    updateTotalScore();
  }

  /* ==================================
     各項目表示
  ================================== */

  function updateScoreItem(
    key
  ) {
    const item =
      scoreItems[key];

    if (
      !item.evaluated
    ) {
      item.value.textContent =
        "未評価";

      item.fill.style.width =
        "0%";

      item.point.textContent =
        "0.000 / 2.500";

      return;
    }

    const score =
      clamp(
        Number(
          item.input.value
        ),
        0,
        5
      );

    item.input.value =
      String(score);

    /*
      0〜5の入力を
      2.500点満点へ換算。

      score ÷ 5 × 2.5
      ＝ score ÷ 2
    */

    const point =
      roundToThree(
        score / 2
      );

    item.value.textContent =
      `☆${formatScore(
        score
      )}`;

    item.fill.style.width =
      `${(score / 5) * 100}%`;

    item.point.textContent =
      `${formatScore(
        point
      )} / 2.500`;
  }

  function getItemPoint(
    key
  ) {
    const item =
      scoreItems[key];

    if (
      !item.evaluated
    ) {
      return null;
    }

    return roundToThree(
      Number(
        item.input.value
      ) / 2
    );
  }

  /* ==================================
     合計
  ================================== */

  function calculateSatisfactionScore() {
    const basicPoint =
      getItemPoint(
        "basic"
      );

    const comfortPoint =
      getItemPoint(
        "comfort"
      );

    if (
      basicPoint === null ||
      comfortPoint === null
    ) {
      return null;
    }

    return roundToThree(
      basicPoint +
      comfortPoint
    );
  }

  function updateTotalScore() {
    const total =
      calculateSatisfactionScore();

    if (
      total === null
    ) {
      satisfactionTotalScore
        .textContent =
        "☆―.―――";

      return;
    }

    satisfactionTotalScore
      .textContent =
      `☆${formatScore(
        total
      )}`;
  }

  /* ==================================
     入力確認
  ================================== */

  function validateSatisfactionEvaluation() {
    for (
      const item of
      Object.values(
        scoreItems
      )
    ) {
      if (
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

  function saveSatisfactionEvaluation() {
    const basicScore =
      roundToThree(
        Number(
          scoreItems.basic
            .input.value
        )
      );

    const comfortScore =
      roundToThree(
        Number(
          scoreItems.comfort
            .input.value
        )
      );

    const basicPoint =
      getItemPoint(
        "basic"
      );

    const comfortPoint =
      getItemPoint(
        "comfort"
      );

    const total =
      calculateSatisfactionScore();

    const draft =
      loadDraft();

    draft.categoryScores =
      draft.categoryScores ||
      {};

    draft.categoryDetails =
      draft.categoryDetails ||
      {};

    draft.categoryScores
      .satisfaction =
      total;

    draft.categoryDetails
      .satisfaction = {
        basic: {
          score:
            basicScore,

          point:
            basicPoint
        },

        comfort: {
          score:
            comfortScore,

          point:
            comfortPoint
        },

        score:
          total
      };

    delete draft
      .categoryDetails
      .satisfactionDraft;

    saveDraft(
      draft
    );
  }

  /* ==================================
     入力途中保存
  ================================== */

  function saveTemporaryDraft() {
    const draft =
      loadDraft();

    draft.categoryDetails =
      draft.categoryDetails ||
      {};

    const items = {};

    Object.entries(
      scoreItems
    ).forEach(
      ([key, item]) => {
        items[key] = {
          value:
            item.input.value,

          evaluated:
            item.evaluated
        };
      }
    );

    draft.categoryDetails
      .satisfactionDraft = {
        items
      };

    saveDraft(
      draft
    );
  }

  /* ==================================
     保存済み内容の読み込み
  ================================== */

  function loadSavedSatisfactionEvaluation() {
    const draft =
      loadDraft();

    const saved =
      draft.categoryDetails
        ?.satisfaction;

    const temporary =
      draft.categoryDetails
        ?.satisfactionDraft;

    if (saved) {
      setScoreItem(
        "basic",
        saved.basic?.score,
        true
      );

      setScoreItem(
        "comfort",
        saved.comfort?.score,
        true
      );

      return;
    }

    if (temporary) {
      Object.keys(
        scoreItems
      ).forEach(
        (key) => {
          const savedItem =
            temporary.items?.[
              key
            ];

          if (
            !savedItem
          ) {
            return;
          }

          setScoreItem(
            key,
            savedItem.value,
            savedItem.evaluated
          );
        }
      );
    }
  }

  function setScoreItem(
    key,
    score,
    evaluated
  ) {
    const item =
      scoreItems[key];

    if (!item) {
      return;
    }

    item.input.value =
      String(
        score ?? 0
      );

    item.evaluated =
      Boolean(
        evaluated
      );
  }

  /* ==================================
     下書き保存・読み込み
  ================================== */

  function saveDraft(
    draft
  ) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        draft
      )
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
        JSON.parse(
          saved
        );

      return (
        parsed &&
        typeof parsed ===
          "object"
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
      ) /
      1000
    );
  }

  function formatScore(
    value
  ) {
    return Number(
      value
    ).toFixed(3);
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
    message.textContent =
      "";

    message.classList.remove(
      "success"
    );
  }
});