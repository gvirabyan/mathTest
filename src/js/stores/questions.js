import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import api from '@/js/api';

export const useQuestionsStore = defineStore('questions',() => {
  const questions = ref([]);
  const question = ref({});
  const questionIndex = ref(0);
  const answeredQuestions = ref([]);

  const questionsData = computed(() => questions.value);
  const questionData = computed(() => question.value);

  const getQuestions = (categoryID) => {
    let idsFilter = ''
    if (answeredQuestions.value) {
      idsFilter = `&filters[id][$notIn]=${answeredQuestions.value.join()}`
    }

    api.get(`questions?filters[category][id][$eq]=${categoryID}${idsFilter}`).then(res => res.json()).then(data => {
      questions.value = data?.data ? [...data?.data].sort(() => 0.5 - Math.random()) : [];
      question.value = questions.value[questionIndex.value];
    })
  };

  const getAnsweredQuestions = async (categoryID) => {
    const questionsIds = []
    await api.get(`user-answers?populate[0]=question&filters[question][category][id][$eq]=${categoryID}&filters[users_permissions_user][id][$eq]=${state.user.id}&populate[question][fields]=id&fields=id`).then(res => res.json()).then(data => {
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

  return {
    questions,
    question,
    questionIndex,
    answeredQuestions,
    questionsData,
    questionData,
    getQuestions,
    getAnsweredQuestions,
    getNextQuestion
  }
})
