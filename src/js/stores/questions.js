import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";
import api from "@/js/api";
import { useAuthStore } from "@/js/stores/auth";

export const useQuestionsStore = defineStore("questions", () => {
  const questions = ref([]);
  const question = ref(null);
  const questionIndex = ref(0);
  const answeredQuestions = ref([]);
  const answeredQuestionsCount = ref(null);
  const meta = reactive({
    pagination: null,
  });

  const auth = useAuthStore();

  const questionsData = computed(() => questions.value);
  const questionData = computed(() => question.value);

  const getQuestions = categoryID => {
    if (meta.pagination) {
      if (meta.pagination.page === meta.pagination.pageCount) {
        return;
      } else {
        api
          .get(`non-answered-questions?categoryId=${categoryID}&pagination[page]=1`)
          .then(res => res.json())
          .then(data => {
            const rawData = data?.data?.attributes?.results;
            let result = rawData ? [...rawData].sort(() => 0.5 - Math.random()) : [];
            questions.value = [...questions.value, ...result];
            question.value = questions.value[questionIndex.value];
            meta.pagination = data?.data?.attributes?.pagination;
          });
      }
    } else {
      api
        .get(`non-answered-questions?categoryId=${categoryID}&pagination[page]=1`)
        .then(res => res.json())
        .then(data => {
          const rawData = data?.data?.attributes?.results;
          questions.value = rawData ? [...rawData].sort(() => 0.5 - Math.random()) : [];
          question.value = questions.value[questionIndex.value];
          meta.pagination = data?.data?.attributes?.pagination;
        });
    }
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

  return {
    questions,
    question,
    meta,
    questionIndex,
    answeredQuestions,
    answeredQuestionsCount,
    questionsData,
    questionData,
    getQuestions,
    getAnsweredQuestions,
    getAnsweredQuestionsCount,
    getNextQuestion,
  };
});
