import api from "../../api";

export default {
  async updateUserAnsweredQuestions({ state }, answer) {
    return api.post('user-answers', { data: answer }).then(res => res.json()).then(data => {
      if (!data.error) {
        return { status: 'success' }
      } else {
        return  { status: 'error', message: data.error?.message }
      }
    })
  },
}