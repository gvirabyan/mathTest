<template>
  <f7-page class="hg-categories-page" name="categories">
    <f7-navbar title="Categories" back-link="Back" />
    <f7-block-title>Categories</f7-block-title>

    <f7-list>
      <f7-list-item
        v-for="category in categories"
        :link="`/categories/${category.id}/questions/`"
        :title="category.attributes.name"
      />
    </f7-list>
  </f7-page>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '@/js/stores/categories';

const categoriesStore = useCategoryStore()
const { categories } = storeToRefs(categoriesStore);
const { getCategories } = categoriesStore;

getCategories()
</script>

<style lang="scss">
@import "../assets/scss/pages/categories";
</style>
