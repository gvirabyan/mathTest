<template>
  <f7-page name="profile">
    <f7-navbar title="Profile" back-link="Back"></f7-navbar>
    <f7-block-title>Profile</f7-block-title>

    <f7-list class="profile-form" inline-labels no-hairlines-md>
      <f7-list-input
        label="E-mail"
        type="email"
        placeholder="Your e-mail"
        clear-button
        v-model:value="profileData.email"
      />

      <f7-list-input
        label="Name"
        type="text"
        placeholder="Your name"
        v-model:value="profileData.name"
        clear-button
      />

      <f7-list-input
        label="Surname"
        type="text"
        placeholder="Your surname"
        v-model:value="profileData.surname"
        clear-button
      />

      <f7-list-input
        label="Nickname"
        type="text"
        placeholder="Your nickname"
        v-model:value="profileData.nickname"
        clear-button
      />

      <f7-list-input
        class="date-input"
        label="Date of birth"
        type="text"
        v-model:value="dateStr"
        placeholder="Your birth date"
        readonly
        @focus="isCalendarOpened = true"
      />

      <f7-list-input
        class="country-autocomplete"
        label="Country"
        type="text"
        placeholder="Your country"
        v-model:value="profileData.country"
        @focus="initAutocompleteInputs"
        @input="clearCityAndSchool"
        @input:clear="clearCityAndSchool"
        clear-button
      />

      <f7-list-input
        class="city-autocomplete"
        label="City"
        type="text"
        placeholder="Your city"
        v-model:value="profileData.city"
        @focus="initAutocompleteInputs"
        clear-button
      />

      <f7-list-input
        class="institution-autocomplete"
        label="School/University/College"
        type="text"
        placeholder="Your school/university/college"
        v-model:value="profileData.institution"
        @focus="initAutocompleteInputs"
        clear-button
      />

      <f7-list-input
        label="Class/course"
        type="text"
        placeholder="Your class/course"
        clear-button
        v-model:value="profileData.course"
      />

      <f7-block>
        <f7-button color="blue" fill @click="editProfile" :disabled="disableSubmit">Edit</f7-button>
      </f7-block>

      <f7-sheet
        class="calendar-sheet"
        :opened="isCalendarOpened"
        @sheet:closed="isCalendarOpened = false"
        backdrop
      >
        <f7-toolbar>
          <div class="left"></div>
          <div class="right">
            <f7-link sheet-close>Close</f7-link>
          </div>
        </f7-toolbar>

        <date-picker v-model="profileData.dateOfBirth" :max-date="new Date()" />
      </f7-sheet>
    </f7-list>
  </f7-page>
</template>

<script setup>
import {f7} from 'framework7-vue';
import {computed, watch, onMounted, reactive, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {DatePicker} from 'v-calendar';
import {useAuthStore} from '@/js/stores/auth';
import {getCountryCode} from '@/js/helpers/country-name-to-iso';
import 'v-calendar/dist/style.css';

const authStore = useAuthStore();
const {user} = storeToRefs(authStore);
const {updateUser} = authStore;

const disableSubmit = ref(false);
const profileData = reactive({
  email: '',
  name: '',
  surname: '',
  nickname: '',
  dateOfBirth: new Date().setFullYear(new Date().getFullYear() - 10),
  country: '',
  city: '',
  institution: '',
  course: ''
});
const isCalendarOpened = ref(false);
const dateStr = ref(null);

const countryCode = computed(() => profileData.country !== '' ? getCountryCode(profileData.country) : null);

const editProfile = () => {
  disableSubmit.value = true

  updateUser(profileData)
    .then(res => {
      if (res.status === 'success') {
        f7.toast.show({
          text: 'Profile data have been changed',
          closeButton: true
        });
      }
    })
    .finally(() => disableSubmit.value = false)

  initAutocompleteInputs();
}

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

    countryCode.value && autocomplete.setComponentRestrictions({ // restrict the country
      country: countryCode.value
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      profileData[elName] = place.name;
    });
  }
}

const clearCityAndSchool = () => {
  profileData.city = '';
  profileData.institution = ''
}

watch(countryCode, val => {
  val && initAutocompleteInputs()
});

watch(() => profileData.dateOfBirth, val => {
  if (val && val instanceof Date) {
    // date formatting
    dateStr.value = val.toISOString().slice(0, 10).split('-').reverse().join('.');
    isCalendarOpened.value = false;
  }
})

onMounted(() => {
  // fill profile data with initial values
  Object.keys(profileData).forEach(key => {
    profileData[key] = user?.value[key];
  });

  initAutocompleteInputs()
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/pages/profile.scss";
</style>
