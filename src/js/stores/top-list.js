import { ref } from 'vue';
import { defineStore } from 'pinia';
import api from '@/js/api';

export const useTopList = defineStore('topList', () => {
  const topList = ref([]);
  const topListMeta = ref(null)

  const getTopList = (filter = '', value = '', page = 1) => {
    const url = filter !== 'world'
      ? `user/get-points?filters[${filter}]=${value}&sort=points:desc&pagination[page]=${page}&pagination[pageSize]=20`
      : `user/get-points?sort=points:desc&pagination[page]=${page}&pagination[pageSize]=20`

    return api.get(url)
      .then(res => res.json())
      .then(({ results, pagination }) => {
        topList.value.push(...results);

        if (results.length) {
          topListMeta.value = pagination;
        }
      })
  }

  return {
    topList,
    topListMeta,
    getTopList
  }
})
