import {computed, ref} from 'vue';
import { defineStore } from 'pinia';
import api from '@/js/api';
import { useQuestionsStore } from '@/js/stores/questions';

export const useCategoryAnswerStore = defineStore('category-answer',() => {
  const questionStore = useQuestionsStore();
  const categoryAnswers = ref([]);

  const answersData = computed(() => getAnswersList(categoryAnswers.value, questionStore.question?.attributes?.answer))

  const getAnswersList = (data, answer) => {
    const strData = data.map(item => typeof item === 'string' ? item : String(item));
    const uniqueStrData = [...new Set(strData)];
    const shuffled = [...uniqueStrData].sort(() => 0.5 - Math.random());
    const randomData = shuffled.slice(0, 4);

    if (!randomData.includes(answer)) {
      randomData[3] = answer
    }

    return [...randomData].sort(() => 0.5 - Math.random());
  }

  const updateUserAnsweredQuestions =  async (answer) => {
    return api.post('user-answers', { data: answer }).then(res => res.json()).then(data => {
      if (!data.error) {
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
