<template>
  <f7-page
    name="top-list"
    infinite
    :infinite-distance="50"
    :infinite-preloader="showPreloader"
    @infinite="loadMore"
    @page:beforein="initTopScores"
  >
    <f7-navbar :title="`${title} Top List`" back-link="Back" @click:back="clearTopListStore" />

    <f7-block>
      <template v-if="needToUpdateInfo">
        <p>
          <i class="mb-8">Please update your {{ infoToUpdate }} information to see your position</i>
        </p>
      </template>

      <f7-input
        v-if="filter !== 'world'"
        v-model:value="searchStr"
        class="py-12"
        :class="{ autocomplete: isAutocomplete }"
        type="text"
        :placeholder="`Enter ${title} name`"
        clear-button
        @input="clearTopListStore"
        @input:clear="clearTopListStore"
      />

      <template v-if="isLoading">
        <f7-row v-for="i in 3" :key="`skeleton_${i}`" class="mb-8">
          <f7-col width="75">
            <f7-skeleton-block effect="wave" />
          </f7-col>
          <f7-col width="25">
            <f7-skeleton-block effect="wave" />
          </f7-col>
        </f7-row>
      </template>

      <f7-row v-else-if="!needToUpdateInfo && noResults">
        <f7-col>There are no results yet</f7-col>
      </f7-row>

      <f7-list v-else-if="topList.length" class="top-list">
        <f7-list-item
          v-for="({ id, nickname, username, points }, index) in topList"
          :key="`list-item_${index + 1}`"
          :class="{ 'my-score': id === user.id, last: index === topList.length - 1 }"
        >
          <template #before-title>
            <span class="inline-block mr-8">{{ index + 1 }}</span>
          </template>

          <template #title>
            {{ nickname || username }}
          </template>

          <template #after>
            {{ points }}
          </template>
        </f7-list-item>

        <f7-list-item v-if="myScore" class="my-score-fixed">
          <template #before-title>
            <span class="inline-block mr-8">{{ myScore.index }}</span>
          </template>

          <template #title>
            {{ myScore.nickname || myScore.username }}
          </template>

          <template #after>
            {{ myScore.points }}
          </template>
        </f7-list-item>
      </f7-list>
    </f7-block>
  </f7-page>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useAuthStore } from "@/js/stores/auth";
import { useTopList } from "@/js/stores/top-list";
import { storeToRefs } from "pinia";
import useDebouncedRef from "@/js/utils/use-debounced-ref";
import delay from "@/js/helpers/delay";

const props = defineProps({
  f7route: Object,
});

const authStore = useAuthStore();
const topListStore = useTopList();
const { user } = storeToRefs(authStore);
const { topList, topListMeta } = storeToRefs(topListStore);
const { getTopList } = topListStore;

const isLoading = ref(false);
const noResults = ref(false);
const showPreloader = ref(false);
const allowInfinite = ref(true);
const searchStr = useDebouncedRef("", 2000, true);
const searchIdStr = useDebouncedRef("", 2000, true);

const filter = computed(() => props.f7route.params.filterName);
const title = computed(() => {
  const titleObj = {
    world: "World",
    country: "Country",
    city: "City",
    institution: "School/University/College",
    course: "Class/Course",
  };

  return titleObj[filter.value];
});
const emptyInstitutionFilledCourse = computed(() => filter.value === "course" && !user.value.institution);
const infoToUpdate = computed(() => {
  if (emptyInstitutionFilledCourse.value) {
    return "School/University/College";
  }

  return title.value;
});
const needToUpdateInfo = computed(() => {
  if (emptyInstitutionFilledCourse.value) {
    return true;
  }

  return filter.value !== "world" && Boolean(user[filter.value]);
});
const isAutocomplete = computed(() => ["country", "city", "institution"].includes(filter.value));
const page = computed(() => topListMeta?.value?.page + 1 || 1);
const myScore = computed(() => {
  const myResult = topList.value.find(t => t.id === user.value.id);
  const myResultIndex = topList.value.findIndex(t => t.id === user.value.id);

  if (!myResult) {
    return 0;
  }

  return {
    index: myResultIndex + 1,
    nickname: myResult.nickname,
    username: myResult.username,
    points: myResult.points,
  };
});

const initAutocompleteInput = () => {
  if (filter.value === "course") {
    return;
  }

  // eslint-disable-next-line no-undef
  const autocomplete = new google.maps.places.Autocomplete(document.querySelector(`.autocomplete input`));

  switch (filter.value) {
    case "country":
      autocomplete.setTypes(["country"]);
      break;
    case "city":
      autocomplete.setTypes(["(cities)"]);
      break;
    case "institution":
      autocomplete.setTypes(["university", "primary_school", "secondary_school", "school"]);
      break;
  }

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();

    searchStr.value = place.name;

    if (filter.value === "institution") {
      searchIdStr.value = place.place_id;
    }
  });
};

const getTopScores = async (filter, value, page, showLoader = true) => {
  isLoading.value = !!showLoader;
  noResults.value = false;

  await delay();
  await getTopList(filter, value, page);

  if (!topList.value.length) {
    noResults.value = true;
  }

  isLoading.value = false;
};

const loadMore = () => {
  if (!allowInfinite.value) return;
  allowInfinite.value = false;

  if (topList.value.length === topListMeta.value.total) {
    showPreloader.value = false;
    return;
  }

  setTimeout(() => {
    getTopScores(filter.value, searchIdStr.value || "", page.value, false).then(() => {
      allowInfinite.value = true;
    });
  }, 1000);
};

const clearTopListStore = () => {
  if (!topList.value.length && !topListMeta.value) {
    return;
  }

  noResults.value = false;
  topListStore.$reset();
};

const initTopScores = () => {
  if (emptyInstitutionFilledCourse.value) {
    return;
  }

  if (filter.value !== "world") {
    searchStr.value = filter.value === "institution" ? user.value[filter.value]?.name : user.value[filter.value];
    searchIdStr.value = filter.value === "institution" ? user.value.institution?.place_id : "";

    initAutocompleteInput();
    return;
  }

  getTopScores("world", "", page.value).then(() => {
    showPreloader.value = topList.value.length === topListMeta?.value?.pageSize;
  });
};

watch(searchStr, val => {
  if (filter.value !== "institution" && val) {
    getTopScores(filter.value, val, page.value);
  }
});

watch(searchIdStr, val => {
  if (val) {
    getTopScores(filter.value, val, page.value);
  }
});
</script>

<style lang="scss">
@import "../assets/scss/components/top-list.scss";
</style>
