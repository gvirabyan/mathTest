<template>
  <f7-page class="hg-categories-page" name="categories">
    <!-- Top Navbar -->
    <f7-navbar title="Categories" back-link="Back"></f7-navbar>
    <f7-block-title>Categories</f7-block-title>

    <!-- Page content-->
    <f7-list>
      <f7-list-item v-for="category in categories"
                    :link="`/categories/${category.id}/questions/`"
                    :title="category.attributes.name"
      ></f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
import { useStore } from 'framework7-vue';
import store from '../js/store';

export default {
  name: "Categories",
  setup() {
    const categories = useStore('categories');

    return {
      categories
    }
  },
  data() {
    return {}
  },
  mounted() {
    store.dispatch('getCategories');
  }
}
</script>

<style lang="scss">
@import "../assets/scss/pages/categories";
</style>
