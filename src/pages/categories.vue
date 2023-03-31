<template>
  <f7-page class="hg-categories-page" name="categories" @page:beforein="getCategoriesClassesHandler">
    <top-bar :tabs="classesTabs" @tab-selected="getCategoriesByClass">
      <template #title>Topics</template>
      <template #subtitle>Today's Goal</template>
      <template #subtitle-data>20 questions</template>
    </top-bar>

    <template v-if="!isLoading">
      <f7-list no-hairlines-md>
        <f7-list-item
          v-for="category in categoriesData"
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

    <bottom-menu :current-path="props.f7route.path" />
  </f7-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import TextClamp from "vue3-text-clamp";
import { useCategoryStore } from "@/js/stores/categories";
import { useCategoryClassesStore } from "@/js/stores/category-classes";
import delay from "@/js/helpers/delay";
import TopBar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";

const props = defineProps({
  f7route: Object,
});

const categoriesStore = useCategoryStore();
const categoriesClassesStore = useCategoryClassesStore();
const { categoriesData } = storeToRefs(categoriesStore);
const { categoryClasses } = storeToRefs(categoriesClassesStore);
const { getCategoriesByCategoryClass } = categoriesStore;
const { getCategoryClasses } = categoriesClassesStore;

const isLoading = ref(false);

const classesTabs = computed(() =>
  categoryClasses.value.map(c => ({ id: c.id, name: `${c.attributes.name} classes` })),
);

const getAfterText = category => {
  if (!category.questions_amount) {
    return "";
  }

  return `${category.user_answers_amount}/${category.questions_amount}`;
};

const getCategoriesClassesHandler = async () => {
  categoriesStore.$reset();
  await getCategoryClasses();
};

const getCategoriesByClass = async id => {
  isLoading.value = true;

  await delay();
  await getCategoriesByCategoryClass(id);

  isLoading.value = false;
};
</script>

<style lang="scss">
@import "../assets/scss/pages/categories";
</style>
