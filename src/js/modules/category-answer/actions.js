import api from "../../api";

export default {
  getQuestions({ state }, categoryID) {
    api.get(`questions?filters[user_answers][id][$null]=true&filters[category][id][$eq]=${categoryID}`).then(res => res.json()).then(data => {
      state.questions = data?.data ? [...data?.data].sort(() => 0.5 - Math.random()) : [];
      state.question = state.questions[state.questionIndex];
    })
  },
  getNextQuestion({ state }) {
    state.questionIndex++;
    state.question = state.questions[state.questionIndex];
  },
}