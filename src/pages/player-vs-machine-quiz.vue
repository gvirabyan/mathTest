<template>
  <f7-page
    class="hg-question-page"
    name="player-vs-machine"
    @page:beforein="getQuizQuestions(quizMode.questions, pastCategoriesIds)"
  >
    <div class="navbar">
      <div class="navbar-inner">
        <div class="left">
          <a href="#" class="link icon-only" @click="breakQuiz">
            <i class="icon icon-back" />
          </a>
        </div>
        <div class="title">Player vs. Machine</div>
      </div>
    </div>

    <f7-block> Your: {{ userScore }} / Phone: {{ machineScore }} </f7-block>
    <f7-block> Question {{ currentQuizQuestionNumber }} / {{ quizQuestionsLength }} </f7-block>

    <f7-block v-if="quizQuestion">
      <f7-block-title>{{ quizQuestion?.question }}</f7-block-title>
      <f7-block-header>What will be the result of this mathematical operation?</f7-block-header>

      <f7-list>
        <f7-list-item
          v-for="(answer, index) in answersData"
          :key="answer.id"
          :class="{
            'hg-wrong-answer': chosenQuizAnswer && chosenQuizAnswerIndex === index && quizQuestion?.answer !== answer,
            'hg-correct-answer': chosenQuizAnswer && quizQuestion?.answer === answer,
          }"
          :disabled="!!chosenQuizAnswer"
          :title="answer"
          :checked="chosenQuizAnswer === answer"
          radio-icon="end"
          name="demo-radio-end"
          radio
          @change="chooseQuizAnswer(answer, index)"
        ></f7-list-item>
      </f7-list>

      <div class="hg-actions-btns-content">
        <button v-if="!chosenQuizAnswer" class="button button-outline hg-default-btn-width" @click="skip">Skip</button>

        <button v-else class="button button-fill hg-default-btn-width" @click="next">Next</button>
      </div>
    </f7-block>

    <f7-block v-else-if="allQuizQuestionAnswered">You have answered all questions</f7-block>
  </f7-page>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
import { useCategoryStore } from "@/js/stores/categories";
import { useCategoryAnswerStore } from "@/js/stores/category-answer";
import { useQuizStore } from "@/js/stores/quiz";
import { f7 } from "framework7-vue";

const props = defineProps({
  f7router: Object,
  f7route: Object,
});

const { user } = storeToRefs(useAuthStore());
const { pastCategoriesData } = storeToRefs(useCategoryStore());
const { answersData } = storeToRefs(useCategoryAnswerStore());
const {
  quizQuestions,
  quizQuestion,
  quizQuestionsLength,
  answeredQuizQuestions,
  quizMode,
  userScore,
  machineScore,
  currentQuizQuestionNumber,
} = storeToRefs(useQuizStore());

const { updateUser } = useAuthStore();
const { getQuizQuestions, getNextQuizQuestion, updateAnsweredQuizQuestions, updateScore } = useQuizStore();

const chosenQuizAnswer = ref(null);
const chosenQuizAnswerIndex = ref(0);
const endQuizAlert = ref(null);

const pastCategoriesIds = computed(() => pastCategoriesData.value.map(c => c.id));
const allQuizQuestionAnswered = computed(
  () => quizQuestions?.value.length && quizQuestionsLength?.value === answeredQuizQuestions.value?.length,
);

const chooseQuizAnswer = (answer, index) => {
  chosenQuizAnswer.value = typeof answer === "string" ? answer : String(answer);
  chosenQuizAnswerIndex.value = index;

  const status = quizQuestion.value.answer === answer ? "correct" : "wrong";

  updateScore(status, quizQuestion.value.machine_answer);
};

const clearChosenData = () => {
  chosenQuizAnswer.value = null;
  chosenQuizAnswerIndex.value = null;
};

const skip = () => {
  clearChosenData();
  updateScore("skipped", quizQuestion.value.machine_answer);
  next();
};

const next = () => {
  clearChosenData();
  updateAnsweredQuizQuestions(quizQuestion.value.id);
  getNextQuizQuestion();
};

const endQuiz = () => {
  let result;

  if (userScore.value > machineScore.value) {
    result = "win";
  } else if (userScore.value < machineScore.value) {
    result = "lose";
  } else {
    result = "draw";
  }

  const alertTextObj = {
    win: "You have won",
    draw: "You have played a draw",
    lose: "You have lost",
  };

  endQuizAlert.value = f7.dialog.alert(alertTextObj[result], "The quiz result", () => {
    const pointsObject = {
      win: user.value.points + quizMode.value.winPoints,
      draw: user.value.points + quizMode.value.drawPoints,
      lose: user.value.points + quizMode.value.losePoints,
    };

    updateUser({ points: pointsObject[result] }).then(() => {
      f7.toast.show({
        text: "Your points were updated",
        closeButton: true,
        closeTimeout: 1500,
        on: {
          close: () => {
            useQuizStore().$reset();
            endQuizAlert.value = null;
            props.f7router.navigate("/activity/");
          },
        },
      });
    });
  });
};

const breakQuiz = () => {
  f7.dialog.confirm(
    `Your progress will be lost and you will lose ${Math.abs(quizMode.value.losePoints)} points. Are you sure?`,
    "Warning",
    () => {
      updateUser({ points: user.value.points + quizMode.value.losePoints }).then(() => {
        useQuizStore().$reset();
        props.f7router.navigate("/activity/");
      });
    },
  );
};

watch(allQuizQuestionAnswered, val => {
  if (!val) {
    return false;
  }

  endQuiz();
});
</script>

<style lang="scss">
@import "../assets/scss/pages/question";
</style>
