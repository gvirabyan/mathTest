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
               @click="logout"
      >&nbsp;&nbsp;&nbsp;Logout</f7-link>
    </f7-list-item>
  </f7-list>
</template>

<script>
import store from "../js/store";
import { f7 } from 'framework7-vue';

export default {
  name: 'MainMenu',
  props: {
    f7router: Object,
  },
  data() {
    return {
      menuItems: [
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
      ]
    }
  },
  methods: {
    logout() {
      store.dispatch('logout').then(() => {
        f7.views.main.router.navigate('/login/')
      });
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/pages/main-menu.scss";
</style>
