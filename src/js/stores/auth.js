import {computed, ref, watch} from 'vue';
import {defineStore} from 'pinia';
import api from '@/js/api';

export const useAuthStore = defineStore('auth', () => {
  // state properties
  const token = ref(localStorage.getItem('user') || '');
  const user = ref(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);

  // getters
  const userData = computed(() => user.value);

  // actions
  const login = async userData => {
    return api.post('auth/local?populate[0]=institution', userData).then(res => res.json()).then(data => {
      if (!data.error) {
        token.value = data?.jwt
        user.value = data?.user

        return {status: 'success'}
      } else {
        return {status: 'error', message: data.error?.message}
      }
    })
  };

  const register = async userData => {
    return api.post('auth/local/register', userData)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          token.value = data?.jwt;
          user.value = data?.user;

          return {status: 'success'};
        } else {
          return {status: 'error', message: data.error?.message};
        }
      });
  };

  const registerByNickname = async userData => {
    return api.post('auth/local/register-by-nickname', userData)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          token.value = data?.jwt;
          user.value = data?.user;

          return {status: 'success'};
        } else {
          return {status: 'error', message: data.error?.message};
        }
      });
  }

  const getUser = async () => {
    return api.get(`users/${user.value.id}?populate[0]=institution`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          user.value = data;

          return {status: 'success'};
        } else {
          return {status: 'error', message: data.error?.message};
        }
      });
  };

  const updateUser = async (userData) => {
    return api.put(`users/${user.value.id}`, {...userData})
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          user.value = data

          return {status: 'success'}
        } else {
          return {status: 'error', message: data.error?.message}
        }
    })
  }

  const logout = async () => {
    token.value = ''
    user.value = null

    return {status: 'success'}
  };

  watch(token, val => {
    if (!val) {
      localStorage.removeItem('token');
      return;
    }

    localStorage.setItem('token', val)
  })

  watch(user, val => {
    if (!val) {
      localStorage.removeItem('user');
      return;
    }

    localStorage.setItem('user', JSON.stringify(val))
  })

  return {
    token,
    user,
    userData,
    login,
    register,
    registerByNickname,
    getUser,
    updateUser,
    logout,
  }
});
