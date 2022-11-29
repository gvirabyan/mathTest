<template>
  <f7-page name="profile">
    <f7-navbar title="Profile" back-link="Back"></f7-navbar>
    <f7-block-title>Profile</f7-block-title>

    <f7-list inline-labels no-hairlines-md>
      <f7-list-input
        label="E-mail"
        type="email"
        placeholder="Your e-mail"
        clear-button
        v-model:value="profileData.email"
        :readonly="!editable"
      />

      <f7-list-input
        label="Name"
        type="text"
        placeholder="Your name"
        clear-button
        v-model:value="profileData.name"
        :readonly="!editable"
      />

      <f7-list-input
        label="Surname"
        type="text"
        placeholder="Your surname"
        clear-button
        v-model:value="profileData.surname"
        :readonly="!editable"
      />

      <f7-list-input
        label="Nickname"
        type="text"
        placeholder="Your nickname"
        clear-button
        v-model:value="profileData.nickname"
        :readonly="!editable"
      />

      <f7-list-input
        class="date-input"
        label="Date of birth"
        type="datepicker"
        placeholder="Your birth date"
        readonly
        :disabled="!editable"
      />

      <f7-list-input
        label="Country"
        type="text"
        placeholder="Your country"
        clear-button
        v-model:value="profileData.country"
        :readonly="!editable"
      />

      <f7-list-input
        label="City"
        type="text"
        placeholder="Your city"
        clear-button
        v-model:value="profileData.city"
        :readonly="!editable"
      />

      <f7-list-input
        label="School/University/College"
        type="text"
        placeholder="Your school/university/college"
        clear-button
        v-model:value="profileData.institution"
        :readonly="!editable"
      />

      <f7-list-input
        label="Class/course"
        type="text"
        placeholder="Your class/course"
        clear-button
        v-model:value="profileData.course"
        :readonly="!editable"
      />

      <f7-block>
        <f7-button v-if="!editable" fill @click="editable = true">Edit</f7-button>

        <f7-row v-else>
          <f7-col>
            <f7-button color="red" fill @click="editable = false">Cancel</f7-button>
          </f7-col>
          <f7-col>
            <f7-button color="blue" fill @click="editProfile" :disabled="disableSubmit">Submit</f7-button>
          </f7-col>
        </f7-row>
      </f7-block>
    </f7-list>
  </f7-page>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useAuthStore} from '@/js/stores/auth';
import {f7} from 'framework7-vue';

const authStore = useAuthStore();
const {user} = storeToRefs(authStore);
const {updateUser} = authStore;

const editable = ref(false);
const disableSubmit = ref(false);
const profileData = reactive({
  email: '',
  name: '',
  surname: '',
  nickname: '',
  dateOfBirth: null,
  country: '',
  city: '',
  institution: '',
  course: ''
});

const editProfile = () => {
  disableSubmit.value = true

  updateUser(profileData)
    .then(res => {
      if (res.status === 'success') {
        f7.dialog.alert('Profile data have been changed');
        editable.value = false;
      }
    })
    .finally(() => disableSubmit.value = false)
}

onMounted(() => {
  Object.keys(profileData).forEach(key => {
    profileData[key] = user?.value[key];
  })
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/pages/profile.scss";
</style>
