import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useEverydayGoalStore } from "@/js/stores/everyday-goal";
import { useQuestionsStore } from "@/js/stores/questions";
import { useQuizStore } from "@/js/stores/quiz";
import api from "@/js/api";

export const useCategoryAnswerStore = defineStore("category-answer", () => {
  const everydayGoalStore = useEverydayGoalStore();
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
      const result = createRandomData(wrongAnswers, answer);
      return result.length > 1 ? result : createRandomData(data, answer);
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

  const updateUserAnsweredQuestions = async (answer, mode = "topic") => {
    return api.post("user-answers", { data: answer }).then(data => {
      if (!data.error) {
        if (mode === "topic") {
          questionStore.answeredQuestions.push(answer.question);
        }

        everydayGoalStore.decreaseQuestionsToGoal(answer.status);

        return { status: "success" };
      } else {
        return { status: "error", message: data.error?.message };
      }
    });
  };

  return {
    categoryAnswers,
    answersData,
    getAnswersList,
    updateUserAnsweredQuestions,
  };
});
