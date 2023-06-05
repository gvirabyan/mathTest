<template>
  <f7-page
    class="hg-question-page"
    name="player-vs-machine"
    @page:beforein="getQuizQuestionsHandler(quizMode.questions, quizRivalType)"
    @page:afterout="useQuizStore().$reset()"
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
      v-if="!isLoading && quizQuestions.length < quizMode?.questions"
      :title="$t('practice.popup-go-topic.Oops')"
      :text="`${$t('practice.popup-go-topic.first-text')} ${quizMode.questions} ${$t(
        'practice.popup-go-topic.second-text',
      )}`"
      :btn-text="$t('practice.popup-go-topic.go-to-topics')"
      @close="closeEmptyPopup"
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

    <div v-if="quizQuestions?.length >= quizMode?.questions" ref="circles" class="circles machine-player-circle">
      <Circle
        v-for="point in getPoints"
        :key="point.point"
        :point="point.point"
        :status="point.status"
        :present="!!point.present"
      />
    </div>

    <template v-if="!isLoading && quizQuestions?.length >= quizMode?.questions">
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
      </f7-row>

      <f7-block v-if="quizQuestion" class="player-machine-questions-content">
        <div>
          <f7-block-title>
            <math-jax :latex="'\\Large \\sf' + quizQuestion?.question" :block="true"></math-jax>
          </f7-block-title>

          <f7-list>
            <f7-list-item
              v-for="(answer, index) in answersData"
              :key="index"
              :checked="chosenQuizAnswer === answer"
              :disabled="!!sentAnswer"
              :class="{
                'hg-correct-rival-answer':
                  sentAnswer &&
                  String(quizQuestion.rival_answer) === quizQuestion.answer &&
                  answer === quizQuestion.answer,
                'hg-wrong-rival-answer':
                  sentAnswer &&
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
                  'hg-correct-answer': sentAnswer && quizQuestion?.answer === answer,
                  'hg-wrong-answer': sentAnswer && chosenQuizAnswerIndex === index && quizQuestion?.answer !== answer,
                }"
              >
                <span class="list-number">{{ `${getLetterByIndex(index)}.` }}</span>
                <math-jax :latex="'\\sf' + answer"></math-jax>
              </f7-col>
            </f7-list-item>
          </f7-list>
        </div>
        <div class="hg-actions-btns-content">
          <f7-row v-if="!sentAnswer">
            <f7-button class="button button-large button-skip" :disabled="isSending" @click="skip">{{
              $t("buttons.wrong-answer")
            }}</f7-button>

            <f7-button
              class="button button-large button-submit"
              :class="{ 'btn-disable': !chosenQuizAnswer || isSending }"
              @click="sendAnswer"
              >{{ $t("buttons.send") }}</f7-button
            >
          </f7-row>

          <f7-button v-else class="button button-large button-next" @click="next">{{ $t("buttons.next") }}</f7-button>
        </div>
      </f7-block>

      <f7-block v-else-if="allQuizQuestionAnswered">{{ $t("practice.answered-all-text") }}</f7-block>
    </template>

    <loading-small v-else>
      <template v-if="quizRivalType !== 'machine'">{{ $t("practice.practice-with-friends-load") }}</template>
    </loading-small>
  </f7-page>
</template>

<script setup>
import { f7 } from "framework7-vue";
import { ref, computed, watch, onMounted, onUnmounted, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/js/stores/auth";
import { useCategoryAnswerStore } from "@/js/stores/category-answer";
import { useQuizStore } from "@/js/stores/quiz";
import delay from "@/js/helpers/delay";
import LoadingSmall from "@/components/loading-small.vue";

const LeavePagePopup = defineAsyncComponent(() => import("@/components/leave-page-popup.vue"));
const SuccessMessagePopup = defineAsyncComponent(() => import("@/components/success-message-popup.vue"));
const Circle = defineAsyncComponent(() => import("@/components/circle.vue"));

const i18n = useI18n();

const props = defineProps({
  f7router: { type: Object, default: () => {} },
  f7route: { type: Object, default: () => {} },
});

const { user } = storeToRefs(useAuthStore());
const { answersData } = storeToRefs(useCategoryAnswerStore());
const {
  quizQuestions,
  quizQuestion,
  quizRivalType,
  quizRivalId,
  quizRivalUsername,
  quizQuestionsLength,
  answeredQuizQuestions,
  quizMode,
  userScore,
  rivalScore,
} = storeToRefs(useQuizStore());
const { updateUserAnsweredQuestions } = useCategoryAnswerStore();
const { getQuizQuestions, getNextQuizQuestion, updateAnsweredQuizQuestions, updateScore, saveQuizResult } =
  useQuizStore();

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
const sentAnswer = ref(false);
const finishGame = ref("");

const allQuizQuestionAnswered = computed(
  () => quizQuestions?.value?.length && quizQuestionsLength?.value === answeredQuizQuestions?.value?.length,
);
const practiceTitle = computed(() =>
  quizRivalType.value !== "machine" ? i18n.t("practice.player-vs-friend") : i18n.t("practice.player-vs-machine"),
);
const userScoreTitle = computed(() =>
  quizRivalType.value !== "machine" ? `${user.value.username}:` : i18n.t("practice.your-score"),
);
const rivalScoreTitle = computed(() =>
  quizRivalType.value !== "machine" ? `${quizRivalUsername.value}:` : i18n.t("practice.machine-score"),
);
const questionHandlerDelay = computed(() => (quizRivalType.value !== "machine" ? 2000 : 0));

const getLetterByIndex = index => {
  const letterCode = "a".charCodeAt(0) + index;
  return String.fromCharCode(letterCode);
};

const getQuizQuestionsHandler = async (limit, rivalType) => {
  isLoading.value = true;

  await delay(questionHandlerDelay.value);
  await getQuizQuestions(limit, rivalType);

  isLoading.value = false;
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
    updateScore(chosenQuizAnswer.value, quizQuestion.value.rival_answer);

    updateUserAnsweredQuestions({
      users_permissions_user: user.value.id,
      question: quizQuestion.value.id,
      category: quizQuestion.value.category,
      answer: chosenQuizAnswer.value,
      answer_type: "practice-vs-machine",
      status: status.value,
    }).then(resp => {
      isSending.value = false;
      sentAnswer.value = true;

      if (resp.status !== "success") {
        chosenQuizAnswer.value = null;

        f7.toast.show({
          text: resp.message,
          closeButton: true,
        });
      }
    });
  }
  if (quizQuestions.value.length - Number(presentIndex.value) === 1) {
    endQuiz();
  }
};

const closeEmptyPopup = () => {
  props.f7router.navigate("/topics/");
};

const clearChosenData = () => {
  chosenQuizAnswer.value = null;
  chosenQuizAnswerIndex.value = null;
  isSending.value = false;
  sentAnswer.value = false;
};

const skip = () => {
  isSending.value = true;
  updateScore("skipped", quizQuestion.value.rival_answer);
  isSending.value = false;
  sentAnswer.value = true;
  status.value = "wrong";

  if (quizQuestions.value.length - Number(presentIndex.value) === 1) {
    endQuiz();
  }
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

  updateAnsweredQuizQuestions(quizQuestion.value.id);
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

const endQuiz = async () => {
  const alertTextObj = {
    win: {
      title: i18n.t("practice.finish-game-popup.win.title"),
      text: `${i18n.t("practice.finish-game-popup.win.text")} ${presentIndex.value + 1} ${i18n.t("over.points")}`,
    },
    draw: {
      title: i18n.t("practice.finish-game-popup.draw.title"),
      text: `${i18n.t("practice.finish-game-popup.draw.text")} ${(presentIndex.value + 1) / 2} ${i18n.t(
        "over.points",
      )}`,
    },
    lose: {
      title: i18n.t("practice.finish-game-popup.lose.title"),
      text: `${i18n.t("practice.finish-game-popup.lose.text")} -${(presentIndex.value + 1) / 5} ${i18n.t(
        "over.points",
      )}`,
    },
  };

  await saveQuizResult({
    user_score: userScore.value,
    rival_score: rivalScore.value,
    mode: quizMode.value,
    rival_type: quizRivalType.value,
    ...(quizRivalId.value && { rival_id: quizRivalId.value }),
  }).then(({ data }) => {
    const result = data?.attributes?.result;
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
    ...(quizRivalId.value && { rival_id: quizRivalId.value }),
  }).then(() => {
    useQuizStore().$reset();
    leavePopupPageText.value = "";
    props.f7router.navigate("/");
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

watch(allQuizQuestionAnswered, val => {
  if (!val) {
    return false;
  }

  endQuiz();
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
