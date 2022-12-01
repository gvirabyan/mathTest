<template>
  <f7-page class="hg-categories-page" name="categories">
    <f7-navbar title="Categories" back-link="Back" />

    <f7-list no-hairlines-md>
      <f7-list-input
        label="Search by category"
        type="text"
        placeholder="Enter a category name"
        v-model:value="searchStr"
        clear-button
      ></f7-list-input>

      <f7-list-item
        v-for="category in filteredCategories"
        :link="`/categories/${category.id}/questions/`"
        :title="category.attributes.name"
      />
    </f7-list>
  </f7-page>
</template>

<script setup>
import {ref, computed} from 'vue';
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '@/js/stores/categories';

const categoriesStore = useCategoryStore();
const { categories } = storeToRefs(categoriesStore);
const { getCategories } = categoriesStore;

const searchStr = ref('');

const filteredCategories = computed(() => {
  if (!searchStr.value) {
    return categories.value;
  }

  return categories.value.filter(c => c.attributes.name.toLowerCase().includes(searchStr.value.toLowerCase()))
})

getCategories();
</script>

<style lang="scss">
@import "../assets/scss/pages/categories";
</style>
