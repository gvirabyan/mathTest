<template>
  <f7-list :class="'main-menu'">
    <f7-list-item v-for="({ href, title }, index) in menuItems" :key="`menu-item_${index + 1}`">
      <f7-link panel-close :href="`/${href}/`">{{ title }}</f7-link>
    </f7-list-item>

    <f7-list-item key="logout" class="hg-position-bottom">
      <f7-link icon-ios="f7:square_arrow_right"
               icon-aurora="f7:square_arrow_right"
               icon-md="material:logout"
               panel-close
               @click="logoutHandler"
      >&nbsp;&nbsp;&nbsp;Logout</f7-link>
    </f7-list-item>
  </f7-list>
</template>

<script setup>
import {f7} from 'framework7-vue';
import { useAuthStore } from '@/js/stores/auth';

const menuItems = [
  {
    href: 'profile',
    title: 'Profile'
  },
  {
    href: 'my-stats',
    title: 'My Stats'
  },
  {
    href: 'categories',
    title: 'Categories'
  },
  {
    href: 'top-lists',
    title: 'Top Lists'
  },
  {
    href: 'about',
    title: 'About'
  },
];

const authStore = useAuthStore();
const { logout } = authStore;

const logoutHandler = () => {
  logout().then(() => {
    f7.views.main.router.navigate('/login/');
  });
};
</script>

<style lang="scss">
@import "@/assets/scss/components/main-menu.scss";
</style>
