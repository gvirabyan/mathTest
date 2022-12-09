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
      />

      <f7-list-item
        v-for="category in filteredCategories"
        :link="`/categories/${category.id}/questions/`"
      >
        <template #title>
          <text-clamp :text="category.attributes.name" :max-lines="2" :max-width="280" ellipsis="" />
        </template>

        <template #after>
          <p>{{ getAfterText(category) }}</p>
        </template>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script setup>
import {ref, computed} from 'vue';
import { storeToRefs } from 'pinia'
import TextClamp from 'vue3-text-clamp';
import { useCategoryStore } from '@/js/stores/categories';

const categoriesStore = useCategoryStore();
const { categoriesData } = storeToRefs(categoriesStore);
const { getCategories } = categoriesStore;

const searchStr = ref('');

const filteredCategories = computed(() => {
  if (!searchStr.value) {
    return categoriesData.value;
  }

  return categoriesData.value.filter(c => c.attributes.name.toLowerCase().includes(searchStr.value.toLowerCase()))
});

const getAfterText = category => {
  if (!category.questions_amount) {
    return ''
  }

  return `${category.user_answers_amount}/${category.questions_amount}`
}

getCategories();
</script>

<style lang="scss">
@import "../assets/scss/pages/categories";
</style>
