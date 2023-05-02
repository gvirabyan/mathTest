import { computed, ref } from "vue";
import { defineStore } from "pinia";
import api from "@/js/api";
import { useCategoryAnswerStore } from "@/js/stores/category-answer";

export const useQuizStore = defineStore("quiz", () => {
  const categoryAnswersStore = useCategoryAnswerStore();

  const quizQuestions = ref(
    localStorage.getItem("quizQuestions") ? JSON.parse(localStorage.getItem("quizQuestions")) : [],
  );
  const quizQuestion = ref(null);
  const quizQuestionIndex = ref(0);
  const quizQuestionsLength = ref(0);
  const answeredQuizQuestions = ref([]);
  const quizMode = ref(null);
  const userScore = ref(0);
  const machineScore = ref(0);

  const currentQuizQuestionNumber = computed(() =>
    answeredQuizQuestions.value.length + 1 > quizQuestionsLength.value
      ? answeredQuizQuestions.value.length
      : answeredQuizQuestions.value.length + 1,
  );

  const getQuizQuestions = async limit => {
    if (quizQuestions.value.length) {
      quizQuestions.value = quizQuestions.value.filter(q => !answeredQuizQuestions.value.includes(q.id));
      quizQuestionIndex.value = 0;
      quizQuestion.value = quizQuestions.value[quizQuestionIndex.value];
      return;
    }

    return api
      .get(`quiz-questions?limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        quizQuestions.value = data.questions;
        quizQuestion.value = data.questions[quizQuestionIndex.value];
        quizQuestionsLength.value = data.questions.length;
        categoryAnswersStore.categoryAnswers = data.categories_answers;
      });
  };

  const setQuizMode = mode => {
    quizMode.value = mode;
  };

  const getNextQuizQuestion = () => {
    quizQuestionIndex.value++;
    quizQuestion.value = quizQuestions.value[quizQuestionIndex.value];
  };

  const updateAnsweredQuizQuestions = id => {
    answeredQuizQuestions.value.push(id);
  };

  const updateScore = (userAnswerStatus, machineAnswerStatus) => {
    userScore.value = userAnswerStatus === "correct" ? userScore.value + 1 : userScore.value;
    machineScore.value = machineAnswerStatus === "correct" ? machineScore.value + 1 : machineScore.value;
  };

  const saveQuizResult = async data => {
    return api
      .post("practice-results", { data })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          return { status: "error", message: data.error?.message };
        }

        return { status: "success", data: data.data };
      });
  };

  const clearAnsweredQuizQuestions = () => {
    answeredQuizQuestions.value = [];
  };

  return {
    quizQuestions,
    quizQuestion,
    quizQuestionIndex,
    quizQuestionsLength,
    answeredQuizQuestions,
    quizMode,
    userScore,
    machineScore,
    currentQuizQuestionNumber,
    getQuizQuestions,
    setQuizMode,
    getNextQuizQuestion,
    updateAnsweredQuizQuestions,
    updateScore,
    saveQuizResult,
    clearAnsweredQuizQuestions,
  };
});
