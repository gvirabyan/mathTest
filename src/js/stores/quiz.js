import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useCategoryAnswerStore } from "@/js/stores/category-answer";
import api from "@/js/api";

export const useQuizStore = defineStore("quiz", () => {
  const categoryAnswersStore = useCategoryAnswerStore();

  const quizQuestions = ref([]);
  const quizQuestion = ref(null);
  const quizQuestionIndex = ref(0);
  const quizQuestionsLength = ref(0);
  const answeredQuizQuestions = ref([]);
  const quizMode = ref(null);
  const quizRivalType = ref("machine");
  const quizRivalId = ref(null);
  const userScore = ref(0);
  const rivalScore = ref(0);
  const lastFriendPractice = ref(null);

  const currentQuizQuestionNumber = computed(() =>
    answeredQuizQuestions.value.length + 1 > quizQuestionsLength.value
      ? answeredQuizQuestions.value.length
      : answeredQuizQuestions.value.length + 1,
  );

  const getQuizQuestions = async (limit, rival = "machine") => {
    if (quizQuestions.value.length) {
      quizQuestions.value = quizQuestions.value.filter(q => !answeredQuizQuestions.value.includes(q.id));
      quizQuestionIndex.value = 0;
      quizQuestion.value = quizQuestions.value[quizQuestionIndex.value];
      return;
    }

    return api.get(`quiz-questions?limit=${limit}&rival=${rival}`).then(data => {
      quizQuestions.value = data.questions || [];
      quizQuestion.value = quizQuestions.value[quizQuestionIndex.value];
      quizQuestionsLength.value = quizQuestions.value.length;
      categoryAnswersStore.categoryAnswers = data.categories_answers || [];

      if (data.rival_user) {
        quizRivalId.value = data.rival_user;
      }
    });
  };

  const getLastFriendPractice = async () => {
    return api.get("get-last-friend-practice").then(data => {
      if (!data?.data) {
        lastFriendPractice.value = null;
        return;
      }

      lastFriendPractice.value = data.data;
    });
  };

  const setQuizMode = mode => (quizMode.value = mode);

  const setQuizRivalType = rival => (quizRivalType.value = rival);

  const getNextQuizQuestion = () => {
    quizQuestionIndex.value++;
    quizQuestion.value = quizQuestions.value[quizQuestionIndex.value];
  };

  const updateAnsweredQuizQuestions = id => {
    answeredQuizQuestions.value.push(id);
  };

  const updateScore = (userAnswer, rivalAnswer) => {
    userScore.value = userAnswer === quizQuestion.value.answer ? userScore.value + 1 : userScore.value;
    rivalScore.value = rivalAnswer === quizQuestion.value.answer ? rivalScore.value + 1 : rivalScore.value;
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
    quizRivalType,
    quizRivalId,
    userScore,
    rivalScore,
    lastFriendPractice,
    currentQuizQuestionNumber,
    getQuizQuestions,
    getLastFriendPractice,
    setQuizMode,
    setQuizRivalType,
    getNextQuizQuestion,
    updateAnsweredQuizQuestions,
    updateScore,
    saveQuizResult,
    clearAnsweredQuizQuestions,
  };
});
