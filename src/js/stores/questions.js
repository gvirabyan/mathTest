import { ref, computed } from "vue";
import { defineStore } from "pinia";
import api from "@/js/api";
import { useAuthStore } from "@/js/stores/auth";

export const useQuestionsStore = defineStore("questions", () => {
  const questions = ref([]);
  const question = ref(null);
  const questionIndex = ref(0);
  const questionsAreLoaded = ref(false);
  const answeredQuestions = ref([]);
  const answeredQuestionsData = ref([]);
  const answeredQuestionsCount = ref(null);
  const answeredQuestionsPoints = ref(0);

  const auth = useAuthStore();

  const questionsData = computed(() => questions.value);
  const questionData = computed(() => question.value);
  const questionsAreOver = computed(() => !questions.value.length && questionsAreLoaded.value);

  const getQuestions = categoryID => {
    questionsAreLoaded.value = false;

    return api
      .get(`non-answered-questions?categoryId=${categoryID}&pagination[page]=1`)
      .then(res => res.json())
      .then(data => {
        const resData = data?.data?.attributes?.results;

        questionsAreLoaded.value = true;
        questions.value = resData.length ? [...resData].sort(() => 0.5 - Math.random()) : [];
        questionIndex.value = 0;
        question.value = questions.value[questionIndex.value];
        answeredQuestions.value = [];
      });
  };

  const getAnsweredQuestions = async categoryID => {
    const questionsIds = [];
    await api
      .get(
        `user-answers?populate[0]=question&filters[question][category][id][$eq]=${categoryID}&filters[users_permissions_user][id][$eq]=${auth.user.id}&populate[question][fields]=id&fields=id&pagination[limit]=200`,
      )
      .then(res => res.json())
      .then(data => {
        answeredQuestionsData.value = data?.data;
        answeredQuestionsPoints.value = data?.topic_points;

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

  return {
    questions,
    question,
    questionIndex,
    questionsAreLoaded,
    answeredQuestions,
    answeredQuestionsData,
    answeredQuestionsCount,
    answeredQuestionsPoints,
    questionsData,
    questionData,
    questionsAreOver,
    getQuestions,
    getAnsweredQuestions,
    getAnsweredQuestionsCount,
    getNextQuestion,
  };
});
