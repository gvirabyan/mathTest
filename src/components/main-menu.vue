<template>
  <f7-list :class="'main-menu'">
    <f7-list-item v-for="({ href, title }, index) in menuItems" :key="`menu-item_${index + 1}`">
      <f7-link panel-close :href="`/${href}/`">{{ title }}</f7-link>
    </f7-list-item>
  </f7-list>
</template>

<script setup>
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
]
</script>

<style lang="scss" scoped>
@import "@/assets/scss/pages/main-menu.scss";
</style>
