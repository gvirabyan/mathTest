import api from "../../api";

export default {
  async login({state}, userData) {
    return api.post('auth/local', userData).then(res => res.json()).then(data => {
      if (!data.error) {
        state.token = data?.jwt
        state.user = data?.user
        localStorage.setItem('token', state.token)
        localStorage.setItem('user', JSON.stringify(state.user))
        return {status: 'success'}
      } else {
        return {status: 'error', message: data.error?.message}
      }
    })
  },
  async register({state}, userData) {
    return api.post('auth/local/register', userData).then(res => res.json()).then(data => {
      if (!data.error) {
        state.token = data?.jwt
        state.user = data?.user
        localStorage.setItem('token', state.token)
        localStorage.setItem('user', JSON.stringify(state.user))
        return {status: 'success'}
      } else {
        return {status: 'error', message: data.error?.message}
      }
    })
  },
  async logout({state}) {
    state.token = ''
    state.user = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    return {status: 'success'}
  },
  async updatePoints({state}, answerType) {
    const point = state.user.points + state.pointsForAnswers[answerType]
    return api.put(`users/${state.user.id}`, {points : point}).then(res => res.json()).then(data => {
      state.user.points = point
      localStorage.setItem('user', JSON.stringify(state.user))
      return {status: 'success'}
    })
  },
}