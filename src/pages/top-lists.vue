<template>
  <f7-page name="top-lists">
    <f7-navbar title="Top Lists" back-link="Back" />

    <f7-block v-if="!shouldUpdateInfo">
      <p>Please update your information to see your position</p>
    </f7-block>

    <f7-list accordion-list>
      <f7-list-item accordion-item title="World">
        <f7-accordion-content>
          <top-list />
        </f7-accordion-content>
      </f7-list-item>
      <f7-list-item accordion-item title="Country">
        <f7-accordion-content>
          <top-list />
        </f7-accordion-content>
      </f7-list-item>
      <f7-list-item accordion-item title="City">
        <f7-accordion-content>
          <top-list />
        </f7-accordion-content>
      </f7-list-item>
      <f7-list-item accordion-item title="School/University/College">
        <f7-accordion-content>
          <top-list />
        </f7-accordion-content>
      </f7-list-item>
      <f7-list-item accordion-item title="Class/course">
        <f7-accordion-content>
          <top-list />
        </f7-accordion-content>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useAuthStore} from '@/js/stores/auth';
import TopList from '@/components/top-list.vue'

const authStore = useAuthStore();
const {user} = storeToRefs(authStore);

const shouldUpdateInfo = computed(() =>
  user.value.country
  && user.value.city
  && user.value.institution
  && user.value.course
)

</script>

<style scoped>

</style>
