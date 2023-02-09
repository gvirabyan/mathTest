<template>
  <f7-page class="hg-categories-page" name="categories" @page:beforein="getCategoriesHandler">
    <f7-navbar title="Categories" back-link="Back" />

    <template v-if="!isLoading">
      <f7-list no-hairlines-md>
        <f7-list-input
          v-model:value="searchStr"
          label="Search by category"
          type="text"
          placeholder="Enter a category name"
          clear-button
        />

        <f7-list-item
          v-for="category in filteredCategories"
          :key="category.id"
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
    </template>

    <template v-else>
      <f7-list no-hairlines-md inset>
        <f7-list-item v-for="i in 3" :key="`skeleton_${i}`">
          <template #root>
            <f7-skeleton-block effect="wave">
              <f7-skeleton-text />
            </f7-skeleton-block>
          </template>
        </f7-list-item>
      </f7-list>
    </template>
  </f7-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import TextClamp from "vue3-text-clamp";
import { useCategoryStore } from "@/js/stores/categories";
import delay from "@/js/helpers/delay";

const categoriesStore = useCategoryStore();
const { categoriesData } = storeToRefs(categoriesStore);
const { getCategories } = categoriesStore;

const isLoading = ref(false);
const searchStr = ref("");

const filteredCategories = computed(() => {
  if (!searchStr.value) {
    return categoriesData.value;
  }

  return categoriesData.value.filter(c => c.attributes.name.toLowerCase().includes(searchStr.value.toLowerCase()));
});

const getAfterText = category => {
  if (!category.questions_amount) {
    return "";
  }

  return `${category.user_answers_amount}/${category.questions_amount}`;
};

const getCategoriesHandler = async () => {
  isLoading.value = true;

  await delay(1500);

  await getCategories().then(() => {
    isLoading.value = false;
  });
};

// getCategoriesHandler();
</script>

<style lang="scss">
@import "../assets/scss/pages/categories";
</style>
