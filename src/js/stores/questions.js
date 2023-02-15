import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import api from "@/js/api";
import { useAuthStore } from "@/js/stores/auth";
import { useCategoryAnswerStore } from "@/js/stores/category-answer";

export const useQuestionsStore = defineStore("questions", () => {
  const categoryAnswersStore = useCategoryAnswerStore();

  const questions = ref([]);
  const question = ref(null);
  const questionIndex = ref(0);
  const answeredQuestions = ref([]);
  const answeredQuestionsCount = ref(null);
  const answeredQuizQuestions = ref(
    localStorage.getItem("answeredQuizQuestions") ? JSON.parse(localStorage.getItem("answeredQuizQuestions")) : [],
  );
  const quizMode = ref(null);
  const meta = ref(null);

  const auth = useAuthStore();

  const questionsData = computed(() => questions.value);
  const questionData = computed(() => question.value);

  const getQuestions = categoryID => {
    let idsFilter = "";

    if (answeredQuestions.value.length) {
      idsFilter = `&filters[id][$notIn]=${answeredQuestions.value.join()}`;
    }

    if (meta.value) {
      if (meta.value.pagination.page === meta.value.pagination.pageCount) {
        return;
      } else {
        api
          .get(`questions?filters[category][id][$eq]=${categoryID}${idsFilter}&pagination[page]=1`)
          .then(res => res.json())
          .then(data => {
            let result = data?.data ? [...data?.data].sort(() => 0.5 - Math.random()) : [];
            questions.value = [...questions.value, ...result];
            question.value = questions.value[questionIndex.value];
            meta.value = data?.meta;
          });
      }
    } else {
      api
        .get(`questions?filters[category][id][$eq]=${categoryID}${idsFilter}&pagination[page]=1`)
        .then(res => res.json())
        .then(data => {
          questions.value = data?.data ? [...data?.data].sort(() => 0.5 - Math.random()) : [];
          question.value = questions.value[questionIndex.value];
          meta.value = data?.meta;
        });
    }
  };

  const getQuizQuestions = async (limit, categories) => {
    const categoriesIds = categories.join();
    let idsFilter = "";

    if (answeredQuizQuestions.value.length) {
      idsFilter = `answeredQuizQuestions.value.join()`;
    }

    await api
      .get(`quiz-questions?categories=${categoriesIds}&excludedQuestions=${idsFilter}&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        questions.value = data.questions;
        categoryAnswersStore.categoryAnswers = data.categories_answers;
      });
  };

  const getAnsweredQuestions = async categoryID => {
    const questionsIds = [];
    await api
      .get(
        `user-answers?populate[0]=question&filters[question][category][id][$eq]=${categoryID}&filters[users_permissions_user][id][$eq]=${auth.user.id}&populate[question][fields]=id&fields=id&pagination[limit]=-1`,
      )
      .then(res => res.json())
      .then(data => {
        data?.data.forEach(answer => {
          questionsIds.push(answer?.attributes?.question?.data?.id);
        });
      });

    answeredQuestions.value = questionsIds;
  };

  const getNextQuestion = () => {
    questionIndex.value++;
    question.value = questions.value[questionIndex.value];
  };

  const getAnsweredQuestionsCount = async () => {
    api
      .get(`answered-questions`)
      .then(res => res.json())
      .then(data => {
        answeredQuestionsCount.value = data.result;
      });
  };

  const setQuizMode = mode => {
    quizMode.value = mode;
  };

  const clearAnsweredQuizQuestions = () => {
    answeredQuizQuestions.value = [];
  };

  watch(answeredQuizQuestions, val => {
    if (!val) {
      localStorage.removeItem("answeredQuizQuestions");
      return;
    }

    localStorage.setItem("answeredQuizQuestions", val);
  });

  return {
    questions,
    question,
    answeredQuizQuestions,
    quizMode,
    meta,
    questionIndex,
    answeredQuestions,
    answeredQuestionsCount,
    questionsData,
    questionData,
    getQuestions,
    getQuizQuestions,
    getAnsweredQuestions,
    getAnsweredQuestionsCount,
    getNextQuestion,
    setQuizMode,
  };
});
