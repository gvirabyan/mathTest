<template>
  <f7-page class="hg-question-page" name="question" @page:beforein="getAllQuestionData" @page:afterout="outPage">
    <f7-navbar back-link="Back" @click:back="clearStores">
      <template v-if="isLoading" #title> Loading... </template>
      <template v-else #title>
        {{ categoryQuestion?.name }}
      </template>
    </f7-navbar>

    <div ref="circles" class="circles" style="">
      <Circle
        v-for="point in getPoints"
        :key="point.point"
        ref="circles"
        :point="point.point"
        :status="point.status"
        :history-circle="indexQuestionHistory"
        @click="showHistory(point.point)"
      />
    </div>
    <div v-if="questionHistory" id="element" class="questions-content">
      <div>
        <f7-block-title
          ><math-jax :latex="'\\Large \\sf ' + questionHistory?.question" :block="true"></math-jax
        ></f7-block-title>
        <f7-list>
          <f7-list-item
            v-for="(answer, index) in shuffle([questionHistory.answer, ...questionHistory.wrong_answers])"
            :key="answer"
            :class="{
              'hg-correct-answer': `${questionHistory.answer}` === `${answer}`,
              'hg-wrong-answer':
                questionHistory.user_answer?.status === 'wrong' &&
                `${questionHistory.user_answer?.answer}` === `${answer}`,
            }"
            :checked="true"
            :disabled="true"
            name="demo-radio-end"
            radio
          >
            <f7-col>
              <span class="list-number">{{ `${getLetterByIndex(index)}.` }}</span>
              <math-jax :latex="'\\sf' + answer"></math-jax>
            </f7-col>
          </f7-list-item>
        </f7-list>
      </div>

      <f7-button class="question-continue-btn" @click="goPresentQuestion">{{ $t("question.continue") }}</f7-button>
    </div>
    <div v-else-if="question" id="elementId" class="questions-content">
      <div>
        <f7-block-title
          ><math-jax :latex="'\\Large \\sf ' + question?.question" :block="true"></math-jax
        ></f7-block-title>
        <f7-list>
          <f7-list-item
            v-for="(answer, index) in answersData"
            :key="answer.id"
            :class="{
              'hg-selected-answer': chosenAnswer === (typeof answer === 'string' ? answer : String(answer)),
              'hg-correct-answer': sentAnswer && question?.answer === answer,
              'hg-wrong-answer': sentAnswer && chosenAnswerIndex === index && question?.answer !== answer,
            }"
            :checked="chosenAnswer === answer"
            :disabled="!!sentAnswer"
            name="demo-radio-end"
            radio
            @change="chooseAnswer(answer, index)"
          >
            <f7-col>
              <span class="list-number">{{ `${getLetterByIndex(index)}.` }}</span>
              <math-jax :latex="'\\sf' + answer"></math-jax>
            </f7-col>
          </f7-list-item>
        </f7-list>
      </div>
      <div class="hg-actions-btns-content">
        <f7-row v-if="!sentAnswer">
          <f7-button
            :class="{
              'button button-large button-skip': true,
              'btn-disable': isSending,
            }"
            :disabled="isSending"
            @click="skip"
          >
            {{ $t("buttons.skip") }}
          </f7-button>
          <f7-button
            :class="{
              'button button-large button-submit': true,
              'btn-disable': !chosenAnswer || isSending,
            }"
            @click="sendAnswer"
          >
            {{ $t("buttons.send") }}
          </f7-button>
        </f7-row>

        <f7-button v-else class="button button-large button-next" @click="next">
          {{ $t("buttons.next") }}
        </f7-button>
      </div>
    </div>
    <loading-small v-else-if="isLoading" />
  </f7-page>

  <leave-page-popup
    v-if="checkSkipPopup"
    title=""
    :text="checkSkipPopup"
    :leave-btn="$t('question.leave-for-now')"
    :save-btn="$t('question.check-skipped')"
    @close="next"
    @leave-changes="goBack"
    @save-changes="next"
  />

  <teleport to=".hg-question-page">
    <f7-popup class="all-answered-popup" :opened="isAllAnsweredPopup">
      <f7-page>
        <div class="width-100 display-flex justify-content-flex-end">
          <f7-button class="close-btn" @click="closeAndNavigate('topics')">
            <img src="@/assets/icons/close.svg" alt="Close popup" />
          </f7-button>
        </div>

        <div class="content">
          <h2 class="title"><span>Mathe</span>App</h2>
          <f7-block>
            <f7-row class="justify-content-space-between align-items-center">
              <f7-block-title> {{ $t("question.your-score-on-this-topic") }} </f7-block-title>
              <p class="place-txt">
                {{ answeredQuestionsPoints }} {{ pluralizeWord(correctAnswers.length, $t("question.point")) }}
              </p>
            </f7-row>

            <f7-row class="justify-content-space-between align-items-center">
              <p class="from-txt">
                {{
                  `${correctAnswers.length} / ${categoryQuestion?.questions_amount}  ${$t("question.right-answered")}
                ${pluralizeWord(correctAnswers.length, $t("question.question"))}`
                }}
              </p>
            </f7-row>
          </f7-block>

          <f7-button class="footer-button" @click="closeAndNavigate('practice')">{{
            $t("question.start-practice")
          }}</f7-button>
        </div>

        <f7-link @click="closeAndNavigate('/')">
          <img width="51" height="50" src="@/assets/images/points-violet.svg" alt="" />
        </f7-link>
      </f7-page>
    </f7-popup>
  </teleport>
