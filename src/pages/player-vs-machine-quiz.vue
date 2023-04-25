<template>
  <f7-page
    class="hg-question-page"
    name="player-vs-machine"
    @page:beforein="getQuizQuestionsHandler(quizMode.questions)"
  >
    <leave-page-popup
      v-if="leavePopupPageText"
      :text="leavePopupPageText"
      saveBtn="Stay"
      @leave-changes="leavePage"
      @save-changes="leavePopupPageText = ''"
      @close="leavePopupPageText = ''"
    />
    <success-message-popup
      v-if="finishGame"
      :title="finishGame"
      btn-text="Ok"
      @close="closeFinishPopup"
    />
    <div class="navbar players-machine">
      <div class="navbar-inner">
        <div class="left">
          <a href="#" class="link icon-only" @click="breakQuiz">
            <img src="@/assets/icons/arrow-right.svg" />
          </a>
        </div>
        <div class="title">Reihenfolge der Operationen, drei..</div>
      </div>
    </div>
    <div ref="circles" class="circles machine-player-circle">
      <Circle
        v-for="point in getPoints"
        :key="point.point"
        :point="point.point"
        :status="point.status"
      />
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
        <f7-list>
          <f7-list-item
            v-for="(answer, index) in answersData"
            :key="index"
            :checked="chosenQuizAnswer === answer"
            :disabled="!!sentAnswer"
            :class="{
              'hg-correct-machine-answer':
                sentAnswer && quizQuestion.machine_answer === 'correct' && answer === quizQuestion.answer,
              'hg-wrong-machine-answer':
                sentAnswer && quizQuestion.machine_answer === 'wrong' && quizQuestion.wrong_answers[1] == answer,
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
        <div class="hg-actions-btns-content">
          <f7-row v-if="!sentAnswer">
            <f7-button class="button button-large button-skip" :disabled="isSending" @click="skip">
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
import {ref, computed, watch, onMounted, onUnmounted} from "vue";
import { storeToRefs } from "pinia";
import { f7 } from "framework7-vue";
import { useAuthStore } from "@/js/stores/auth";
import { useCategoryAnswerStore } from "@/js/stores/category-answer";
import { useQuizStore } from "@/js/stores/quiz";
import delay from "@/js/helpers/delay";
import LoadingSmall from "@/components/loading-small.vue";
import Circle from "@/components/circle.vue";
import LeavePagePopup from "@/components/leave-page-popup.vue"
import SuccessMessagePopup from "@/components/success-message-popup.vue"

const props = defineProps({
  f7router: { type: Object, default: () => {} },
  f7route: { type: Object, default: () => {} },
});

onMounted(() => {
  window.addEventListener("resize", onOrientationChange);
});

onUnmounted(() => {
  window.removeEventListener("resize", onOrientationChange);
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

const presentIndex = ref(0)
const getPoints = ref( [],);
const circles = ref(null)
watch(
  () => quizQuestions.value,
  () => {
    getPoints.value = quizQuestions.value.map((q, i) => {
      return {
        id: q.id,
        answer: q.answer,
        point: i + 1,
        status: i === presentIndex.value ? "present" : "normal",
      };
    });
  },
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

const finishGame = ref('');
const closeFinishPopup = () => {
  finishGame.value = ''
  props.f7router.navigate('/practice/')
}

const status = ref('normal')
const sendAnswer = () => {
  if (chosenQuizAnswer.value) {
    isSending.value = true;
    status.value = quizQuestion.value.answer === chosenQuizAnswer.value ? "correct" : "wrong";
    updateScore(status.value, quizQuestion.value.machine_answer);
    isSending.value = false;
    sentAnswer.value = true;
    chosenQuizAnswer.value = null;
  }
  //got it-i popup-i errorn a es anter 1-@ chi jokum
  if(quizQuestions.value.length - Number(presentIndex.value) === 1) {
    finishGame.value = Number(machineScore.value) < Number(userScore.value) ? "You have won this game" : "You have played this game";
  }
};

const clearChosenData = () => {
  chosenQuizAnswer.value = null;
  chosenQuizAnswerIndex.value = null;
  isSending.value = false;
  sentAnswer.value = false;
};

const skip = () => {
  clearChosenData();
  updateScore("skipped", quizQuestion.value.machine_answer);
  status.value = "wrong"
  next();
};

const next = () => {
  clearChosenData();
  getPoints.value[presentIndex.value].status = status.value;
  ++presentIndex.value;
  if(presentIndex.value < getPoints.value.length) {
    getPoints.value[presentIndex.value].status = 'present';
  }
  if (circles.value.clientWidth/2-16 < circles.value.children[presentIndex.value].getBoundingClientRect().left-24) {
    circles.value.scrollLeft += circles.value.children[presentIndex.value].getBoundingClientRect().left-2-circles.value.clientWidth/2
  }
  updateAnsweredQuizQuestions(quizQuestion.value.id);
  getNextQuizQuestion();
};

const onOrientationChange = () => {
  if(circles.value.clientWidth/2 !== circles.value.children[presentIndex.value].getBoundingClientRect().left-2) {
    circles.value.scrollLeft += circles.value.children[presentIndex.value].getBoundingClientRect().left-2-circles.value.clientWidth/2
  }
}

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

const leavePopupPageText = ref('');
const breakQuiz = () => {
  if(presentIndex.value === 0) {
    props.f7router.navigate("/practice/");
  } else {
    leavePopupPageText.value =`Your progress will be lost and you will lose ${Math.abs(quizMode.value.losePoints)} points.`
  }
};

const leavePage = () => {
  updateUser({points: user.value.points + quizMode.value.losePoints}).then(() => {
    useQuizStore().$reset();
    leavePopupPageText.value = ''
    props.f7router.navigate("/");
  });
}

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
