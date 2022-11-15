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
    user: {
      id: 1,
      username: "testUser"
    },
    categories: [],
    category: [],
    questions: [],
    question: {},
    questionIndex: 0,
    categoryAnswers: []
  },
  getters: {
    user({ state }) {
      return state.user;
    },
    categories({ state }) {
      return state.categories;
    },
    category({ state }) {
      return state.category;
    },
    questions({ state }) {
      return state.questions;
    },
    question({ state }) {
      return state.question;
    },
    getAnswers({ state }) {
      return getAnswersList(state.categoryAnswers, state.question?.attributes?.answer)
    }
  },
  actions: {
    getCategories({ state }) {
      fetch('http://localhost:1337/api/categories').then(res => res.json()).then(data => {
        state.categories = data.data;
      })
    },
    getCategory({ state }, categoryID) {
      fetch(`http://localhost:1337/api/categories/${categoryID}?fields=name&populate=answer`).then(res => res.json()).then(data => {
        state.category = { id: data?.data?.id, name: data?.data?.attributes?.name } || [];
        state.categoryAnswers = data?.data?.attributes?.answer?.data?.attributes?.answers?.answers || [];
      })
    },
    getQuestions({ state }, categoryID) {
      fetch(`http://localhost:1337/api/questions?filters[user_answers][id][$null]=true&filters[category][id][$eq]=${categoryID}`).then(res => res.json()).then(data => {
        state.questions = data?.data ? [...data?.data].sort(() => 0.5 - Math.random()) : [];
        state.question = state.questions[state.questionIndex];
      })
    },
    async updateUserAnsweredQuestions({ state }, answer) {
      return fetch(`http://localhost:1337/api/user-answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({data: answer})
      }).then(res => res.json()).then(data => {
        if (!data.error) {
          return { status: 'success' }
        } else {
          return  { status: 'error', message: data.error?.message }
        }
      })
    },
    getNextQuestion({ state }) {
      state.questionIndex++;
      state.question = state.questions[state.questionIndex];
    }
  }
})
export default store;