</template>

<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { f7 } from "framework7-vue";
import { useAuthStore } from "@/js/stores/auth";
import { useCategoryAnswerStore } from "@/js/stores/category-answer";
import { useQuestionsStore } from "@/js/stores/questions";
import { useCategoryClassesStore } from "@/js/stores/category-classes";
import delay from "@/js/helpers/delay";
import pluralizeWord from "../js/utils/pluralize-word";
import Circle from "@/components/circle.vue";
import LoadingSmall from "@/components/loading-small.vue";
import LeavePagePopup from "@/components/leave-page-popup.vue";
import { useI18n } from "vue-i18n";

const storeCategoryClass = useCategoryClassesStore();
const { selectedClass } = storeToRefs(storeCategoryClass);

const props = defineProps({
  f7router: {
    type: Object,
    default: () => {},
  },
  f7route: {
    type: Object,
    default: () => {},
  },
});

const authStore = useAuthStore();
const questionStore = useQuestionsStore();
const categoryAnswerStore = useCategoryAnswerStore();
const { user } = storeToRefs(authStore);
const {
  categoryQuestion,
  questions,
  history,
  question,
  answeredQuestionsData,
  answeredQuestionsPoints,
  questionsAreOver,
} = storeToRefs(questionStore);
const { answersData } = storeToRefs(categoryAnswerStore);

const { clearCategory } = questionStore;
const { getQuestions, getNextQuestion, getAnsweredQuestions } = questionStore;
const { updateUserAnsweredQuestions } = categoryAnswerStore;

const isLoading = ref(false);
const isSending = ref(false);
const chosenAnswer = ref(null);
const chosenAnswerIndex = ref(null);
const sentAnswer = ref(false);
const isAllAnsweredPopup = ref(false);

const presentIndex = ref(0);
const getPoints = ref([]);
const circles = ref(null);
const checkAnswers = ref(true);
const startIndex = ref(0);
watch(
  () => questions.value,
  async () => {
    if (checkAnswers.value && categoryQuestion.value) {
      selectedClass.value = categoryQuestion.value.classId;
      presentIndex.value = history.value.length;
      keepPresentIndex.value = presentIndex.value;
      checkAnswers.value = false;
      const questionsL = categoryQuestion.value.questions_amount;
      for (let i = 0; i < history.value.length; i++) {
        getPoints.value.push({
          id: null,
          answer: null,
          history: history.value[i] ?? [],
          point: i + 1,
          status: history.value[i]["user_answer"]["status"],
        });
      }
      for (let i = 0; i < questionsL - history.value.length; i++) {
        getPoints.value.push({
          id: questions.value[i] ? questions.value[i].id : null,
          answer: questions.value[i] ? questions.value[i].answer : null,
          history: [],
          point: history.value.length + 1 + i,
          status: i === 0 ? "present" : "normal",
        });
      }
    }
  },
);
const checkCircleChange = ref(true);
watch(
  () => circles.value,
  async el => {
    await nextTick();
    if (
      checkCircleChange.value &&
      el.children[presentIndex.value] &&
      el.clientWidth / 2 - 16 < el.children[presentIndex.value].getBoundingClientRect().left - 24
    ) {
      circles.value.scrollLeft +=
        circles.value.children[presentIndex.value].getBoundingClientRect().left - 2 - circles.value.clientWidth / 2;
      checkCircleChange.value = false;
    }
  },
  {
    deep: true,
  },
);

