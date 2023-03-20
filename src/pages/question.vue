<template>
  <f7-page class="hg-question-page" name="question">
    <f7-navbar back-link="Back" @click:back="clearStores">
      <template v-if="isLoading" #title> Loading... </template>

      <template v-else #title>
        {{ category?.name }}
      </template>
    </f7-navbar>

    <div v-if="question" id="elementId" class="questions-content">
      <f7-block-title><math-jax :latex="'\\sf' + question.attributes?.question"></math-jax></f7-block-title>
      <!--      <f7-block-header>What will be the result of this mathematical operation?</f7-block-header>-->

      <f7-list>
        <f7-list-item
          v-for="(answer, index) in answersData"
          :key="answer.id"
          :class="{
            'hg-selected-answer': chosenAnswer === (typeof answer === 'string' ? answer : String(answer)),
            'hg-correct-answer': sentAnswer && question.attributes?.answer === answer,
            'hg-wrong-answer': sentAnswer && chosenAnswerIndex === index && question.attributes?.answer !== answer,
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
          <f7-button class="button button-large button-submit" @click="sendAnswer"> abgeben </f7-button>
        </f7-row>

        <f7-button v-else class="button button-large button-next" @click="next"> nächstes </f7-button>
        <!--        <button-->
        <!--          v-if="!chosenAnswer"-->
        <!--          class="button button-outline hg-default-btn-width"-->
        <!--          :disabled="isSending"-->
        <!--          @click="next"-->
        <!--        >-->
        <!--          Submit-->
        <!--        </button>-->
        <!--        <button v-else class="button button-fill hg-default-btn-width" :disabled="isSending" @click="next">Next</button>-->
      </div>
    </div>

    <div v-else-if="isLoading">
      <f7-block-title>
        <f7-skeleton-block effect="wave">
          <f7-skeleton-text />
        </f7-skeleton-block>
      </f7-block-title>

      <!--      <f7-block-header>What will be the result of this mathematical operation?</f7-block-header>-->

      <f7-list inset>
        <f7-list-item v-for="i in 4" :key="`skeleton_${i}`">
          <template #root>
            <f7-skeleton-block effect="wave">
              <f7-skeleton-text />
            </f7-skeleton-block>
          </template>
        </f7-list-item>
      </f7-list>
    </div>

    <f7-block v-else-if="allQuestionsAnswered">You have answered all questions</f7-block>
  </f7-page>
</template>

<script setup>
import { f7 } from "framework7-vue";
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
import { useCategoryStore } from "@/js/stores/categories";
import { useCategoryAnswerStore } from "@/js/stores/category-answer";
import { useQuestionsStore } from "@/js/stores/questions";
import delay from "@/js/helpers/delay";

const props = defineProps({
  f7route: Object,
});

const authStore = useAuthStore();
const categoryStore = useCategoryStore();
const questionStore = useQuestionsStore();
const categoryAnswerStore = useCategoryAnswerStore();

const { user } = storeToRefs(authStore);
const { category } = storeToRefs(categoryStore);
const { question, meta, answeredQuestions } = storeToRefs(questionStore);
const { answersData } = storeToRefs(categoryAnswerStore);

const { getCategory } = categoryStore;
const { getQuestions, getAnsweredQuestions, getNextQuestion } = questionStore;
const { updateUserAnsweredQuestions } = categoryAnswerStore;

const isLoading = ref(false);
const isSending = ref(false);
const chosenAnswer = ref(null);
const chosenAnswerIndex = ref(null);
const sentAnswer = ref(false);

const allQuestionsAnswered = computed(
  () => category.value.questions_amount !== null && category.value.questions_amount === answeredQuestions.value.length,
);

const getAllQuestionData = async () => {
  isLoading.value = true;

  await delay();

  await getCategory(props.f7route.params.categoryID);
  await getAnsweredQuestions(props.f7route.params.categoryID).then(() => {
    getQuestions(props.f7route.params.categoryID);
  });

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
  isSending.value = true;

  let status = question.value.attributes.answer === chosenAnswer.value ? "correct" : "wrong";

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

const clearStores = () => {
  if (isSending.value) return;

  questionStore.$reset();
  categoryAnswerStore.$reset();
};

watch(
  () => answeredQuestions.value,
  val => {
    if (
      meta.value &&
      val.length === meta.value.pagination.page * meta.value.pagination.pageSize &&
      meta.value.pagination.page < meta.value.pagination.pageCount
    ) {
      getQuestions(props.f7route.params.categoryID);
    }
  },
  { deep: true },
);

getAllQuestionData();
</script>

<style lang="scss">
@import "../assets/scss/pages/question";
</style>
