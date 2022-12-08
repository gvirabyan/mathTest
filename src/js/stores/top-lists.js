import { ref } from 'vue';
import { defineStore } from 'pinia';
import api from '@/js/api';
import delay from '@/js/helpers/delay';

export const useTopLists = defineStore('topLists', () => {
  const worldTopList = ref([]);
  const countryTopList = ref([]);
  const cityTopList = ref([]);
  const institutionTopList = ref([]);
  const courseTopList = ref([]);

  const getTopList = async (filter = '', value) => {
    await delay();

    const url = filter
      ? `users?filters[${filter}]=${value}&sort=points:desc&pagination[start]=0&pagination[limit]=10`
      : `users?sort=points:desc&pagination[start]=0&pagination[limit]=10`

    return api.get(url)
      .then(res => res.json())
      .then(data => {
        switch (filter) {
          case "":
            worldTopList.value = data;
            break;
          case "country" :
            countryTopList.value = data;
            break;
          case "city" :
            cityTopList.value = data;
            break;
          case "institution" :
            institutionTopList.value = data;
            break;
          case "course" :
            courseTopList.value = data;
            break;
        }
      })
  }

  return {
    worldTopList,
    countryTopList,
    cityTopList,
    institutionTopList,
    courseTopList,
    getTopList
  }
})