const correctAnswers = computed(() => answeredQuestionsData.value.filter(q => q.attributes.status === "correct"));

const getAllQuestionData = async () => {
  window.addEventListener("resize", onOrientationChange);
  isLoading.value = true;
  await delay();
  await getQuestions(props.f7route.params.categoryID);
  isLoading.value = false;
};

const getLetterByIndex = index => {
  const letterCode = "a".charCodeAt(0) + index;
  return String.fromCharCode(letterCode);
};

const chooseAnswer = (answer, index) => {
  chosenAnswer.value = typeof answer === "string" ? answer : String(answer);
  chosenAnswerIndex.value = index;
};

const status = ref("normal");
const sendAnswer = () => {
  if (chosenAnswer.value && !isSending.value) {
    isSending.value = true;
    status.value = question.value.answer === chosenAnswer.value ? "correct" : "wrong";

    updateUserAnsweredQuestions({
      users_permissions_user: user.value.id,
      question: question.value.id,
      category: categoryQuestion.value.id,
      answer: chosenAnswer.value,
      status: status.value,
      answer_type: "topic",
    }).then(resp => {
      isSending.value = false;
      sentAnswer.value = true;

      if (resp.status !== "success") {
        clearChosenData();
        f7.toast.show({
          text: resp.message,
          closeButton: true,
        });
      } else {
        //save user answer
        questions.value.find(q => q.id === question.value.id).user_answer = {
          status: status.value,
          answer: chosenAnswer.value,
        };
      }
    });
  }
};

const indexQuestionHistory = ref(null);
const questionHistory = ref(null);

const indexHistory = ref(null);
const showHistory = point => {
  indexHistory.value = Number(point) - 1;
  if (
    indexHistory.value <= keepPresentIndex.value ||
    (indexHistory.value <= presentIndex.value &&
      !keepPresentIndex.value &&
      (indexHistory.value !== keepPresentIndex.value || questionHistory.value))
  ) {
    indexQuestionHistory.value = indexHistory.value;
    getPoints.value[presentIndex.value].status = "normal";
    if (indexHistory.value < history.value.length) {
      questionHistory.value = history.value[indexHistory.value];
    } else if (
      (questions.value[indexHistory.value - history.value.length] &&
        !questions.value[indexHistory.value - history.value.length].user_answer &&
        indexHistory.value < keepPresentIndex.value) ||
      indexHistory.value === keepPresentIndex.value
    ) {
      questionHistory.value = null;
      indexQuestionHistory.value = null;
      question.value = questions.value[indexHistory.value - history.value.length];
      presentIndex.value = indexHistory.value;
      getPoints.value[presentIndex.value].status = "present";
    } else if (
      questions.value[indexHistory.value - history.value.length] &&
      questions.value[indexHistory.value - history.value.length].user_answer
    ) {
      questionHistory.value = questions.value[indexHistory.value - history.value.length];
    }
    //circle go on the point
    circles.value.scrollLeft +=
      circles.value.children[indexHistory.value].getBoundingClientRect().left - 2 - circles.value.clientWidth / 2;
  }
};

function shuffle(a) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

const skippedPoints = ref([]);

const skip = () => {
  if (isSending.value) {
    isSending.value = true;
    status.value = "normal";
    updateUserAnsweredQuestions({
      users_permissions_user: user.value.id,
      question: question.value.id,
      category: categoryQuestion.value.id,
      answer: "",
      status: "skipped",
      answer_type: "topic",
    }).then(resp => {
      isSending.value = false;
      skippedPoints.value.push(presentIndex.value + 1);
      if (resp.status === "success") {
        next();
        return;
      }

      f7.toast.show({
        text: resp.message,
        closeButton: true,
      });
    });
  }
};

