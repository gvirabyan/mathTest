import api from "../../api";

export default {
  getQuestions({ state }, categoryID) {
    let idsFilter = ''
    if (state.answeredQuestions) {
      idsFilter = `&filters[id][$notIn]=${state.answeredQuestions.join()}`
    }

    api.get(`questions?filters[category][id][$eq]=${categoryID}${idsFilter}`).then(res => res.json()).then(data => {
      state.questions = data?.data ? [...data?.data].sort(() => 0.5 - Math.random()) : [];
      state.question = state.questions[state.questionIndex];
    })
  },
  async getAnsweredQuestions({ state }, categoryID) {
    const questionsIds = []
    await api.get(`user-answers?populate[0]=question&filters[category][id][$eq]=${categoryID}&filters[users_permissions_user][id][$eq]=${state.user.id}&populate[question][fields]=id&fields=id`).then(res => res.json()).then(data => {
      data?.data.forEach(answer => {
        questionsIds.push(answer?.attributes?.question?.data?.id)
      })
    })

    state.answeredQuestions = questionsIds
  },
  getNextQuestion({ state }) {
    state.questionIndex++;
    state.question = state.questions[state.questionIndex];
  },
}