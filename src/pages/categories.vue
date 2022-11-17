<template>
  <f7-page name="categories">
    <!-- Top Navbar -->
    <f7-navbar large :sliding="false">
      <f7-nav-left>
        <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>My App</f7-nav-title>
      <f7-nav-right>
        <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="right"></f7-link>
      </f7-nav-right>
      <f7-nav-title-large>Categories</f7-nav-title-large>
    </f7-navbar>
    <!-- Toolbar-->
    <f7-toolbar bottom>
      <f7-link>Left Link</f7-link>
      <f7-link>Right Link</f7-link>
    </f7-toolbar>
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
.list {
  .item-content {
    height: 60px;
  }
}
</style>