const checkSkipPopup = ref(false);

const goBack = () => {
  checkSkipPopup.value = false;
  props.f7router.back();
};

const keepPresentIndex = ref(null);

const goPresentQuestion = () => {
  questionHistory.value = null;
  indexQuestionHistory.value = null;
  if (keepPresentIndex.value) {
    getPoints.value[presentIndex.value].status = "normal";
    presentIndex.value = keepPresentIndex.value;
  }
  getPoints.value[presentIndex.value].status = "present";
  circles.value.scrollLeft +=
    circles.value.children[presentIndex.value].getBoundingClientRect().left - 2 - circles.value.clientWidth / 2;
};

const i18n = useI18n();

const next = async () => {
  let skippedPoint = getPoints.value.find(v => v.status === "normal" && !skippedPoints.value.includes(v.point));
  //check when open popup, for skip
  if (!skippedPoint && skippedPoints.value.length > 0 && !checkSkipPopup.value) {
    const quantity = skippedPoints.value.length;
    if (quantity === 1) {
      checkSkipPopup.value = i18n.t("question.single-skipped-text");
    } else {
      checkSkipPopup.value = `${i18n.t("question.skipped-first-text")} ${quantity} ${i18n.t(
        "question.skipped-second-text",
      )}`;
    }
    return;
  }

  clearChosenData();
  startIndex.value++;
  if (startIndex.value + 3 === questions.value.length) {
    await getQuestions(props.f7route.params.categoryID);
  }
  if (startIndex.value + 1 === questions.value.length) {
    startIndex.value = 0;
  }
  getPoints.value[presentIndex.value].status = status.value;
  if (!skippedPoint) {
    skippedPoints.value = [];
    skippedPoint = getPoints.value.find(v => v.status === "normal");
  }
  if (skippedPoint) {
    presentIndex.value = skippedPoint.point - 2;
  } else {
    isAllAnsweredPopup.value = true;
    await getAnsweredQuestions(props.f7route.params.categoryID);
    return;
  }
  getNextQuestion(skippedPoint ? skippedPoint.id : null);
  presentIndex.value++;
  if (presentIndex.value < getPoints.value.length) {
    getPoints.value[presentIndex.value].status = "present";
    if (!keepPresentIndex.value || presentIndex.value > keepPresentIndex.value) {
      keepPresentIndex.value = presentIndex.value;
    }
  }
  circles.value.scrollLeft +=
    circles.value.children[presentIndex.value].getBoundingClientRect().left - 2 - circles.value.clientWidth / 2;

  checkSkipPopup.value = false;
};

const clearChosenData = () => {
  chosenAnswer.value = null;
  chosenAnswerIndex.value = null;
  sentAnswer.value = false;
};

const clearStores = async () => {
  if (isSending.value) return;
  isAllAnsweredPopup.value = false;
  questionStore.$reset();
  categoryAnswerStore.$reset();
  clearCategory();
};

const closeAndNavigate = href => {
  clearStores();
  isAllAnsweredPopup.value = false;
  href === "/" ? props.f7router.navigate(href) : props.f7router.navigate(`/${href}/`);
};

watch(questionsAreOver, async val => {
  if (!val) return;

  isAllAnsweredPopup.value = true;
  await getAnsweredQuestions(props.f7route.params.categoryID);
});

const onOrientationChange = () => {
  if (indexQuestionHistory.value) {
    circles.value.scrollLeft +=
      circles.value.children[indexQuestionHistory.value].getBoundingClientRect().left -
      2 -
      circles.value.clientWidth / 2;
  } else if (
    circles.value.clientWidth / 2 !==
    circles.value.children[presentIndex.value].getBoundingClientRect().left - 2
  ) {
    circles.value.scrollLeft +=
      circles.value.children[presentIndex.value].getBoundingClientRect().left - 2 - circles.value.clientWidth / 2;
  }
};

const outPage = () => {
  window.removeEventListener("resize", onOrientationChange);
};
</script>

<style lang="scss">
@import "../assets/scss/pages/question";
</style>
