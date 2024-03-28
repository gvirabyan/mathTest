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
          {{ categoryID }}
        </f7-button>
        {{ categoryName }}
      </template>
      <p style="width: auto">{{ allQuestions.length }}</p>
    </f7-navbar>
    <div style="padding: 0 10px 20px">
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
        <div v-else-if="exercise?.question.startsWith('@pre@')" style="font-size: 20px; line-height: 1">
          <pre v-html="$sanitize(exercise?.question.slice(5))"></pre>
        </div>
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
          <span v-else-if="exercise?.answer.startsWith('@pre@')" style="font-size: 20px; line-height: 1">
            <pre v-html="$sanitize(exercise?.answer.slice(5))"></pre>
          </span>
          <span v-else-if="exercise?.answer.startsWith('@')" style="font-weight: bold">{{
            exercise.answer.slice(1)
          }}</span>
          <math-jax v-else :latex="'\\sf ' + exercise?.answer"></math-jax>
        </p>
        <p v-for="answer in exercise?.wrong_answers" :key="answer">
          <span
            v-if="String(answer).startsWith('@@@')"
            style="font-size: 20px; line-height: 1; font-family: Rubik"
            v-html="$sanitize(answer.slice(3))"
          ></span>
          <span
            v-else-if="String(answer).startsWith('@@')"
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
          <span v-else-if="String(answer).startsWith('@pre@')" style="font-size: 20px; line-height: 1">
            <pre v-html="$sanitize(answer.slice(5))"></pre>
          </span>
          <span v-else-if="String(answer).startsWith('@')" style="font-weight: bold">{{ answer.slice(1) }}</span>
          <math-jax v-else :latex="'\\sf ' + answer"></math-jax>
        </p>
        <p v-if="exercise?.second_answer" style="background: lightblue">{{ exercise?.second_answer }}</p>
        <div style="margin: 10px 0 20px; display: flex; gap: 20px">
          <button v-if="!exercise.publishedAt" class="admin-button green" @click="editExercise(index, 'publish')">
            Publish
          </button>
          <button v-if="exercise.publishedAt" class="admin-button yellow" @click="editExercise(index, 'unpublish')">
            Unpublish
          </button>
          <p>{{ exercise.id }}</p>
          <button class="admin-button red" @dblclick="editExercise(index, 'delete')">Delete</button>
        </div>
        <hr />
      </div>
      <div>
        <f7-link :href="`/categories/${categoryID}/generateQuestions/`">Generate</f7-link>
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
const { getQuestionsForAdmin, updateExercise } = questionStore;

const isLoading = ref(false);
const categoryName = ref("");
const categoryID = ref("");
const allQuestions = ref([]);

const getAllQuestionData = async () => {
  categoryID.value = props.f7route.params.categoryID;
  isLoading.value = true;
  await delay();
  await getQuestionsForAdmin(categoryID.value, isAdmin.value).then(data => {
    allQuestions.value = data.data.results;
    categoryName.value = data.data.category_name;
    isLoading.value = false;
  });
};

const editExercise = async (index, action) => {
  isLoading.value = true;
  let question = allQuestions.value[index];
  await updateExercise({ questionId: question.id, action: action }, isAdmin.value)
    .then(resp => {
      if (action === "delete") {
        allQuestions.value.splice(index, 1);
      } else {
        allQuestions.value[index]["publishedAt"] = resp.publishedAt;
      }
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
  width: 100%;
  height: 100%;
}
.admin-button {
  text-transform: unset;
  min-height: 40px;
  height: auto;
  padding: 0 20px;
  border-radius: 6px;
  font-family: "Rubik";
  font-style: normal;
  font-weight: 500;
  font-size: 16px !important;
  line-height: 24px;
  color: #fff;
  white-space: initial;
  &.green {
    background: #157508;
  }
  &.yellow {
    background: #f8e302;
  }
  &.red {
    background: red;
  }
}
</style>
