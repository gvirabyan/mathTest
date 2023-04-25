<template>
  <f7-page class="hg-question-page" name="question">
    <f7-navbar back-link="Back" @click:back="clearStores">
      <template v-if="isLoading" #title> Loading... </template>

      <template v-else #title>
        {{ category?.name }}
      </template>
    </f7-navbar>

    <div class="circles">
      <Circle
        v-for="point in getPoints"
        :key="point.point"
        :point="point.point"
        :status="checkStatus(point.id, point.answer)"
      />
    </div>

    <div v-if="question" id="elementId" class="questions-content">
      <f7-block-title><math-jax :latex="'\\Large \\sf' + question?.question" :block="true"></math-jax></f7-block-title>

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

      <div class="hg-actions-btns-content">
        <f7-row v-if="!sentAnswer">
          <f7-button class="button button-large button-skip" :disabled="isSending" @click="skip">
            überspringen
          </f7-button>
          <f7-button
            class="button button-large button-submit"
            :class="{ 'btn-disable': !chosenAnswer || isSending }"
            @click="sendAnswer"
          >
            abgeben
          </f7-button>
        </f7-row>

        <f7-button v-else class="button button-large button-next" @click="next"> nächstes </f7-button>
      </div>
    </div>

    <loading-small v-else-if="isLoading" />
  </f7-page>

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
              <f7-block-title> Your score on this topic </f7-block-title>
              <p class="place-txt">{{ answeredQuestionsPoints }} {{ pluralizeWord(correctAnswers.length, "point") }}</p>
            </f7-row>

            <f7-row class="justify-content-space-between align-items-center">
              <p class="from-txt">
                {{ correctAnswers.length }}/{{ category.questions_amount }} right answered
                {{ pluralizeWord(correctAnswers.length, "question") }}
              </p>
            </f7-row>
          </f7-block>

          <f7-button class="footer-button" @click="closeAndNavigate('practice')">Start Practice</f7-button>
        </div>

        <f7-link @click="closeAndNavigate('/')">
          <img width="51" height="50" src="@/assets/images/points-violet.svg" alt="" />
        </f7-link>
      </f7-page>
    </f7-popup>
  </teleport>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { f7 } from "framework7-vue";
import { useAuthStore } from "@/js/stores/auth";
import { useCategoryStore } from "@/js/stores/categories";
import { useCategoryAnswerStore } from "@/js/stores/category-answer";
import { useQuestionsStore } from "@/js/stores/questions";
import { useUserStats } from "@/js/stores/user-stats";
import delay from "@/js/helpers/delay";
import pluralizeWord from "../js/utils/pluralize-word";
import Circle from "@/components/circle.vue";
import LoadingSmall from "@/components/loading-small.vue";

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

const userStatsStore = useUserStats();
const authStore = useAuthStore();
const categoryStore = useCategoryStore();
const questionStore = useQuestionsStore();
const categoryAnswerStore = useCategoryAnswerStore();

const { getUserStatus } = userStatsStore;
const { user } = storeToRefs(authStore);
const { category } = storeToRefs(categoryStore);
const { questions, question, answeredQuestionsData, answeredQuestionsPoints, questionIndex, questionsAreOver } =
  storeToRefs(questionStore);
const { answersData } = storeToRefs(categoryAnswerStore);

const { getCategory, clearCategory } = categoryStore;
const { getQuestions, getNextQuestion, getAnsweredQuestions } = questionStore;
const { updateUserAnsweredQuestions } = categoryAnswerStore;

const isLoading = ref(false);
const isSending = ref(false);
const chosenAnswer = ref(null);
const chosenAnswerIndex = ref(null);
const sentAnswer = ref(false);
const isAllAnsweredPopup = ref(false);

const getPoints = computed(() => {
  return questions.value
    ? questions.value.map((q, i) => {
        return {
          id: q.id,
          answer: q.answer,
          point: i + 1,
        };
      })
    : [];
});

const correctAnswers = computed(() => answeredQuestionsData.value.filter(q => q.attributes.status === "correct"));

const checkStatus = (id, answer) => {
  const staticQuestion = questions.value.find(q => q.id === id);
  return staticQuestion && staticQuestion.wrong_answers
    ? staticQuestion.wrong_answers.includes(staticQuestion.answer)
      ? "false"
      : "true"
    : "normal";
};
const getAllQuestionData = async () => {
  isLoading.value = true;

  await delay();
  await getCategory(props.f7route.params.categoryID);
  await getQuestions(props.f7route.params.categoryID);

  isLoading.value = false;
};

const getQuestionsHandler = async () => {
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

const sendAnswer = () => {
  if (chosenAnswer.value) {
    isSending.value = true;
    let status = question.value.answer === chosenAnswer.value ? "correct" : "wrong";

    updateUserAnsweredQuestions({
      users_permissions_user: user.value.id,
      question: question.value.id,
      category: category.value.id,
      answer: chosenAnswer.value,
      status,
    }).then(resp => {
      isSending.value = false;
      sentAnswer.value = true;

      if (resp.status !== "success") {
        clearChosenData();

        f7.toast.show({
          text: resp.message,
          closeButton: true,
        });
      }
    });
  }
};

const skip = () => {
  isSending.value = true;

  updateUserAnsweredQuestions({
    users_permissions_user: user.value.id,
    question: question.value.id,
    category: category.value.id,
    answer: "",
    status: "skipped",
  }).then(resp => {
    isSending.value = false;

    if (resp.status === "success") {
      next();
      return;
    }

    f7.toast.show({
      text: resp.message,
      closeButton: true,
    });
  });
};

const next = () => {
  clearChosenData();
  getNextQuestion();
};

const clearChosenData = () => {
  chosenAnswer.value = null;
  chosenAnswerIndex.value = null;
  sentAnswer.value = false;
};

const clearStores = async () => {
  if (isSending.value) return;
  if (props.f7router.history[0] === "/") {
    await delay();
    await getUserStatus();
  }
  questionStore.$reset();
  categoryAnswerStore.$reset();
  clearCategory();
};

const closeAndNavigate = href => {
  clearCategory();
  isAllAnsweredPopup.value = false;
  href === "/" ? props.f7router.navigate(href) : props.f7router.navigate(`/${href}/`);
};

watch(questionIndex, val => {
  if (!questions.value.length || val < questions.value.length) {
    return;
  }

  getQuestionsHandler(props.f7route.params.categoryID);
});

watch(questionsAreOver, async val => {
  isAllAnsweredPopup.value = !!val;
  await getAnsweredQuestions(props.f7route.params.categoryID);
});

getAllQuestionData();
</script>

<style lang="scss">
@import "../assets/scss/pages/question";
</style>
