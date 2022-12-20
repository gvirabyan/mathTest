import {computed, ref} from 'vue';
import { defineStore } from 'pinia';
import { useQuestionsStore } from '@/js/stores/questions';
import api from '@/js/api';

export const useCategoryAnswerStore = defineStore('category-answer',() => {
  const questionStore = useQuestionsStore();
  const categoryAnswers = ref([]);

  const answersData = computed(() => getAnswersList(
    categoryAnswers.value,
    questionStore.question?.attributes?.wrong_answers,
    questionStore.question?.attributes?.answer)
  )

  const getAnswersList = (data, wrongAnswers, answer) => {
    if (wrongAnswers && wrongAnswers.length) {
      const result =  createRandomData(wrongAnswers, answer);
      return result.length > 1 ? result : createRandomData(data, answer);
    }

    return createRandomData(data, answer);
  }

  const createRandomData = (data, answer) => {
    const strData = data.map(item => typeof item === 'string' ? item : String(item));
    const uniqueStrData = [...new Set(strData)];
    const shuffled = [...uniqueStrData].sort(() => 0.5 - Math.random());
    const randomData = shuffled.length > 4 ? shuffled.slice(0, 3) : shuffled.slice(0, 4)

    if (!randomData.includes(answer)) {
      randomData.push(answer);
    }

    return [...randomData].sort(() => 0.5 - Math.random());
  }

  const updateUserAnsweredQuestions =  async (answer) => {
    return api.post('user-answers', { data: answer }).then(res => res.json()).then(data => {
      if (!data.error) {
        questionStore.answeredQuestions.push(answer.question);
        return { status: 'success' }
      } else {
        return  { status: 'error', message: data.error?.message }
      }
    })
  };

  return {
    categoryAnswers,
    answersData,
    getAnswersList,
    updateUserAnsweredQuestions
  }
})
