import {computed, reactive, ref} from 'vue';
import {defineStore} from 'pinia';
import api from '@/js/api';

export const useAuthStore = defineStore('auth', () => {
  // state properties
  const token = ref(localStorage.getItem('user') || '');
  const user = ref(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
  const pointsForAnswers = reactive({
    correct: 3,
    wrong: -2,
    skipped: -1,
  });

  // getters
  const userData = computed(() => user.value);

  // actions
  const login = async userData => {
    return api.post('auth/local', userData).then(res => res.json()).then(data => {
      if (!data.error) {
        token.value = data?.jwt
        user.value = data?.user
        localStorage.setItem('token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))
        return {status: 'success'}
      } else {
        return {status: 'error', message: data.error?.message}
      }
    })
  };

  const register = async userData => {
    return api.post('auth/local/register', userData).then(res => res.json()).then(data => {
      if (!data.error) {
        token.value = data?.jwt
        user.value = data?.user
        localStorage.setItem('token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))
        return {status: 'success'}
      } else {
        return {status: 'error', message: data.error?.message}
      }
    })
  };

  const logout = async () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    return {status: 'success'}
  };

  const updatePoints = async (answerType) => {
    const point = user.value.points + pointsForAnswers[answerType]
    return api.put(`users/${user.value.id}`, {points : point}).then(res => res.json()).then(() => {
      user.value.points = point
      localStorage.setItem('user', JSON.stringify(user.value))
      return {status: 'success'}
    })
  };

  return {
    token,
    user,
    pointsForAnswers,
    userData,
    login,
    register,
    logout,
    updatePoints
  }
});
