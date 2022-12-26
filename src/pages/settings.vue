<template>
  <f7-page name="settings">
    <f7-navbar title="Settings" back-link="Back" />
    <f7-block-title>Settings</f7-block-title>

    <f7-list class="settings-list">
      <f7-list-item v-for="({ href, title }, index) in settingsItems" :key="`menu-item_${index + 1}`">
        <f7-link panel-close :href="`/settings/${href}/`">{{ title }}</f7-link>
      </f7-list-item>

      <f7-list-item key="logout" class="logout-btn">
        <f7-link
          icon-ios="f7:square_arrow_right"
          icon-aurora="f7:square_arrow_right"
          icon-md="material:logout"
          icon-color="red"
          badge-color="red"
          @click="logoutHandler"
        >&nbsp;&nbsp;&nbsp;Logout</f7-link>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script setup>
import {useAuthStore} from '@/js/stores/auth';

const props = defineProps({
  f7router: Object
})

const settingsItems = [
  {
    href: 'terms',
    title: 'Terms of services'
  },
  {
    href: 'privacy',
    title: 'Privacy'
  },
  {
    href: 'imprint',
    title: 'Imprint'
  },
  {
    href: 'licenses',
    title: 'Software licenses'
  },
  {
    href: 'release-notes',
    title: 'Release notes'
  },
  {
    href: 'feedback',
    title: 'Write a review'
  }
];

const authStore = useAuthStore();
const { logout } = authStore;

const logoutHandler = () => {
  logout()
    .then(() => {
      props.f7router.navigate('/login/');
    });
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/pages/settings.scss";
</style>
