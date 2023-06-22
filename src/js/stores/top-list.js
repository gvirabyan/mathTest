import { ref } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
import api from "@/js/api";

export const useTopListStore = defineStore("top-list", () => {
  const userStore = useAuthStore();

  const topList = ref([]);
  const topListMeta = ref(null);
  const myStats = ref(null);
  const selectedTopListUserId = ref(null);

  const emptyTopList = () => {
    topList.value = [];
  };

  const getTopList = (filter = "", value = "") => {
    let url;
    if (filter === "world") {
      url = `get-points?sort=points:desc&pagination[start]=0&pagination[limit]=100`;
    } else if (filter === "course") {
      url = `get-points?filters[institution]=${userStore.user.institution.place_id}&filters[${filter}]=${value}&sort=points:desc&pagination[start]=0&pagination[limit]=100`;
    } else {
      url = `get-points?filters[${filter}]=${value}&sort=points:desc&pagination[start]=0&pagination[limit]=100`;
    }
    topList.value = [];

    return api.get(url).then(data => {
      topList.value.push(...data);
    });
  };

  const getMyStats = () => {
    return api.get(`get-stats/${localStorage.getItem("user-id")}`).then(data => {
      myStats.value = data;
    });
  };

  const getRankings = () => {
    return api.get(`get-rankings`).then(({ rankings }) => rankings);
  };

  const selectTopListUser = id => {
    selectedTopListUserId.value = id;
  };

  const clearSelectedTopUser = () => {
    selectedTopListUserId.value = null;
  };

  return {
    topList,
    topListMeta,
    myStats,
    selectedTopListUserId,
    emptyTopList,
    getRankings,
    getTopList,
    getMyStats,
    selectTopListUser,
    clearSelectedTopUser,
  };
});
