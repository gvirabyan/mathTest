import { createStore } from 'framework7/lite';

const getAnswersList = (data, answer) => {
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  const randomData = shuffled.slice(0, 4);
  if (!randomData.includes(answer)) {
    randomData[3] = answer
  }

  return [...randomData].sort(() => 0.5 - Math.random());
}

const store = createStore({
  state: {
    categories: [],
    category: [],
    questions: [],
    questionIndex: 0,
    categoryAnswers: [],
  },
  getters: {
    categories({ state }) {
      return state.categories;
    },
    category({ state }) {
      return state.category;
    },
    questions({ state }) {
      return state.questions;
    },
    questionIndex({ state }) {
      return state.questionIndex;
    },
    getAnswers({ state }) {
      return getAnswersList(state.categoryAnswers, state.questions[state.questionIndex]?.attributes?.answer)
    }
  },
  actions: {
    getCategories({ state }) {
      fetch('http://localhost:1337/api/categories').then(res => res.json()).then(data => {
        state.categories = data.data;
      })
    },
    getCategory({ state }, categoryID) {
      fetch(`http://localhost:1337/api/categories/${categoryID}?fields=name&populate=questions,answer`).then(res => res.json()).then(data => {
        state.category = { id: data?.data?.id, name: data?.data?.attributes?.name } || [];
        state.questions = data?.data?.attributes?.questions?.data || [];
        state.categoryAnswers = data?.data?.attributes?.answer?.data?.attributes?.answers?.answers || [];
      })
    },
  }
})
export default store;
