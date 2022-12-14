<template>
  <f7-page name="top-list">
    <f7-navbar :title="`${title} Top List`" back-link="Back"/>

    <f7-block>
      <template v-if="needToUpdateInfo">
        <p><i class="mb-8">Please update your {{ title }} information to see your position</i></p>
      </template>

      <f7-input
        class="mb-16 py-8 autocomplete"
        :class="{ 'autocomplete': isAutocomplete }"
        type="text"
        :placeholder="`Enter ${title} name`"
        clear-button
        v-model:value="searchStr"
      />

      <template v-if="isLoading">
        <f7-row v-for="i in 3" :key="`skeleton_${i}`" class="mb-8">
          <f7-col width="75">
            <f7-skeleton-block effect="wave"/>
          </f7-col>
          <f7-col width="25">
            <f7-skeleton-block effect="wave"/>
          </f7-col>
        </f7-row>
      </template>

      <f7-row v-else-if="!needToUpdateInfo && !topList.length">
        <f7-col>There are no results yet</f7-col>
      </f7-row>

      <template v-else>
        <f7-row
          v-for="({ nickname, username, points }, index) in topList"
          :key="`list-item_${index + 1}`"
          class="mb-8"
        >
          <f7-col width="75">{{ index + 1 }}. {{ nickname || username }}</f7-col>
          <f7-col width="25" class="text-right">{{ points }}</f7-col>
        </f7-row>
      </template>
    </f7-block>
  </f7-page>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue';
import {useAuthStore} from '@/js/stores/auth';
import {useTopList} from '@/js/stores/top-list';
import {storeToRefs} from 'pinia';
import useDebouncedRef from '@/js/utils/use-debounced-ref';
import delay from '@/js/helpers/delay';

const props = defineProps({
  f7route: Object,
});

const authStore = useAuthStore();
const topListStore = useTopList();
const {user} = storeToRefs(authStore);
const {topList} = storeToRefs(topListStore);
const {getTopList} = topListStore;

const isLoading = ref(false);
const searchStr = useDebouncedRef('', 2000);

const filter = computed(() => props.f7route.params.filterName);
const title = computed(() => {
  const titleObj = {
    'world': 'World',
    'country': 'Country',
    'city': 'City',
    'institution': 'School/University/College',
    'course': 'Class/Course'
  };

  return titleObj[filter.value];
});
const needToUpdateInfo = computed(() => !Boolean(user[filter]));
const isAutocomplete = computed(() => ['country', 'city', 'institution'].includes(filter.value))

const initAutocompleteInput = () => {
  const pacContainer = document.querySelectorAll('.pac-container');
  pacContainer.length && pacContainer.remove();

  const autocomplete = new google.maps.places.Autocomplete(
    document.querySelector(`.autocomplete input`),
  );

  switch (filter.value) {
    case 'country':
      autocomplete.setTypes(['country']);
      break;
    case 'city':
      autocomplete.setTypes(['(cities)']);
      break;
    case 'institution':
      autocomplete.setTypes(["university", "primary_school", "secondary_school", "school"]);
      break;
  }

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();

    searchStr.value = place.name
  });
}

const getTopScores = async (filter, value) => {
  isLoading.value = true;

  await delay();
  await getTopList(filter, value);

  isLoading.value = false;
};

watch(searchStr, val => {
  val && getTopScores(filter.value, val);
});

onMounted(() => {
  if (filter.value !== 'world') {
    searchStr.value = user[filter.value];
  } else {
    getTopScores('world', '');
  }

  initAutocompleteInput();
});
</script>

<style scoped>

</style>
