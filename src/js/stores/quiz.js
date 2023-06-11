import { computed, reactive, ref } from "vue";
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
  const quizRivalPlayer = reactive({
    id: null,
    username: null,
    coefficient: null,
  });
  const userScore = ref(0);
  const rivalScore = ref(0);
  const lastFriendPractice = reactive({
    firstPlayer: {
      nickname: null,
      score: null,
      rightAnswers: null,
      result: null,
    },
    secondPlayer: {
      nickname: null,
      score: null,
      rightAnswers: null,
      result: null,
    },
    mode: {
      questions: null,
    },
  });

  const currentQuizQuestionNumber = computed(() =>
    answeredQuizQuestions.value.length + 1 > quizQuestionsLength.value
      ? answeredQuizQuestions.value.length
      : answeredQuizQuestions.value.length + 1,
  );

  const currentQuizQuestionId = computed(() => quizQuestion.value?.id);

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
        quizRivalPlayer.id = data.rival_user.id;
        quizRivalPlayer.username = data.rival_user.username;
        quizRivalPlayer.coefficient = data.rival_user.coefficient;
      }
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

  const updateUserScore = userAnswer => {
    userScore.value = userAnswer === quizQuestion.value.answer ? userScore.value + 1 : userScore.value;
  };

  const updateRivalScore = rivalAnswer => {
    rivalScore.value = rivalAnswer === quizQuestion.value.answer ? rivalScore.value + 1 : rivalScore.value;
  };

  const updateScore = (userAnswer, rivalAnswer, delay = 0) => {
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

  const clearLastFriendPractice = () => {
    lastFriendPractice.firstPlayer.nickname = null;
    lastFriendPractice.firstPlayer.score = null;
    lastFriendPractice.firstPlayer.rightAnswers = null;
    lastFriendPractice.firstPlayer.result = null;
    lastFriendPractice.secondPlayer.nickname = null;
    lastFriendPractice.secondPlayer.score = null;
    lastFriendPractice.secondPlayer.rightAnswers = null;
    lastFriendPractice.secondPlayer.result = null;
    lastFriendPractice.mode.questions = null;
  };

  const clearStore = () => {
    quizQuestions.value = [];
    quizQuestion.value = null;
    quizQuestionIndex.value = 0;
    quizQuestionsLength.value = 0;
    answeredQuizQuestions.value = [];
    quizMode.value = null;
    quizRivalType.value = "machine";
    quizRivalPlayer.id = null;
    quizRivalPlayer.username = null;
    quizRivalPlayer.coefficient = null;
    userScore.value = 0;
    rivalScore.value = 0;
  };

  return {
    quizQuestions,
    quizQuestion,
    quizQuestionIndex,
    quizQuestionsLength,
    answeredQuizQuestions,
    quizMode,
    quizRivalType,
    quizRivalPlayer,
    userScore,
    rivalScore,
    lastFriendPractice,
    currentQuizQuestionNumber,
    currentQuizQuestionId,
    getQuizQuestions,
    setQuizMode,
    setQuizRivalType,
    getNextQuizQuestion,
    updateAnsweredQuizQuestions,
    updateUserScore,
    updateRivalScore,
    updateScore,
    saveQuizResult,
    clearAnsweredQuizQuestions,
    clearLastFriendPractice,
    clearStore,
  };
});
