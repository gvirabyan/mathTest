<template>
  <f7-page class="hg-question-page" name="question" @page:beforein="getAllQuestionData" @page:afterout="outPage">
    <f7-navbar>
      <template v-if="isLoading" #title>
        <f7-button @click="clearStores">
          <img src="@/assets/icons/backSlag.svg" alt="" />
        </f7-button>
        {{ `${$t("over.loading")}...` }}
      </template>
      <template v-else #title>
        <f7-button @click="clearStores">
          <img src="@/assets/icons/backSlag.svg" alt="" />
        </f7-button>
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
        :present="!!point.present"
        :history-circle="indexHistory"
        @click="showHistory(point)"
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
              <math-jax :latex="'\\sf ' + answer"></math-jax>
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
              'hg-correct-answer':
                (sentAnswer && question?.answer === answer) ||
                (question.second_answer && (showInputPopup || isSentSecondAnswer) && question?.answer === answer),
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
              <math-jax :latex="'\\sf ' + answer"></math-jax>
            </f7-col>
          </f7-list-item>
        </f7-list>
      </div>
      <div class="hg-actions-btns-content">
        <f7-row v-if="showSkipSendBtns">
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
    @close="checkSkipped"
    @leave-changes="goBack"
    @save-changes="checkSkipped"
  />

  <input-popup
    v-if="showInputPopup"
    :send-btn-class="secondAnswerStatus"
    :is-sending="isSendingSecondAnswer"
    :is-sent="isSentSecondAnswer"
    :first-answer="chosenAnswer"
    @input-answer="sendSecondAnswer"
    @go-next="next"
    @close="closeInputPopupHandler"
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
              <f7-block-title> {{ dataYetNotUpdating || $t("question.your-score-on-this-topic") }} </f7-block-title>
              <p v-if="!dataYetNotUpdating" class="place-txt">
                {{ answeredQuestionsPoints }} {{ pluralizeWord(correctAnswers.length, $t("question.point")) }}
              </p>
            </f7-row>

            <f7-row v-if="!dataYetNotUpdating" class="justify-content-space-between align-items-center">
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
import { computed, defineAsyncComponent, nextTick, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { f7 } from "framework7-vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/js/stores/auth";
import { useCategoryAnswerStore } from "@/js/stores/category-answer";
import { useQuestionsStore } from "@/js/stores/questions";
import { useCategoryClassesStore } from "@/js/stores/category-classes";
import delay from "@/js/helpers/delay";
import pluralizeWord from "../js/utils/pluralize-word";
import playAudioMixin from "@/js/mixins/play_audio";
import Circle from "@/components/circle.vue";
import LoadingSmall from "@/components/loading-small.vue";

const LeavePagePopup = defineAsyncComponent(() => import("@/components/leave-page-popup.vue"));
const InputPopup = defineAsyncComponent(() => import("@/components/input-popup.vue"));

const { playAudio } = playAudioMixin.setup();
const storeCategoryClass = useCategoryClassesStore();
const { selectedClass } = storeToRefs(storeCategoryClass);

const i18n = useI18n();

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
  offline,
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
const showInputPopup = ref(false);
const chosenSecondAnswer = ref(null);
const secondAnswerStatus = ref("");
const isSendingSecondAnswer = ref(false);
const isSentSecondAnswer = ref(false);

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
          id: history.value[i] ? history.value[i].id : null,
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
          status: "normal",
          present: i === 0,
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
const showSkipSendBtns = computed(() => {
  if (question.value.second_answer) {
    return !isSentSecondAnswer.value;
  }

  return !sentAnswer.value;
});

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

const closeInputPopupHandler = () => {
  showInputPopup.value = false;
  chosenAnswer.value = null;
  chosenAnswerIndex.value = null;
};

const status = ref("normal");
const sendAnswer = () => {
  if (chosenAnswer.value && !isSending.value) {
    if (question.value.second_answer) {
      status.value = question.value.answer === chosenAnswer.value ? "correct" : "wrong";
      //save user answer
      questions.value.find(q => q.id === question.value.id).user_answer = {
        status: status.value,
        answer: chosenAnswer.value,
      };

      playAudio(status.value);

      if (status.value === "wrong") {
        updateUserAnsweredQuestions({
          users_permissions_user: user.value.id,
          question: question.value.id,
          category: categoryQuestion.value.id,
          answer: chosenAnswer.value,
          status: status.value,
          answer_type: "topic",
        })
          .then(resp => {
            if (resp.status !== "success") {
              clearChosenData();
              f7.toast.show({
                text: resp.message,
                closeButton: true,
              });
            }
          })
          .catch(() => {
            offline.value = true;
          });

        return;
      }

      showInputPopup.value = true;

      return;
    }

    sentAnswer.value = true;
    status.value = question.value.answer === chosenAnswer.value ? "correct" : "wrong";
    //save user answer
    questions.value.find(q => q.id === question.value.id).user_answer = {
      status: status.value,
      answer: chosenAnswer.value,
    };
    playAudio(status.value);
    updateUserAnsweredQuestions({
      users_permissions_user: user.value.id,
      question: question.value.id,
      category: categoryQuestion.value.id,
      answer: chosenAnswer.value,
      status: status.value,
      answer_type: "topic",
    })
      .then(resp => {
        if (resp.status !== "success") {
          clearChosenData();
          f7.toast.show({
            text: resp.message,
            closeButton: true,
          });
        }
      })
      .catch(() => {
        offline.value = true;
      });
  }
};

const sendSecondAnswer = answer => {
  chosenSecondAnswer.value = answer;

  isSendingSecondAnswer.value = true;
  secondAnswerStatus.value = question.value.second_answer === answer ? "correct" : "wrong";
  //save user second answer
  questions.value.find(q => q.id === question.value.id).user_answer = {
    status: secondAnswerStatus.value,
    answer: chosenAnswer.value,
    second_answer: answer,
  };
  playAudio(secondAnswerStatus.value);
  updateUserAnsweredQuestions({
    users_permissions_user: user.value.id,
    question: question.value.id,
    category: categoryQuestion.value.id,
    answer: chosenAnswer.value,
    second_answer: answer,
    status: secondAnswerStatus.value,
    answer_type: "topic",
  })
    .then(resp => {
      if (resp.status !== "success") {
        clearChosenData();
        f7.toast.show({
          text: resp.message,
          closeButton: true,
        });
      }
    })
    .catch(() => {
      offline.value = true;
    });

  setTimeout(() => {
    isSendingSecondAnswer.value = false;
    isSentSecondAnswer.value = true;
  }, 200);
};

const questionHistory = ref(null);
const indexHistory = ref(null);

const showHistory = point => {
  const getFirstPoint = getPoints.value.find(p => p.status === "normal");
  if (point.status !== "normal" || Number(getFirstPoint.point) === Number(point.point)) {
    indexHistory.value = Number(point.point) - 1;
    // previous question status change
    const previousQuestion = getPoints.value.find(p => p.present);
    if (previousQuestion) {
      getPoints.value.find(p => p.present).present = false;
    }
    // show chosen question
    if (indexHistory.value < history.value.length) {
      questionHistory.value = history.value[indexHistory.value];
    } else if (point.status === "skipped" || point.status === "normal") {
      getNextQuestion(point.id);
      getPoints.value[indexHistory.value].present = true;
      questionHistory.value = null;
      indexHistory.value = null;
    } else {
      questionHistory.value = questions.value[indexHistory.value - history.value.length];
    }
    //circle go on the point
    onOrientationChange();
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

const skip = () => {
  status.value = "skipped";
  playAudio("skipped");
  updateUserAnsweredQuestions({
    users_permissions_user: user.value.id,
    question: question.value.id,
    category: categoryQuestion.value.id,
    answer: "",
    status: "skipped",
    answer_type: "topic",
  }).then(resp => {
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

const checkSkipPopup = ref(false);

const goBack = () => {
  checkSkipPopup.value = false;
  props.f7router.back();
};

const keepPresentIndex = ref(null);

const goPresentQuestion = () => {
  questionHistory.value = null;
  indexHistory.value = null;
  if (getPoints.value.find(p => p.status === "normal")) {
    getPoints.value.find(p => p.status === "normal").present = true;
  } else {
    getPoints.value.find(p => p.status === "skipped").present = true;
  }
  onOrientationChange();
};

const checkSkipped = () => {
  checkSkipPopup.value = null;
  next();
};

const dataYetNotUpdating = ref("");

const next = async () => {
  const previousPoint = getPoints.value.find(v => v.present);
  if (previousPoint) {
    //update status of answered question
    getPoints.value.find(v => v.present).status = status.value;
    getPoints.value.find(v => v.present).present = false;
  }

  clearChosenData();

  const nextPoint = getPoints.value.find(v => v.status === "normal");
  const skippedPoint = getPoints.value.find(
    v =>
      (v.status === "normal" || v.status === "skipped") &&
      (!previousPoint || Number(v.point) > Number(previousPoint.point)),
  );
  const checkFinished = getPoints.value.find(v => v.status === "normal" || v.status === "skipped");
  if (checkFinished === undefined) {
    //game is finished, open result popup
    await getQuestions(props.f7route.params.categoryID, false)
      .then(async data => {
        isAllAnsweredPopup.value = true;
        if (data.data.results.length) {
          questions.value.forEach(question => {
            const answeredData = data.data.results.find(r => r.id === question.id);
            if (answeredData) {
              updateUserAnsweredQuestions({
                users_permissions_user: user.value.id,
                question: question.id,
                category: categoryQuestion.value.id,
                answer: question.user_answer.answer,
                status: question.user_answer.status,
                answer_type: "topic",
              });
            }
          });
          dataYetNotUpdating.value = i18n.t("question.will-be-update");
        } else {
          await getAnsweredQuestions(props.f7route.params.categoryID);
        }
      })
      .catch(() => {
        dataYetNotUpdating.value = i18n.t("question.will-be-update");
        offline.value = true;
      });
  } else if (!skippedPoint && !checkSkipPopup.value) {
    // open popup with amount of skipped questions
    const quantity = getPoints.value.filter(v => v.status === "skipped").length;
    if (quantity === 1) {
      checkSkipPopup.value = i18n.t("question.single-skipped-text");
    } else {
      checkSkipPopup.value = `${i18n.t("question.skipped-first-text")} ${quantity} ${i18n.t(
        "question.skipped-second-text",
      )}`;
    }
  } else if (nextPoint) {
    // go to next normal question
    getNextQuestion(nextPoint.id);
    getPoints.value.find(v => v.status === "normal").present = true;
    onOrientationChange();
  } else {
    // go to next skipped question
    getNextQuestion(skippedPoint.id);
    getPoints.value.find(
      v => v.status === "skipped" && (!previousPoint || Number(v.point) > Number(previousPoint.point)),
    ).present = true;
    onOrientationChange();
  }
};

const clearChosenData = () => {
  chosenAnswer.value = null;
  chosenAnswerIndex.value = null;
  sentAnswer.value = false;

  showInputPopup.value = false;
  chosenSecondAnswer.value = null;
  isSentSecondAnswer.value = false;
  secondAnswerStatus.value = "";
};

const clearStores = async () => {
  props.f7router.navigate(`${props.f7router.history[props.f7router.history.length - 2]}`);
  if (isSending.value) return;
  isAllAnsweredPopup.value = false;
  if (!offline.value) {
    questionStore.$reset();
    categoryAnswerStore.$reset();
    clearCategory();
  }
};

const closeAndNavigate = href => {
  clearStores();
  isAllAnsweredPopup.value = false;
  dataYetNotUpdating.value = "";
  href === "/" ? props.f7router.navigate(href) : props.f7router.navigate(`/${href}/`);
};

watch(questionsAreOver, async val => {
  if (!val) return;

  isAllAnsweredPopup.value = true;
  await getAnsweredQuestions(props.f7route.params.categoryID);
});

const onOrientationChange = () => {
  const presentPoint = getPoints.value.find(p => p.present);
  let index = indexHistory.value;
  if (presentPoint) {
    index = Number(presentPoint.point) - 1;
  }
  circles.value.scrollLeft +=
    circles.value.children[index].getBoundingClientRect().left - 2 - circles.value.clientWidth / 2;
};

const outPage = () => {
  window.removeEventListener("resize", onOrientationChange);
};
</script>

<style lang="scss">
@import "../assets/scss/pages/question";
</style>
