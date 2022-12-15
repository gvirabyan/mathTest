import { ref } from 'vue';
import { defineStore } from 'pinia';
import api from '@/js/api';

export const useTopList = defineStore('topList', () => {
  const topList = ref([]);

  const getTopList = (filter = '', value) => {
    const url = filter !== 'world'
      ? `users?filters[${filter}]=${value}&sort=points:desc&pagination[page]=1`
      : `users?sort=points:desc&pagination[page]=1`

    return api.get(url)
      .then(res => res.json())
      .then(data => {
        topList.value = data;
      })
  }

  return {
    topList,
    getTopList
  }
})
