import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import api from '@/js/api';
import {useAuthStore} from '@/js/stores/auth';

export const useQuestionsStore = defineStore('questions',() => {
  const questions = ref([]);
  const question = ref({});
  const questionIndex = ref(0);
  const answeredQuestions = ref([]);
  const answeredQuestionsCount = ref(null);

  const auth = useAuthStore();

  const questionsData = computed(() => questions.value);
  const questionData = computed(() => question.value);

  const getQuestions = (categoryID) => {
    let idsFilter = ''
    if (answeredQuestions.value) {
      idsFilter = `&filters[id][$notIn]=${answeredQuestions.value.join()}`
    }

    const limit = 25;
    let page;

    if (answeredQuestions.value.length > limit) {
      page = Math.ceil(answeredQuestions.value.length / limit)
    } else if (answeredQuestions.value.length === limit) {
      page = Math.ceil(answeredQuestions.value.length / limit) + 1
    } else {
      page = 1;
    }

    api.get(`questions?filters[category][id][$eq]=${categoryID}${idsFilter}&pagination[page]=1`)
      .then(res => res.json())
      .then(data => {
        questions.value = data?.data ? [...data?.data].sort(() => 0.5 - Math.random()) : [];
        question.value = questions.value[questionIndex.value];
      })
  };

  const getAnsweredQuestions = async (categoryID) => {
    const questionsIds = []
    await api.get(`user-answers?populate[0]=question&filters[question][category][id][$eq]=${categoryID}&filters[users_permissions_user][id][$eq]=${auth.user.id}&populate[question][fields]=id&fields=id&pagination[page]=2`)
      .then(res => res.json())
      .then(data => {
        data?.data.forEach(answer => {
          questionsIds.push(answer?.attributes?.question?.data?.id)
        })
    })

    answeredQuestions.value = questionsIds
  };

  const getNextQuestion = () => {
    questionIndex.value++;
    question.value = questions.value[questionIndex.value];
  };

  const getAnsweredQuestionsCount = async () => {
    api.get(`answered-questions`).then(res => res.json()).then(data => {
      answeredQuestionsCount.value = data.result
    })
  };

  return {
    questions,
    question,
    questionIndex,
    answeredQuestions,
    answeredQuestionsCount,
    questionsData,
    questionData,
    getQuestions,
    getAnsweredQuestions,
    getAnsweredQuestionsCount,
    getNextQuestion
  }
})
