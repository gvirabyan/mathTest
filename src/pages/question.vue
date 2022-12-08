<template>
  <f7-page class="hg-question-page" name="question">
    <f7-navbar :title="category?.name" back-link="Back" />
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
          @click="skip"
        >Skip</button>

        <button
          v-else
          class="button button-fill hg-default-btn-width"
          @click="next"
        >Next</button>
      </div>
    </div>
  </f7-page>
</template>

<script setup>
import {f7} from 'framework7-vue';
import {ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useAuthStore} from '@/js/stores/auth';
import {useCategoryStore} from '@/js/stores/categories';
import {useCategoryAnswerStore} from '@/js/stores/category-answer';
import {useQuestionsStore} from '@/js/stores/questions';

const props = defineProps({
  f7route: Object,
});

const authStore = useAuthStore();
const categoryStore = useCategoryStore();
const questionStore = useQuestionsStore();
const categoryAnswerStore = useCategoryAnswerStore();

const {user} = storeToRefs(authStore);
const {category} = storeToRefs(categoryStore);
const {question} = storeToRefs(questionStore);
const {answersData} = storeToRefs(categoryAnswerStore);

const {updatePoints} = authStore;
const {getCategory} = categoryStore;
const {getQuestions, getAnsweredQuestions, getNextQuestion} = questionStore;
const {updateUserAnsweredQuestions} = categoryAnswerStore;

const chosenAnswer = ref(null);
const chosenAnswerIndex = ref(null);

const chooseAnswer = (answer, index) => {
  chosenAnswer.value = typeof answer === 'string' ? answer : String(answer);
  chosenAnswerIndex.value = index;

  let status = question.value.attributes.answer === answer ? 'correct' : 'wrong';

  updateUserAnsweredQuestions({
    users_permissions_user: user.value.id,
    question: question.value.id,
    category: category.value.id,
    answer: chosenAnswer.value,
    status
  }).then(resp => {
    if (resp.status !== 'success') {
      clearChosenData();
      f7.dialog.alert(resp.message);

      return;
    }

    updatePoints(status);
  });
};

const skip = () => {
  updateUserAnsweredQuestions({
    users_permissions_user: user.value.id,
    question: question.value.id,
    category: category.value.id,
    answer: '',
    status: 'skipped'
  }).then(resp => {
    if (resp.status === 'success') {
      updatePoints('skipped').then(() => {
        next();
      });

      return;
    }

    f7.dialog.alert(resp.message);
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

getCategory(props.f7route.params.categoryID);
getAnsweredQuestions(props.f7route.params.categoryID).then(() => {
  getQuestions(props.f7route.params.categoryID);
});
</script>

<style lang="scss">
@import "../assets/scss/pages/question";
</style>
