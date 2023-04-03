import { ref } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
import api from "@/js/api";

export const useTopList = defineStore("topList", () => {
  const { user } = useAuthStore();

  const topList = ref([]);
  const topListMeta = ref(null);
  const myStats = ref(null);

  const emptyTopList = () => {
    topList.value = []
  };

  const getTopList = (filter = "", value = "", page = 1) => {
    let url;
    if (filter === "world") {
      url = `get-points?sort=points:desc&pagination[page]=${page}&pagination[pageSize]=100`;
    } else if (filter === "course") {
      url = `get-points?filters[institution]=${user.institution.place_id}&filters[${filter}]=${value}&sort=points:desc&pagination[page]=${page}&pagination[pageSize]=100`;
    } else {
      url = `get-points?filters[${filter}]=${value}&sort=points:desc&pagination[page]=${page}&pagination[pageSize]=100`;
    }
    topList.value = []

    return api
      .get(url)
      .then(res => res.json())
      .then(({ results, pagination }) => {
        topList.value.push(...results);
      });
  };

  const getMyStats = () => {
    return api
      .get(`get-stats/${user.id}`)
      .then(res => res.json())
      .then(data => {
        myStats.value = data;
      });
  };

  const getRankings = () => {
    return api
      .get(`get-rankings`)
      .then(res => res.json())
      .then(({rankings}) => rankings);
  };

  return {
    topList,
    topListMeta,
    myStats,
    emptyTopList,
    getRankings,
    getTopList,
    getMyStats,
  };
});
