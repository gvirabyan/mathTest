<template>
  <f7-page class="hg-categories-page" name="categories" @page:beforein="getCategoriesClassesHandler">
    <top-bar
      :tabs="classesTabs"
      :change-tab="changeClass"
      @tab-selected="getCategoriesByClass"
      @show-search-popup="toggleSearchPopup"
    >
      <template #title>Topics</template>
      <template v-if="user && user.everyday_goal" #subtitle>Today's Goal</template>
      <template v-if="user && user.everyday_goal" #subtitle-data>{{ user.everyday_goal }} questions</template>
    </top-bar>

    <template v-if="!isLoading">
      <f7-list no-hairlines-md @touchstart="touchStart" @touchend="touchEnd">
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

    <loading-small v-else />

    <bottom-menu :current-path="f7route.path" />

    <f7-popup class="search-popup" :opened="isSearchPopup">
      <f7-page>
        <div class="close-btn-wrapper display-flex justify-content-end">
          <f7-button class="close-btn" @click="toggleSearchPopup">
            <img src="@/assets/icons/close.svg" alt="Close popup" />
          </f7-button>
        </div>

        <h2 class="title">Search</h2>

        <div class="input-wrapper">
          <f7-input v-model:value="searchStr" type="text" placeholder="Enter the keyword" />
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
              <text-clamp :text="category.attributes.name" :max-lines="2" :max-width="280" ellipsis="" />
            </template>

            <template #after>
              <p>{{ getAfterText(category) }}</p>
              <span>Class {{ category.attributes.category_class.data.attributes.name }}</span>
            </template>
          </f7-list-item>
        </f7-list>
      </f7-page>
    </f7-popup>
  </f7-page>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import TextClamp from "vue3-text-clamp";
import { useAuthStore } from "@/js/stores/auth";
import { useCategoryStore } from "@/js/stores/categories";
import { useCategoryClassesStore } from "@/js/stores/category-classes";
import delay from "@/js/helpers/delay";
import useDebouncedRef from "@/js/composables/use-debounced-ref";
import LoadingSmall from "@/components/loading-small.vue";
import TopBar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";

const props = defineProps({
  f7router: { type: Object, default: () => {} },
  f7route: { type: Object, default: () => {} },
});

const authStore = useAuthStore();
const categoriesStore = useCategoryStore();
const categoriesClassesStore = useCategoryClassesStore();
const { user } = storeToRefs(authStore);
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

const changeClass = ref(0);

let start = null;
const touchStart = event => {
  if (event.touches.length === 1) {
    //just one finger touched
    start = event.touches.item(0).clientX;
  } else {
    //a second finger hit the screen, abort the touch
    start = null;
  }
};

const touchEnd = event => {
  let offset = 50; //at least 50px are a swipe
  if (start) {
    //the only finger that hit the screen left it
    let end = event.changedTouches.item(0).clientX;
    if (end > start + offset && changeClass.value > 0) {
      //a left -> right swipe
      --changeClass.value;
    }
    if (end < start - offset && changeClass.value < 10) {
      //a right -> left swipe
      ++changeClass.value;
    }
  }
};

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
  await getCategoryClasses();
  await getCategoriesByClass(categoryClasses.value[0].id);
};

let calledId = null;
const getCategoriesByClass = async id => {
  if (calledId !== id) {
    calledId = id;
    isLoading.value = true;
    await delay();
    await getCategoriesByCategoryClass(id);
    isLoading.value = false;
    calledId = null;
  }
};

const toggleSearchPopup = () => {
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
  toggleSearchPopup();
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
