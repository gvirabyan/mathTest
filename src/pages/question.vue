<template>
  <f7-page class="hg-question-page" name="question">
    <f7-navbar back-link="Back" @click:back="clearQuestionStore">
      <template v-if="isLoading" #title>
        Loading...
      </template>

      <template v-else #title>
        {{ category?.name }}
      </template>
    </f7-navbar>

    <div v-if="question">
      <f7-block-title>{{ question.attributes?.question }}</f7-block-title>
      <f7-block-header>What will be the result of this mathematical operation?</f7-block-header>

      <f7-list>
        <f7-list-item
          v-for="(answer, index) in answersData"
          :class="{
            'hg-wrong-answer': chosenAnswer && chosenAnswerIndex === index && question.attributes?.answer !== answer,
            'hg-correct-answer': chosenAnswer && question.attributes?.answer === answer
          }"
          :disabled="!!chosenAnswer"
          :title="answer"
          :checked="chosenAnswer === answer"
          radio-icon="end"
          name="demo-radio-end"
          @change="chooseAnswer(answer, index)"
          radio
        ></f7-list-item>
      </f7-list>

      <div class="hg-actions-btns-content">
        <button
          v-if="!chosenAnswer"
          class="button button-outline hg-default-btn-width"
          :disabled="isSending"
          @click="skip"
        >Skip</button>

        <button
          v-else
          class="button button-fill hg-default-btn-width"
          :disabled="isSending"
          @click="next"
        >Next</button>
      </div>
    </div>

    <div v-else-if="isLoading">
      <f7-block-title>
        <f7-skeleton-block effect="wave">
          <f7-skeleton-text/>
        </f7-skeleton-block>
      </f7-block-title>

      <f7-block-header>What will be the result of this mathematical operation?</f7-block-header>

      <f7-list inset>
        <f7-list-item
          v-for="i in 4"
          :key="`skeleton_${i}`"
        >
          <template #root>
            <f7-skeleton-block effect="wave">
              <f7-skeleton-text/>
            </f7-skeleton-block>
          </template>
        </f7-list-item>
      </f7-list>
    </div>

    <f7-block v-else-if="allQuestionsAnswered">You have answered all questions</f7-block>
  </f7-page>
</template>

<script setup>
import {f7} from 'framework7-vue';
import {computed, ref, watch} from 'vue';
import {storeToRefs} from 'pinia';
import {useAuthStore} from '@/js/stores/auth';
import {useCategoryStore} from '@/js/stores/categories';
import {useCategoryAnswerStore} from '@/js/stores/category-answer';
import {useQuestionsStore} from '@/js/stores/questions';
import delay from '@/js/helpers/delay';

const props = defineProps({
  f7route: Object,
});

const authStore = useAuthStore();
const categoryStore = useCategoryStore();
const questionStore = useQuestionsStore();
const categoryAnswerStore = useCategoryAnswerStore();

const {user} = storeToRefs(authStore);
const {category} = storeToRefs(categoryStore);
const {questions, question, meta, answeredQuestions} = storeToRefs(questionStore);
const {answersData} = storeToRefs(categoryAnswerStore);

const {getCategory} = categoryStore;
const {getQuestions, getAnsweredQuestions, getNextQuestion} = questionStore;
const {updateUserAnsweredQuestions} = categoryAnswerStore;

const isLoading = ref(false);
const isSending = ref(false);
const chosenAnswer = ref(null);
const chosenAnswerIndex = ref(null);

const allQuestionsAnswered = computed(() =>
  category.value.questions_amount !== null
  && category.value.questions_amount === answeredQuestions.value.length
);

const getAllQuestionData = async () => {
  isLoading.value = true;

  await delay();

  await getCategory(props.f7route.params.categoryID);
  await getAnsweredQuestions(props.f7route.params.categoryID)
    .then(() => {
      getQuestions(props.f7route.params.categoryID)
    });

  isLoading.value = false
}

const chooseAnswer = (answer, index) => {
  chosenAnswer.value = typeof answer === 'string' ? answer : String(answer);
  chosenAnswerIndex.value = index;
  isSending.value = true;

  let status = question.value.attributes.answer === answer ? 'correct' : 'wrong';

  updateUserAnsweredQuestions({
    users_permissions_user: user.value.id,
    question: question.value.id,
    category: category.value.id,
    answer: chosenAnswer.value,
    status
  }).then(resp => {
    isSending.value = false;

    if (resp.status !== 'success') {
      clearChosenData();

      f7.toast.show({
        text: resp.message,
        closeButton: true
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
    answer: '',
    status: 'skipped'
  }).then(resp => {
    isSending.value = false;

    if (resp.status === 'success') {
      next();
      return;
    }

    f7.toast.show({
      text: resp.message,
      closeButton: true
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
};

const clearQuestionStore = () => {
  questionStore.$reset();
}

watch(() => answeredQuestions.value, val => {
  if (meta.value
    && val.length === meta.value.pagination.page * meta.value.pagination.pageSize
    && meta.value.pagination.page < meta.value.pagination.pageCount
  ) {
    getQuestions(props.f7route.params.categoryID);
  }
}, {deep: true})

getAllQuestionData();
</script>

<style lang="scss">
@import "../assets/scss/pages/question";
</style>
