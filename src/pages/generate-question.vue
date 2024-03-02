<template>
  <f7-page class="hg-question-page" name="question" @page:beforein="getAllQuestionData">
    <f7-navbar>
      <template v-if="isLoading" #title>
        <f7-button @click="goPreviousPage">
          <img src="@/assets/icons/backSlag.svg" alt="" />
        </f7-button>
        {{ `${$t("over.loading")}...` }}
      </template>
      <template v-else #title>
        <f7-button @click="goPreviousPage">
          <img src="@/assets/icons/backSlag.svg" alt="" />
        </f7-button>
        {{ categoryName }}
      </template>
      <button style="width: auto" @click="createQuestions">Submit</button>
    </f7-navbar>
    <div style="padding: 0 10px 120px">
      <div v-for="(exercise, index) in allQuestions" :key="exercise.id">
        <div
          v-if="exercise?.question.startsWith('@@@')"
          style="font-size: 20px; line-height: 1"
          v-html="$sanitize(exercise?.question.slice(3))"
        ></div>
        <div
          v-else-if="exercise?.question.startsWith('@@')"
          style="
            font-size: 20px;
            line-height: 1;
            font-family: monospace;
            font-weight: bold;
            letter-spacing: 5px;
            display: flex;
            flex-flow: column wrap;
          "
          v-html="$sanitize(exercise?.question.slice(2))"
        ></div>
        <div
          v-else-if="exercise?.question.startsWith('@emoji@')"
          style="font-size: 20px; line-height: 1.5; display: flex; flex-flow: column wrap"
          v-html="$sanitize(exercise?.question.slice(7))"
        ></div>
        <p v-else-if="exercise?.question.startsWith('@')" style="font-size: 20px; line-height: 1">
          {{ exercise?.question.slice(1) }}
        </p>
        <math-jax v-else :latex="'\\Large \\sf ' + exercise?.question" :block="true"></math-jax>
        <p style="background: yellow">
          <span
            v-if="exercise?.answer.startsWith('@@@')"
            style="font-size: 20px; line-height: 1; font-family: Rubik"
            v-html="$sanitize(exercise?.answer.slice(3))"
          ></span>
          <span
            v-else-if="exercise?.answer.startsWith('@@')"
            style="
              padding: 5px 0;
              line-height: 1;
              font-family: monospace;
              font-weight: bold;
              letter-spacing: 5px;
              display: flex;
              flex-flow: column wrap;
            "
            v-html="$sanitize(exercise?.answer.slice(2))"
          ></span>
          <span v-else-if="exercise?.answer.startsWith('@')" style="font-weight: bold">{{
            exercise.answer.slice(1)
          }}</span>
          <math-jax v-else :latex="'\\sf ' + exercise?.answer"></math-jax>
        </p>
        <p v-for="answer in exercise?.wrong_answers" :key="answer">
          <span
            v-if="answer.startsWith('@@@')"
            style="font-size: 20px; line-height: 1; font-family: Rubik"
            v-html="$sanitize(answer.slice(3))"
          ></span>
          <span
            v-else-if="answer.startsWith('@@')"
            style="
              padding: 5px 0;
              line-height: 1;
              font-family: monospace;
              font-weight: bold;
              letter-spacing: 5px;
              display: flex;
              flex-flow: column wrap;
            "
            v-html="$sanitize(answer.slice(2))"
          ></span>
          <span v-else-if="answer.startsWith('@')" style="font-weight: bold">{{ answer.slice(1) }}</span>
          <math-jax v-else :latex="'\\sf ' + answer"></math-jax>
        </p>
        <p v-if="exercise?.second_answer" style="background: lightblue">{{ exercise?.second_answer }}</p>
        <div style="margin: 10px 0 20px">
          <button @click="addExercise(index)">Add Exercise</button>
        </div>
        <hr />
      </div>
    </div>
    <div
      style="
        position: fixed;
        bottom: 0;
        height: 120px;
        width: 100%;
        overflow: auto;
        background: white;
        border-top: 1px solid gray;
      "
    >
      <div
        v-for="(exercise, index) in shortlistedExercises"
        :key="index"
        style="display: flex; justify-content: space-between"
      >
        <div
          v-if="exercise?.question.startsWith('@@@')"
          style="font-size: 20px; line-height: 1"
          v-html="$sanitize(exercise?.question.slice(3))"
        ></div>
        <div
          v-else-if="exercise?.question.startsWith('@@')"
          style="
            font-size: 20px;
            line-height: 1;
            font-family: monospace;
            font-weight: bold;
            letter-spacing: 5px;
            display: flex;
            flex-flow: column wrap;
          "
          v-html="$sanitize(exercise?.question.slice(2))"
        ></div>
        <div
          v-else-if="exercise?.question.startsWith('@emoji@')"
          style="font-size: 20px; line-height: 1.5; display: flex; flex-flow: column wrap"
          v-html="$sanitize(exercise?.question.slice(7))"
        ></div>
        <p v-else-if="exercise?.question.startsWith('@')" style="font-size: 20px; line-height: 1">
          {{ exercise?.question.slice(1) }}
        </p>
        <math-jax v-else :latex="'\\Large \\sf ' + exercise?.question" :block="true"></math-jax>
        <button style="width: auto" @click="removeExercise(exercise.id)">Delete</button>
      </div>
    </div>
    <loading-small v-if="isLoading" />
  </f7-page>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/js/stores/auth";
import { useQuestionsStore } from "@/js/stores/questions";
import delay from "@/js/helpers/delay";
import LoadingSmall from "@/components/loading-small.vue";

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
const { isAdmin } = storeToRefs(authStore);

const { clearCategory } = questionStore;
const { getQuestionsForAdmin, createNewQuestions } = questionStore;

const isLoading = ref(false);
const categoryName = ref("");
const allQuestions = ref([]);
const shortlistedExercises = ref({});

const getAllQuestionData = async () => {
  isLoading.value = true;
  await delay();
  await getQuestionsForAdmin(props.f7route.params.categoryID, isAdmin.value).then(data => {
    allQuestions.value = data.data.results;
    categoryName.value = data.data.category_name;
    isLoading.value = false;
  });
};

const addExercise = index => {
  let question = allQuestions.value[index];
  shortlistedExercises.value[question["id"]]
    ? delete shortlistedExercises.value[question["id"]]
    : (shortlistedExercises.value[question["id"]] = question);
};

const removeExercise = id => {
  delete shortlistedExercises.value[id];
};

const createQuestions = async () => {
  isLoading.value = true;
  let content = "Topic name: " + categoryName.value + "\n";
  let index = 1;
  for (let key in shortlistedExercises.value) {
    let question = shortlistedExercises.value[key];
    content += "Exercise example " + index + ": " + question.question + "\n";
    content += "Correct answer: " + question.answer + "\n";
    content += "Wrong answers: [" + question.wrong_answers.toString() + "]\n";
    content += "Second answer: " + question.second_answer + "\n";
    index++;
  }
  createNewQuestions({ categoryID: props.f7route.params.categoryID, content: content })
    .then(resp => {
      alert(resp.amount);
      isLoading.value = false;
    })
    .catch(() => {
      isLoading.value = false;
      alert(i18n.t("question.no-solution"));
    });
};

const goPreviousPage = () => {
  props.f7router.navigate(`${props.f7router.history[props.f7router.history.length - 2]}`);
  clearStores();
};

const clearStores = async () => {
  questionStore.$reset();
  clearCategory();
};
</script>

<style lang="scss">
@import "../assets/scss/pages/question";
.loading-container {
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>
