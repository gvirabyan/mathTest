<template>
  <f7-page class="hg-categories-page" name="categories" @page:beforein="getCategoriesClassesHandler">
    <top-bar :tabs="classesTabs" @tab-selected="getCategoriesByClass" @show-popup="togglePopup">
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

    <bottom-menu :current-path="f7route.path" />

    <f7-popup class="search-popup" :opened="isSearchPopup">
      <f7-page>
        <div class="close-btn-wrapper display-flex justify-content-end">
          <f7-button class="close-btn" @click="togglePopup">
            <img src="@/assets/icons/close.svg" alt="Close popup" />
          </f7-button>
        </div>

        <h2 class="title">Search</h2>

        <div class="input-wrapper">
          <f7-input v-model:value="searchStr" type="text" placeholder="Enter the keyword" />
          <img class="input-icon" src="@/assets/icons/arrow-right.svg" alt="" />
        </div>

        <div v-if="!searchStr" class="keywords">
          <f7-button
            v-for="({ name, active }, index) in keywords"
            :key="`keyword_${index + 1}`"
            class="keyword"
            :class="{ active: active }"
            @click="selectKeyword(index)"
          >
            {{ name }}
          </f7-button>
        </div>

        <f7-list v-if="searchedCategoriesData?.length" no-hairlines-md>
          <f7-list-item
            v-for="category in searchedCategoriesData"
            :key="category.id"
            @click="goToQuestions(category.id)"
          >
            <template #title>
              <span class="classes-subtitle"
                >{{ category.attributes.category_class.data.attributes.name }} classes</span
              >
              <text-clamp :text="category.attributes.name" :max-lines="2" :max-width="280" ellipsis="" />
            </template>

            <template #after>
              <p>{{ getAfterText(category) }}</p>
            </template>
          </f7-list-item>
        </f7-list>
      </f7-page>
    </f7-popup>
  </f7-page>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import TextClamp from "vue3-text-clamp";
import { useCategoryStore } from "@/js/stores/categories";
import { useCategoryClassesStore } from "@/js/stores/category-classes";
import delay from "@/js/helpers/delay";
import TopBar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";
import useDebouncedRef from "@/js/composables/use-debounced-ref";

const props = defineProps({
  f7router: Object,
  f7route: Object,
});

const categoriesStore = useCategoryStore();
const categoriesClassesStore = useCategoryClassesStore();
const { categoriesData, searchedCategoriesData } = storeToRefs(categoriesStore);
const { categoryClasses } = storeToRefs(categoriesClassesStore);
const { getCategories, getCategoriesByCategoryClass, clearSearchedCategories } = categoriesStore;
const { getCategoryClasses } = categoriesClassesStore;

const isLoading = ref(false);
const isSearchPopup = ref(false);
const searchStr = useDebouncedRef("");
const keywords = ref([
  {
    name: "Rationale zahlen",
    active: false,
  },
  {
    name: "Multiplizieren",
    active: false,
  },
  {
    name: "Kommazahlen",
    active: false,
  },
  {
    name: "Prozent",
    active: false,
  },
  {
    name: "Rationale",
    active: false,
  },
  {
    name: "Dividieren",
    active: false,
  },
]);

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

const togglePopup = () => {
  if (isSearchPopup.value) {
    searchStr.value = "";
    keywords.value.forEach(k => (k.active = false));
    clearSearchedCategories();
  }

  isSearchPopup.value = !isSearchPopup.value;
};

const selectKeyword = index => {
  keywords.value = keywords.value.map((k, i) => ({ ...k, active: i === index }));
  searchStr.value = keywords.value[index].name;
};

const goToQuestions = categoryId => {
  togglePopup();
  props.f7router.navigate(`/categories/${categoryId}/questions/`);
};

watch(searchStr, async value => {
  clearSearchedCategories();
  value && (await getCategories(value));
});
</script>

<style lang="scss">
@import "../assets/scss/pages/topics";
</style>
