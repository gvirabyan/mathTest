<template>
  <f7-page
    class="hg-question-page"
    name="player-vs-machine"
    @page:beforein="getQuizQuestionsHandler(quizMode.questions, quizRivalType)"
    @page:afterout="clearStore"
  >
    <leave-page-popup
      v-if="leavePopupPageText"
      :text="leavePopupPageText"
      :save-btn="$t('practice.leave-page-popup.stay')"
      @leave-changes="leavePage"
      @save-changes="leavePopupPageText = ''"
      @close="leavePopupPageText = ''"
    />

    <leave-page-popup
      v-if="finishGame"
      :title="finishGame"
      :text="finishGameText"
      :save-btn="$t('practice.finish-game-popup.save-btn-text')"
      :leave-btn="$t('practice.finish-game-popup.leave-btn-text')"
      @leave-changes="goMyStatus"
      @save-changes="closeFinishPopup"
      @close="closeFinishPopup"
    />

    <success-message-popup
      v-if="!isRivalAvailable"
      :title="$t('practice.no-players-popup.title')"
      :text="$t('practice.no-players-popup.text')"
      :btn-text="$t('practice.no-players-popup.go-to-practice')"
      @close="f7router.navigate('/practice/')"
    />

    <success-message-popup
      v-if="isLeftByRival"
      :title="$t('practice.left-by-rival-popup.title')"
      :text="$t('practice.left-by-rival-popup.text')"
      :btn-text="$t('buttons.ok')"
      @close="closeLeftGameByRivalPopup"
    />

    <success-message-popup
      v-if="!isLoading && !isTimerRunning && quizQuestions.length < quizMode?.questions"
      :title="$t('practice.popup-go-topic.Oops')"
      :text="`${$t('practice.popup-go-topic.first-text')} ${quizMode.questions} ${$t(
        'practice.popup-go-topic.second-text',
      )}`"
      :btn-text="$t('practice.popup-go-topic.go-to-topics')"
      @close="f7router.navigate('/topics/')"
    />

    <div class="navbar players-machine">
      <div class="navbar-inner">
        <div class="left">
          <a href="#" class="link icon-only" @click="breakQuiz">
            <img src="@/assets/icons/arrow-right.svg" alt="" />
          </a>
        </div>

        <div class="title">{{ practiceTitle }}</div>
      </div>
    </div>

    <div
      v-if="quizQuestions?.length >= quizMode?.questions && isRivalAvailable"
      ref="circles"
      class="circles machine-player-circle"
    >
      <Circle
        v-for="point in getPoints"
        :key="point.point"
        :point="point.point"
        :status="point.status"
        :present="!!point.present"
      />
    </div>

    <template v-if="!isLoading && !isTimerRunning && quizQuestions?.length >= quizMode?.questions">
      <f7-row class="scores-block">
        <f7-block class="my-score">
          <span class="nickname">{{ userScoreTitle }}</span
          >&nbsp;
          <span>{{ userScore }}</span>
        </f7-block>

        <f7-block class="machine-score">
          <span class="nickname">{{ rivalScoreTitle }}</span
          >&nbsp;
          <span>{{ rivalScore }}</span>
        </f7-block>

        <p class="rival-state width-100 text-align-center">{{ rivalStateText }}</p>
      </f7-row>

      <f7-block v-if="quizQuestion" class="player-machine-questions-content">
        <div>
          <f7-block-title>
            <math-jax :latex="'\\Large \\sf' + quizQuestion?.question" :block="true" />
          </f7-block-title>

          <div class="list-wrapper">
            <f7-list class="m-0">
              <f7-list-item
                v-for="(answer, index) in answersData"
                :key="index"
                :checked="chosenQuizAnswer === answer"
                :disabled="isAnswerSent && isRivalAnswerSent"
                :class="{
                  'hg-correct-rival-answer':
                    isAnswerSent &&
                    isRivalAnswerSent &&
                    String(quizQuestion.rival_answer) === quizQuestion.answer &&
                    answer === quizQuestion.answer,
                  'hg-wrong-rival-answer':
                    isAnswerSent &&
                    isRivalAnswerSent &&
                    String(quizQuestion.rival_answer) !== quizQuestion.answer &&
                    answer === String(quizQuestion.rival_answer),
                }"
                name="demo-radio-end"
                radio
                @change="chooseQuizAnswer(answer, index)"
              >
                <f7-col
                  :class="{
                    'hg-selected-answer': chosenQuizAnswer === (typeof answer === 'string' ? answer : String(answer)),
                    'hg-correct-answer': isAnswerSent && isRivalAnswerSent && quizQuestion?.answer === answer,
                    'hg-wrong-answer':
                      isAnswerSent &&
                      isRivalAnswerSent &&
                      chosenQuizAnswerIndex === index &&
                      quizQuestion?.answer !== answer,
                  }"
                >
                  <span class="list-number">{{ `${getLetterByIndex(index)}.` }}</span>
                  <math-jax :latex="'\\sf' + answer"></math-jax>
                </f7-col>
              </f7-list-item>
            </f7-list>
          </div>
        </div>
        <div class="hg-actions-btns-content">
          <f7-row v-if="notAllAnswersAreSent">
            <!--            <f7-button class="button button-large button-skip" :disabled="areSkipSendButtonsDisabled" @click="skip">-->
            <!--              {{ $t("buttons.wrong-answer") }}-->
            <!--            </f7-button>-->

            <f7-button
              class="button button-large button-submit"
              :disabled="areSkipSendButtonsDisabled"
              @click="sendAnswer"
            >
              {{ $t("buttons.send") }}
            </f7-button>
          </f7-row>

          <f7-button v-else-if="allAnswersAreSent" class="button button-large button-next" @click="next">
            {{ $t("buttons.next") }}
          </f7-button>
        </div>
      </f7-block>

      <f7-block v-else-if="allQuizQuestionAnswered">{{ $t("practice.answered-all-text") }}</f7-block>
    </template>

    <loading-small v-else-if="isLoading && !isTimerRunning">
      <template v-if="quizRivalType !== 'machine'">{{ $t("practice.practice-with-friends-load") }}</template>
    </loading-small>

    <transition v-else-if="!isLoading && isTimerRunning">
      <div class="timer-wrapper">
        <custom-gauge
          :width="customGaugeOptions.width"
          :height="customGaugeOptions.height"
          :radius="customGaugeOptions.radius"
          :stroke-width="customGaugeOptions.strokeWidth"
          :percent="25 * timerValue"
          color="#8419FF"
        >
          <template #amount>{{ timerValue }}</template>
        </custom-gauge>
      </div>
    </transition>

    <teleport v-if="isAnswerSent && !isRivalAnswerSent" to=".list-wrapper">
      <div class="rival-loader">
        <div class="loader-circle"></div>
      </div>
    </teleport>
  </f7-page>
</template>

<script setup>
import { f7 } from "framework7-vue";
import { defineAsyncComponent, ref, watch, computed, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/js/stores/auth";
import { useCategoryAnswerStore } from "@/js/stores/category-answer";
import { useQuizStore } from "@/js/stores/quiz";
import delay from "@/js/helpers/delay";
import playAudioMixin from "@/js/mixins/play_audio";
import LoadingSmall from "@/components/loading-small.vue";

const LeavePagePopup = defineAsyncComponent(() => import("@/components/leave-page-popup.vue"));
const SuccessMessagePopup = defineAsyncComponent(() => import("@/components/success-message-popup.vue"));
const Circle = defineAsyncComponent(() => import("@/components/circle.vue"));
const CustomGauge = defineAsyncComponent(() => import("@/components/custom-gauge.vue"));

const i18n = useI18n();

const props = defineProps({
  f7router: { type: Object, default: () => {} },
  f7route: { type: Object, default: () => {} },
});

const { playAudio } = playAudioMixin.setup();
const { user } = storeToRefs(useAuthStore());
const { answersData } = storeToRefs(useCategoryAnswerStore());
const {
  quizQuestions,
  quizQuestion,
  quizQuestionIndex,
  quizRivalType,
  quizRivalPlayer,
  quizQuestionsLength,
  currentQuizQuestionId,
  answeredQuizQuestions,
  quizMode,
  userScore,
  rivalScore,
  lastFriendPractice,
} = storeToRefs(useQuizStore());
const { updateUserAnsweredQuestions } = useCategoryAnswerStore();
const {
  getQuizQuestions,
  getNextQuizQuestion,
  updateAnsweredQuizQuestions,
  updateUserScore,
  updateRivalScore,
  saveQuizResult,
  clearStore,
} = useQuizStore();

const customGaugeOptions = {
  width: 186,
  height: 186,
  radius: 93,
  strokeWidth: 10,
};

const isLoading = ref(false);
const chosenQuizAnswer = ref(null);
const chosenQuizAnswerIndex = ref(0);
const presentIndex = ref(0);
const getPoints = ref([]);
const circles = ref(null);
const status = ref("normal");
const finishGameText = ref("");
const leavePopupPageText = ref("");
const isSending = ref(false);
const isAnswerSent = ref(false);
const isRivalAnswerSent = ref(false);
const finishGame = ref("");
const rivalAnswerDelayRefreshKey = ref(0);
const isTimerRunning = ref(false);
const timerValue = ref(4);
const isRivalAvailable = ref(true);
const isLeftByRival = ref(false);

const allQuizQuestionAnswered = computed(
  () =>
    quizQuestions?.value?.length &&
    quizQuestionsLength?.value === answeredQuizQuestions?.value?.length &&
    isAnswerSent.value &&
    isRivalAnswerSent.value,
);
const practiceTitle = computed(() =>
  quizRivalType.value !== "machine" ? i18n.t("practice.play-with-friends") : i18n.t("practice.player-vs-machine"),
);
const userScoreTitle = computed(() =>
  quizRivalType.value !== "machine" ? `${user.value.username}:` : i18n.t("practice.your-score"),
);
const rivalScoreTitle = computed(() =>
  quizRivalType.value !== "machine" ? `${quizRivalPlayer.value.username}:` : i18n.t("practice.machine-score"),
);
const questionHandlerDelay = computed(() => {
  if (quizRivalType.value === "machine") return;

  const minMs = 5000;
  const maxMs = 20000;

  return Math.floor(Math.random() * (maxMs - minMs + 1) + minMs);
});
const rivalAnswerDelay = computed(() => {
  if (quizRivalType.value === "machine") {
    return 0;
  }

  rivalAnswerDelayRefreshKey.value;

  const maxMs = 10000;
  const randomMs = Math.trunc(((Math.random() * 9 + 1) / quizRivalPlayer.value.coefficient) * 1000);

  return randomMs < maxMs ? randomMs : maxMs;
});
const rivalStateText = computed(() => {
  if (quizRivalType.value === "machine") return "";

  return isRivalAnswerSent.value ? "" : `${quizRivalPlayer.value.username} ${i18n.t("practice.friend-think")}`;
});
const allAnswersAreSent = computed(() => isAnswerSent.value && isRivalAnswerSent.value);
const notAllAnswersAreSent = computed(() => !isAnswerSent.value || !isRivalAnswerSent.value);
const areSkipSendButtonsDisabled = computed(() => !chosenQuizAnswer.value || isSending.value || isAnswerSent.value);
const currentBerlinTime = computed(() => {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .format(new Date())
    .split(" ")[1];
});

const getLetterByIndex = index => {
  const letterCode = "a".charCodeAt(0) + index;
  return String.fromCharCode(letterCode);
};

const checkAvailability = () => {
  if (currentBerlinTime.value >= "00:00:00" && currentBerlinTime.value < "06:00:00") {
    isRivalAvailable.value = Math.random() >= 0.9;
    return;
  }

  if (currentBerlinTime.value >= "06:00:00" && currentBerlinTime.value < "08:00:00") {
    isRivalAvailable.value = Math.random() >= 0.75;
    return;
  }

  if (currentBerlinTime.value >= "08:00:00" && currentBerlinTime.value < "13:00:00") {
    isRivalAvailable.value = Math.random() >= 0.4;
    return;
  }

  if (currentBerlinTime.value >= "13:00:00" && currentBerlinTime.value < "19:00:00") {
    isRivalAvailable.value = Math.random() >= 0.2;
    return;
  }

  if (currentBerlinTime.value >= "13:00:00" && currentBerlinTime.value < "19:00:00") {
    isRivalAvailable.value = Math.random() >= 0.2;
    return;
  }

  if (currentBerlinTime.value >= "19:00:00" && currentBerlinTime.value < "21:00:00") {
    isRivalAvailable.value = Math.random() >= 0.6;
    return;
  }

  if (currentBerlinTime.value >= "21:00:00" && currentBerlinTime.value < "23:59:00") {
    isRivalAvailable.value = Math.random() >= 0.75;
    return;
  }

  return true;
};

const runTimer = () => {
  playAudio("achtung_short");
  isTimerRunning.value = true;

  const interval = setInterval(() => {
    timerValue.value--;

    if (timerValue.value === 0) {
      clearInterval(interval);
      isTimerRunning.value = false;
    }
  }, 1000);
};

const getQuizQuestionsHandler = async (limit, rivalType) => {
  isLoading.value = true;

  await delay(questionHandlerDelay.value);
  await getQuizQuestions(limit, rivalType);

  if (quizRivalType.value !== "machine") {
    checkAvailability();

    if (!isRivalAvailable.value) {
      return;
    }
  }

  isLoading.value = false;

  if (quizRivalType.value !== "machine") {
    runTimer();
  }
};

const chooseQuizAnswer = (answer, index) => {
  chosenQuizAnswer.value = typeof answer === "string" ? answer : String(answer);
  chosenQuizAnswerIndex.value = index;
};

const closeFinishPopup = () => {
  finishGame.value = "";
  props.f7router.navigate("/practice/");
};

const sendAnswer = () => {
  if (chosenQuizAnswer.value) {
    isSending.value = true;
    status.value = quizQuestion.value.answer === chosenQuizAnswer.value ? "correct" : "wrong";

    if (quizRivalType.value === "machine") {
      // updateRivalScore(quizQuestion.value.rival_answer);
      isRivalAnswerSent.value = true;
    }

    isSending.value = false;
    isAnswerSent.value = true;

    updateAnsweredQuizQuestions(quizQuestion.value.id);
    updateUserAnsweredQuestions({
      users_permissions_user: user.value.id,
      question: quizQuestion.value.id,
      category: quizQuestion.value.category,
      answer: chosenQuizAnswer.value,
      answer_type: "practice-vs-machine",
      status: status.value,
    }).then(resp => {
      if (resp.status !== "success" && resp.error.status !== 500) {
        f7.toast.show({
          text: resp.message,
          closeButton: true,
        });
      }
    });
  }
};

const sendRivalAnswer = () => {
  setTimeout(() => {
    // updateRivalScore(quizQuestion.value?.rival_answer);
    isRivalAnswerSent.value = true;
  }, rivalAnswerDelay.value);
};

const clearChosenData = () => {
  chosenQuizAnswer.value = null;
  chosenQuizAnswerIndex.value = null;
  isSending.value = false;
  isAnswerSent.value = false;
  isRivalAnswerSent.value = false;
};

const skip = () => {
  isSending.value = true;

  updateUserScore("skipped");

  // if (quizRivalType.value === "machine") {
  //   updateRivalScore(quizQuestion.value.rival_answer);
  // }

  isSending.value = false;
  isAnswerSent.value = true;
  isRivalAnswerSent.value = true;
  status.value = "wrong";

  updateAnsweredQuizQuestions(quizQuestion.value.id);
  playAudio("wrong");
};

const next = () => {
  clearChosenData();
  getPoints.value[presentIndex.value].status = status.value;
  getPoints.value[presentIndex.value].present = false;
  ++presentIndex.value;

  if (presentIndex.value < getPoints.value.length) {
    getPoints.value[presentIndex.value].present = true;
  }

  if (
    circles.value.children[presentIndex.value] &&
    circles.value.clientWidth / 2 - 16 < circles.value.children[presentIndex.value].getBoundingClientRect().left - 24
  ) {
    circles.value.scrollLeft +=
      circles.value.children[presentIndex.value].getBoundingClientRect().left - 2 - circles.value.clientWidth / 2;
  }

  getNextQuizQuestion();
};

const goMyStatus = () => {
  props.f7router.navigate("/activity/");
};

const onOrientationChange = () => {
  if (
    circles.value.children[presentIndex.value] &&
    circles.value.clientWidth / 2 !== circles.value.children[presentIndex.value].getBoundingClientRect().left - 2
  ) {
    circles.value.scrollLeft +=
      circles.value.children[presentIndex.value].getBoundingClientRect().left - 2 - circles.value.clientWidth / 2;
  }
};

const endQuiz = () => {
  const alertTextObj = {
    win: {
      title: i18n.t("practice.finish-game-popup.win.title"),
      text: `${i18n.t("practice.finish-game-popup.win.text")} ${quizMode.value.winPoints} ${i18n.t("over.points")}`,
    },
    draw: {
      title: i18n.t("practice.finish-game-popup.draw.title"),
      text: `${i18n.t("practice.finish-game-popup.draw.text")} ${quizMode.value.drawPoints} ${i18n.t("over.points")}`,
    },
    lose: {
      title: i18n.t("practice.finish-game-popup.lose.title"),
      text: `${i18n.t("practice.finish-game-popup.lose.text")} ${quizMode.value.losePoints} ${i18n.t("over.points")}`,
    },
  };

  saveQuizResult({
    user_score: userScore.value,
    rival_score: rivalScore.value,
    mode: quizMode.value,
    rival_type: quizRivalType.value,
    ...(quizRivalPlayer.value && quizRivalPlayer.value.id && { rival_id: quizRivalPlayer.value.id }),
  }).then(({ data }) => {
    const result = data?.attributes?.result;

    if (result) {
      playAudio(result);
    }

    if (quizRivalType.value !== "machine") {
      lastFriendPractice.value.firstPlayer.nickname = user.value.username;
      lastFriendPractice.value.firstPlayer.score =
        result === "win"
          ? quizMode.value.winPoints
          : result === "lose"
          ? quizMode.value.losePoints
          : quizMode.value.drawPoints;
      lastFriendPractice.value.firstPlayer.rightAnswers = userScore.value;
      lastFriendPractice.value.firstPlayer.result = result;
      lastFriendPractice.value.secondPlayer.nickname = quizRivalPlayer.value.username;
      lastFriendPractice.value.secondPlayer.score =
        result === "win"
          ? quizMode.value.losePoints
          : result === "lose"
          ? quizMode.value.winPoints
          : quizMode.value.drawPoints;
      lastFriendPractice.value.secondPlayer.rightAnswers = rivalScore.value;
      lastFriendPractice.value.secondPlayer.result = result === "win" ? "lose" : result === "lose" ? "win" : "draw";
      lastFriendPractice.value.mode.questions = quizMode.value.questions;
    }

    finishGame.value = result && alertTextObj[result].title;
    finishGameText.value = result && alertTextObj[result].text;
  });
};

const breakQuiz = () => {
  leavePopupPageText.value = `${i18n.t("practice.leave-page-popup.first-text")} ${Math.abs(
    quizMode.value.losePoints,
  )} ${i18n.t("over.points")}`;
};

const leavePage = async () => {
  await saveQuizResult({
    user_score: userScore.value,
    rival_score: rivalScore.value,
    mode: quizMode.value,
    result: "lose",
    rival_type: quizRivalType.value,
    ...(quizRivalPlayer.value && quizRivalPlayer.value.id && { rival_id: quizRivalPlayer.value.id }),
  }).then(() => {
    useQuizStore().$reset();
    leavePopupPageText.value = "";
    props.f7router.navigate("/");
  });
};

const leftGameByRivalHandler = () => {
  if (Math.random() > 0.1) return;

  isLeftByRival.value = true;
};

const closeLeftGameByRivalPopup = async () => {
  await saveQuizResult({
    user_score: userScore.value,
    rival_score: rivalScore.value,
    mode: quizMode.value,
    result: "win",
    rival_type: quizRivalType.value,
    ...(quizRivalPlayer.value && quizRivalPlayer.value.id && { rival_id: quizRivalPlayer.value.id }),
  }).then(() => {
    playAudio("win");

    lastFriendPractice.value.firstPlayer.nickname = user.value.username;
    lastFriendPractice.value.firstPlayer.score = quizMode.value.winPoints;
    lastFriendPractice.value.firstPlayer.rightAnswers = userScore.value;
    lastFriendPractice.value.firstPlayer.result = "win";
    lastFriendPractice.value.secondPlayer.nickname = quizRivalPlayer.value.username;
    lastFriendPractice.value.secondPlayer.score = quizMode.value.losePoints;
    lastFriendPractice.value.secondPlayer.rightAnswers = rivalScore.value;
    lastFriendPractice.value.secondPlayer.result = "lose";
    lastFriendPractice.value.mode.questions = quizMode.value.questions;

    props.f7router.navigate("/practice/");
  });
};

watch(
  () => quizQuestions.value,
  () => {
    getPoints.value = quizQuestions.value.map((q, i) => {
      return {
        id: q.id,
        answer: q.answer,
        point: i + 1,
        status: "normal",
        present: i === 0,
      };
    });
  },
);

watch(currentQuizQuestionId, value => {
  if (quizRivalType.value === "machine" || !value) return;

  rivalAnswerDelayRefreshKey.value++;
  sendRivalAnswer();
});

watch(allAnswersAreSent, value => {
  if (!value) return;

  playAudio(status.value);
  updateUserScore(chosenQuizAnswer.value);
  updateRivalScore(quizQuestion.value.rival_answer);
});

watch(allQuizQuestionAnswered, val => {
  if (!val) {
    return false;
  }

  endQuiz();
});

watch(quizQuestionIndex, value => {
  const middleIndex = quizQuestionsLength.value / 2;

  if (quizRivalType.value === "machine" || value !== middleIndex) return;

  leftGameByRivalHandler();
});

onMounted(() => {
  window.addEventListener("resize", onOrientationChange);
});

onUnmounted(() => {
  window.removeEventListener("resize", onOrientationChange);
});
</script>

<style lang="scss">
@import "../assets/scss/pages/question";
</style>
