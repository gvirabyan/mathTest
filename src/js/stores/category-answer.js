import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useQuestionsStore } from "@/js/stores/questions";
import { useQuizStore } from "@/js/stores/quiz";
import api from "@/js/api";
import { admobInitRewarded } from "@/js/admob-rewarded";

export const useCategoryAnswerStore = defineStore("category-answer", () => {
  const questionStore = useQuestionsStore();
  const quizStore = useQuizStore();

  const categoryAnswers = ref([]);

  const answersData = computed(() => {
    const wrongAnswers = questionStore.question?.wrong_answers || quizStore.quizQuestion?.wrong_answers;
    const answer = questionStore.question?.answer || quizStore.quizQuestion?.answer;

    return getAnswersList(categoryAnswers.value, wrongAnswers, answer);
  });

  const getAnswersList = (data, wrongAnswers, answer) => {
    if (wrongAnswers && wrongAnswers.length) {
      const strData = wrongAnswers.map(item => (typeof item === "string" ? item : String(item)));
      strData.push(answer);
      return shuffle(strData);
    }

    return data.length ? createRandomData(data, answer, 3) : null;
  };

  const createRandomData = (data, answer, limit = null) => {
    const strData = data.map(item => (typeof item === "string" ? item : String(item)));
    const uniqueStrData = [...new Set(strData)];
    const shuffled = [...uniqueStrData].sort(() => 0.5 - Math.random());
    const randomData = limit ? shuffled.slice(0, limit) : shuffled;

    if (!randomData.includes(answer)) {
      randomData.push(answer);
    }

    return [...randomData].sort(() => 0.5 - Math.random());
  };

  const shuffle = array => {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  };

  const updateUserAnsweredQuestions = async (answer, mode = "topic") => {
    const req = api.post("user-answers", { data: answer });

    if (mode === "topic") {
      admobInitRewarded();
    }

    return req
      .then(res => (typeof res?.json === "function" ? res.json() : res?.data ?? res))
      .then(data => {
        if (!data?.error) {
          if (mode === "topic") {
            questionStore.answeredQuestions.push(answer.question);
          }

          return { status: "success" };
        }
        return { status: "error", message: data.error?.message };
      })
      .catch(err => ({ status: "error", message: err?.message ?? String(err) }));
  };

  return {
    categoryAnswers,
    answersData,
    getAnswersList,
    updateUserAnsweredQuestions,
  };
});
