<template>
  <f7-page
    class="hg-categories-page"
    name="categories"
    @page:beforein="getCategoriesClassesHandler"
    @page:beforeout="emptyData"
  >
    <top-bar
      :tabs="classesTabs"
      :change-tab="changeClass"
      @tab-selected="getCategoriesByClass"
      @show-search-popup="toggleSearchPopup"
    >
      <template #title>Topics</template>
      <template v-if="user && user.everyday_goal" #subtitle>{{ $t("top-bar.today-goal") }}</template>
      <template v-if="user && user.everyday_goal" #subtitle-data
        >{{ `${user.everyday_goal} ${$t("top-bar.questions")}` }}
      </template>
    </top-bar>

    <template v-if="!isLoading">
      <f7-list no-hairlines-md @touchstart="touchStart" @touchend="touchEnd">
        <f7-list-item v-for="category in categories" :key="category.id" :link="`/categories/${category.id}/questions/`">
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

        <h2 class="title">{{ $t("over.search") }}</h2>

        <div class="input-wrapper">
          <f7-input v-model:value="searchStr" type="text" :placeholder="$t('inputs.enter-the-keyword')" />
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

        <f7-list v-if="searchedCategories?.length" no-hairlines-md>
          <f7-list-item v-for="category in searchedCategories" :key="category.id" @click="goToQuestions(category.id)">
            <template #title>
              <text-clamp :text="category.attributes.name" :max-lines="2" :max-width="280" ellipsis="" />
            </template>

            <template #after>
              <p>{{ getAfterText(category) }}</p>
              <span>{{ `${$t("over.class")} ${category.attributes.category_class.data.attributes.name}` }}</span>
            </template>
          </f7-list-item>
        </f7-list>
        <div v-else-if="loading" class="loading-for-search">
          <loading-small />
        </div>
        <div v-else-if="searchStr && searchedCategories?.length === 0">
          <p>{{ $t("over.no-search-results") }}</p>
          <div class="keywords">
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
        </div>
      </f7-page>
    </f7-popup>
  </f7-page>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import TextClamp from "vue3-text-clamp";
import { useAuthStore } from "@/js/stores/auth";
import { useCategoryStore } from "@/js/stores/categories";
import { useCategoryClassesStore } from "@/js/stores/category-classes";
import delay from "@/js/helpers/delay";
import useDebouncedRef from "@/js/composables/use-debounced-ref";
import LoadingSmall from "@/components/loading-small.vue";
import TopBar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";
import playAudioMixin from "@/js/mixins/play_audio";

const props = defineProps({
  f7router: { type: Object, default: () => {} },
  f7route: { type: Object, default: () => {} },
});

const { playAudio, tabChange } = playAudioMixin.setup();

const authStore = useAuthStore();
const categoriesStore = useCategoryStore();
const categoriesClassesStore = useCategoryClassesStore();
const { user } = storeToRefs(authStore);
const { categories, searchedCategories, loading } = storeToRefs(categoriesStore);
const { categoryClasses } = storeToRefs(categoriesClassesStore);
const { getCategories, getCategoriesByCategoryClass, clearSearchedCategories } = categoriesStore;
const { getCategoryClasses } = categoriesClassesStore;

const i18n = useI18n();

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
  {
    name: "Schriftlich",
    active: false,
  },
  {
    name: "mit Übertrag",
    active: false,
  },
  {
    name: "ohne Übertrag",
    active: false,
  },
  {
    name: "Tauschaufgaben",
    active: false,
  },
  {
    name: "Geld",
    active: false,
  },
  {
    name: "Zeit",
    active: false,
  },
  {
    name: "Runde",
    active: false,
  },
  {
    name: "Maßumwandlungen",
    active: false,
  },
  {
    name: "Einstellige",
    active: false,
  },
  {
    name: "Klammern",
    active: false,
  },
  {
    name: "Exponenten",
    active: false,
  },
  {
    name: "mit x",
    active: false,
  },
  {
    name: "Schriftliche",
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
  categoryClasses.value
    ? categoryClasses.value.map(c => ({ id: c.id, name: `${c.attributes.name} ${i18n.t("topics.classes")}` }))
    : [],
);

const getAfterText = category => {
  if (!category.questions) {
    return "";
  }

  return `${category.answers > category.questions ? category.questions : category.answers}/${category.questions}`;
};

const getCategoriesClassesHandler = async () => {
  await getCategoryClasses();
};

const calledId = ref(null);
const emptyData = () => {
  calledId.value = null;
};

const getCategoriesByClass = async id => {
  if (id && calledId.value !== id && props.f7route.name === "Topics" && localStorage.getItem("token")) {
    calledId.value = id;
    isLoading.value = true;
    await delay();
    await getCategoriesByCategoryClass(id);
    isLoading.value = false;
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
const checkPageRedirect = ref(false);
watch(
  () => calledId.value,
  select => {
    if (select) {
      if (checkPageRedirect.value) {
        tabChange.pause();
        tabChange.currentTime = 0;
        playAudio("tabChange");
      }
      changeClass.value = select - 1;
      checkPageRedirect.value = true;
    }
  },
);
</script>

<style lang="scss">
@import "../assets/scss/pages/topics";
</style>
