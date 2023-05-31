import { ref, computed } from "vue";
import { defineStore } from "pinia";
import api from "@/js/api";

export const useQuestionsStore = defineStore("questions", () => {
  const questions = ref([]);
  const history = ref([]);
  const question = ref(null);
  const questionIndex = ref(0);
  const questionsAreLoaded = ref(false);
  const answeredQuestions = ref([]);
  const answeredQuestionsData = ref([]);
  const answeredQuestionsCount = ref(null);
  const answeredQuestionsPoints = ref(0);

  const questionsData = computed(() => questions.value);
  const questionData = computed(() => question.value);
  const questionsAreOver = computed(() => !questions.value.length && questionsAreLoaded.value);
  const selectedCategoryId = ref(null);

  //category data for questions
  const categoryQuestion = ref({});
  const clearCategory = () => {
    categoryQuestion.value = {};
  };

  const getQuestions = categoryID => {
    questionsAreLoaded.value = false;
    return api.get(`topic-questions?categoryId=${categoryID}&pagination[page]=1`).then(data => {
      categoryQuestion.value = {
        id: categoryID,
        classId: data?.data?.class_id,
        name: data?.data?.category_name,
        questions_amount: data?.meta?.total + data?.data?.history.length,
      };
      const resData = data?.data?.results;
      if (history.value.length === 0) {
        history.value = data?.data?.history;
      }
      questionsAreLoaded.value = true;
      if (categoryID === selectedCategoryId.value) {
        questions.value = resData.length ? [...questions.value, ...resData.sort(() => 0.5 - Math.random())] : [];
      } else {
        questions.value = resData.length ? [...resData].sort(() => 0.5 - Math.random()) : [];
        questionIndex.value = 0;
        answeredQuestions.value = [];
      }
      question.value = questions.value[questionIndex.value];
      selectedCategoryId.value = categoryID;
    });
  };

  const getAnsweredQuestions = async categoryID => {
    const questionsIds = [];
    await api
      .get(
        `user-answers?populate[0]=question&filters[question][category][id][$eq]=${categoryID}&filters[users_permissions_user][id][$eq][0]=${localStorage.getItem(
          "user-id",
        )}&filters[status][$ne][1]=skipped&populate[question][fields]=id&fields=id&pagination[limit]=200`,
      )
      .then(data => {
        answeredQuestionsData.value = data?.data;
        answeredQuestionsPoints.value = data?.topic_points;

        data?.data.forEach(answer => {
          questionsIds.push(answer?.attributes?.question?.data?.id);
        });
      });

    answeredQuestions.value = questionsIds;
  };

  const getNextQuestion = (id = null) => {
    if (id) {
      question.value = questions.value.find((q, i) => {
        if (q.id === id) {
          questionIndex.value = i;
          return q;
        }
      });
    } else {
      questionIndex.value++;
      question.value = questions.value[questionIndex.value];
    }
  };

  const getAnsweredQuestionsCount = async () => {
    api.get(`answered-questions`).then(data => {
      answeredQuestionsCount.value = data.result;
    });
  };

  return {
    questions,
    history,
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
    categoryQuestion,
    clearCategory,
    getQuestions,
    getAnsweredQuestions,
    getAnsweredQuestionsCount,
    getNextQuestion,
  };
});
