<template>
  <f7-page
    class="hg-question-page"
    name="player-vs-machine"
    @page:beforein="getQuizQuestionsHandler(quizMode.questions)"
  >
    <div class="navbar players-machine">
      <div class="navbar-inner">
        <div class="left">
          <a href="#" class="link icon-only" @click="breakQuiz">
            <img src="@/assets/icons/arrow-right.svg" >
          </a>
        </div>
        <div class="title">Reihenfolge der Operationen, drei..</div>
      </div>
    </div>

    <template v-if="!isLoading">
      <f7-row class="scores-block">
        <f7-block class="my-score">
          Your score:&nbsp;
          <span>{{ userScore }}</span>
        </f7-block>
        <f7-block class="machine-score">
          Machine score:&nbsp;
          <span>{{ machineScore }}</span>
        </f7-block>
      </f7-row>

      <f7-block v-if="quizQuestion" class="player-machine-questions-content">
        <f7-block-title>
          <math-jax :latex="'\\Large \\sf' + quizQuestion?.question" :block="true"></math-jax>
        </f7-block-title>
<!--        <f7-list>-->
<!--          <f7-list-item-->
<!--            v-for="(answer, index) in answersData"-->
<!--            :key="answer.id"-->
<!--            :class="{-->
<!--              'hg-wrong-answer': chosenQuizAnswer && chosenQuizAnswerIndex === index && quizQuestion?.answer !== answer,-->
<!--              'hg-correct-answer': chosenQuizAnswer && quizQuestion?.answer === answer,-->
<!--            }"-->
<!--            :disabled="!!chosenQuizAnswer"-->
<!--            :title="answer"-->
<!--            :checked="chosenQuizAnswer === answer"-->
<!--            radio-icon="end"-->
<!--            name="demo-radio-end"-->
<!--            radio-->
<!--            @change="chooseQuizAnswer(answer, index)"-->
<!--          ></f7-list-item>-->
<!--        </f7-list>-->

        <f7-list>
          <f7-list-item
            v-for="(answer, index) in answersData"
            :key="index"
            :checked="chosenQuizAnswer === answer"
            :disabled="!!sentAnswer"
            :class="{
              'hg-correct-machine-answer': sentAnswer && quizQuestion.machine_answer === 'correct' && answer === quizQuestion.answer,
              'hg-wrong-machine-answer': sentAnswer && quizQuestion.machine_answer === 'wrong' && quizQuestion.wrong_answers[1]  == answer,
            }"
            name="demo-radio-end"
            radio
            @change="chooseQuizAnswer(answer, index)"
          >
            <f7-col
              :class="{
                'hg-selected-answer': chosenQuizAnswer === (typeof answer === 'string' ? answer : String(answer)),
                'hg-correct-answer': sentAnswer && quizQuestion?.answer === answer,
                'hg-wrong-answer': sentAnswer && chosenQuizAnswerIndex === index && quizQuestion?.answer !== answer
              }">
              <span class="list-number">{{ `${getLetterByIndex(index)}.` }}</span>
              <math-jax :latex="'\\sf' + answer"></math-jax>
            </f7-col>
          </f7-list-item>
        </f7-list>

<!--        <div class="hg-actions-btns-content">-->
<!--          <button v-if="!chosenQuizAnswer" class="button button-outline hg-default-btn-width" @click="skip">-->
<!--            Skip-->
<!--          </button>-->

<!--          <button v-else class="button button-fill hg-default-btn-width" @click="next">Next</button>-->
<!--        </div>-->
        <div class="hg-actions-btns-content">
          <f7-row v-if="!sentAnswer">
            <f7-button  class="button button-large button-skip" :disabled="isSending" @click="skip">
              wrong answer
            </f7-button>
            <f7-button
              class="button button-large button-submit"
              :class="{ 'btn-disable': !chosenQuizAnswer || isSending }"
              @click="sendAnswer"
            >
              abgeben
            </f7-button>
          </f7-row>

          <f7-button v-else class="button button-large button-next" @click="next"> nächstes </f7-button>
        </div>
      </f7-block>

      <f7-block v-else-if="allQuizQuestionAnswered">You have answered all questions</f7-block>
    </template>

    <loading-small v-else />
  </f7-page>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { f7 } from "framework7-vue";
import { useAuthStore } from "@/js/stores/auth";
import { useCategoryAnswerStore } from "@/js/stores/category-answer";
import { useQuizStore } from "@/js/stores/quiz";
import delay from "@/js/helpers/delay";
import LoadingSmall from "@/components/loading-small.vue";

const props = defineProps({
  f7router: { type: Object, default: () => {} },
  f7route: { type: Object, default: () => {} },
});

const { user } = storeToRefs(useAuthStore());
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
const { getQuizQuestions, getNextQuizQuestion, updateAnsweredQuizQuestions, updateScore } = useQuizStore();

const { updateUser } = useAuthStore();

const isLoading = ref(false);
const chosenQuizAnswer = ref(null);
const chosenQuizAnswerIndex = ref(0);
const endQuizAlert = ref(null);

const allQuizQuestionAnswered = computed(
  () => quizQuestions?.value?.length && quizQuestionsLength?.value === answeredQuizQuestions?.value?.length,
);

const getLetterByIndex = index => {
  const letterCode = "a".charCodeAt(0) + index;
  return String.fromCharCode(letterCode);
};

const getQuizQuestionsHandler = async limit => {
  isLoading.value = true;

  await delay();
  await getQuizQuestions(limit, answeredQuizQuestions.value);

  isLoading.value = false;
};

const chooseQuizAnswer = (answer, index) => {
  chosenQuizAnswer.value = typeof answer === "string" ? answer : String(answer);
  chosenQuizAnswerIndex.value = index;
};
const isSending = ref(false);
const sentAnswer = ref(false);

const sendAnswer = () => {
  if(chosenQuizAnswer.value) {
    isSending.value = true;
    const status = quizQuestion.value.answer === chosenQuizAnswer.value ? "correct" : "wrong";
    updateScore(status, quizQuestion.value.machine_answer)
    isSending.value = false;
    sentAnswer.value = true;
    chosenQuizAnswer.value = null;
  }
}

const clearChosenData = () => {
  chosenQuizAnswer.value = null;
  chosenQuizAnswerIndex.value = null;
  isSending.value = false;
  sentAnswer.value = false;
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

  const pointsObject = {
    win: user.value.points + quizMode.value.winPoints,
    draw: user.value.points + quizMode.value.drawPoints,
    lose: user.value.points + quizMode.value.losePoints,
  };

  endQuizAlert.value = f7.dialog.alert(alertTextObj[result], "The quiz result", () => {
    updateUser({ points: pointsObject[result] }).then(() => {
      f7.toast.show({
        text: "Your points were updated",
        closeButton: true,
        closeTimeout: 1000,
        on: {
          close: () => {
            useQuizStore().$reset();
            endQuizAlert.value = null;
            props.f7router.navigate("/");
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
        props.f7router.navigate("/");
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
