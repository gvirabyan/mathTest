<template>
  <f7-page name="top-lists">
    <f7-navbar title="Top Lists" back-link="Back" />

    <f7-list accordion-list>
      <f7-list-item accordion-item title="World" @accordion:open="getTopScores">
        <f7-accordion-content>
          <top-list :is-loading="isLoading" :items="worldTopList" />
        </f7-accordion-content>
      </f7-list-item>

      <f7-list-item accordion-item title="Country"  @accordion:open="getTopScores('country', country)">
        <f7-accordion-content>
          <top-list :is-loading="isLoading" :items="countryTopList">
            <template v-if="!user.country" v-slot:updateInfo>
              <i>Please update your country information to see your position</i>
            </template>
            <template v-slot:searchInput>
              <f7-list-input
                class="mb-8 country-autocomplete"
                type="text"
                placeholder="Enter country name"
                clear-button
                v-model:value="country"
              ></f7-list-input>
            </template>
          </top-list>
        </f7-accordion-content>
      </f7-list-item>

      <f7-list-item accordion-item title="City" @accordion:open="getTopScores('city', city)">
        <f7-accordion-content>
          <top-list :is-loading="isLoading" :items="cityTopList">
            <template v-if="!user.city" v-slot:updateInfo>
              <i>Please update your city information to see your position</i>
            </template>
            <template v-slot:searchInput>
              <f7-list-input
                class="mb-8 city-autocomplete"
                type="text"
                placeholder="Enter city name"
                clear-button
                v-model:value="city"
              ></f7-list-input>
            </template>
          </top-list>
        </f7-accordion-content>
      </f7-list-item>

      <f7-list-item accordion-item title="School/University/College" @accordion:open="getTopScores('institution', institution)">
        <f7-accordion-content>
          <top-list :is-loading="isLoading" :items="institutionTopList">
            <template v-if="!user.institution" v-slot:updateInfo>
              <i>Please update your school/university/college information to see your position</i>
            </template>
            <template v-slot:searchInput>
              <f7-list-input
                class="mb-8 institution-autocomplete"
                type="text"
                placeholder="Enter school/university/college name"
                clear-button
                v-model:value="institution"
              ></f7-list-input>
            </template>
          </top-list>
        </f7-accordion-content>
      </f7-list-item>

      <f7-list-item accordion-item title="Class/course" @accordion:open="getTopScores('course', course)">
        <f7-accordion-content>
          <top-list :is-loading="isLoading" :items="courseTopList">
            <template v-if="!user.course" v-slot:updateInfo>
              <i>Please update your class/course information to see your position</i>
            </template>
            <template v-slot:searchInput>
              <f7-list-input
                class="mb-8 institution-autocomplete"
                type="text"
                placeholder="Enter school/university/college name"
                clear-button
                v-model:value="course"
              ></f7-list-input>
            </template>
          </top-list>
        </f7-accordion-content>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';
import {storeToRefs} from 'pinia';
import {useAuthStore} from '@/js/stores/auth';
import {useTopLists} from '@/js/stores/top-lists';
import useDebouncedRef from '@/js/utils/use-debounced-ref';
import TopList from '@/components/top-list.vue'

const authStore = useAuthStore();
const topListsStore = useTopLists()
const {user} = storeToRefs(authStore);
const {worldTopList, countryTopList, cityTopList, institutionTopList, courseTopList} = storeToRefs(topListsStore);
const {getTopList} = topListsStore

const isLoading = ref(false);
const country = useDebouncedRef(user.value.country, 2000);
const city = useDebouncedRef(user.value.city, 2000);
const institution = useDebouncedRef(user.value.institution, 2000);
const course = useDebouncedRef(user.value.course, 2000);

watch(country, newVal => {
  newVal && getTopScores('country', newVal)
});

watch(city, newVal => {
  newVal && getTopScores('city', newVal)
})

watch(institution, newVal => {
  newVal && getTopScores('institution', newVal)
})

watch(course, newVal => {
  newVal && getTopScores('course', newVal)
})

const initAutocompleteInputs = () => {
  // remove all autocomplete dropdowns
  const pacContainers = document.querySelectorAll('.pac-container');
  pacContainers.forEach(c => c.remove());

  // init autocomplete on inputs
  const autocompleteClasses = ['country', 'city', 'institution'];

  for (const elName of autocompleteClasses) {
    const autocomplete = new google.maps.places.Autocomplete(
      document.querySelector(`.${elName}-autocomplete input`),
    );

    elName === 'country' && autocomplete.setTypes(['country'])
    elName === 'city' && autocomplete.setTypes(['(cities)'])
    elName === 'institution' && autocomplete.setTypes(["university", "primary_school", "secondary_school", "school"]);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      switch (elName) {
        case 'country':
          country.value = place.name;
          break;
        case 'city':
          city.value = place.name;
          break;
        case 'institution':
          institution.value = place.name;
          break;
      }
    });
  }
}

const getTopScores = (filter, value) => {
  isLoading.value = true

  return getTopList(filter, value).then(() => {
    isLoading.value = false
  })
}

onMounted(() => {
  initAutocompleteInputs();
})

</script>

<style lang="scss" scoped>
</style>
