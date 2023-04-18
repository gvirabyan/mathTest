<template>
  <f7-page class="hg-dashboard-content" name="dashboard" @page:beforein="getAllData">
    <!-- Top Navbar -->
    <!--    <f7-navbar :sliding="false">-->
    <!--      <f7-nav-left>-->
    <!--        <f7-link icon-ios="f7:menu" icon-md="material:menu" panel-open="left" />-->
    <!--      </f7-nav-left>-->
    <!--      <f7-nav-title sliding>Math</f7-nav-title>-->
    <!--    </f7-navbar>-->

    <!-- Page content-->
    <top-bar :tabs="activityTabs" @tab-selected="setActiveComponent">
      <template #title>Activity</template>
      <template v-if="user && user.everyday_goal" #subtitle>Today's Goal</template>
      <template v-if="user && user.everyday_goal" #subtitle-data>{{ user.everyday_goal }} questions</template>
    </top-bar>
    <main class="activity-tab-content"
    >
      <Transition name="fade">
        <component
          @scroll-unset="changeScrolling"
          :is="currentActivityComponent"
        />
      </Transition>
    </main>
    <bottom-menu :current-path="f7route.path" />
  </f7-page>
</template>

<script setup>
import {ref, markRaw, nextTick, computed} from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
import { useCategoryStore } from "@/js/stores/categories";
// import { useQuestionsStore } from "@/js/stores/questions";
import delay from "@/js/helpers/delay";
// import ActiveCategoriesPopup from "../components/active-categories-popup.vue";
import TopBar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";
import MyStatus from "@/components/activity-my-status.vue";
import TopList from "@/components/activity-my-toplist.vue";
import MyAnswers from "@/components/activity-my-answers.vue";

defineProps({
  f7route: {
    type: Object,
    default: () => {},
  },
});

const authStore = useAuthStore();
const categoryStore = useCategoryStore();
// const questionsStore = useQuestionsStore();

const { user } = storeToRefs(authStore);
// const { categories, lastCategoryData, pastCategoriesData } = storeToRefs(categoryStore);
// const { answeredQuestionsCount } = storeToRefs(questionsStore);

const { getUser } = authStore;
const {
  // getCategories,
  // getLastCategory,
  getPastCategories,
} = categoryStore;
// const { getAnsweredQuestionsCount } = questionsStore;

const activityTabs = ref([
  {
    id: 1,
    name: "My Status",
    component: markRaw(MyStatus),
  },
  {
    id: 2,
    name: "Top List",
    component: markRaw(TopList),
  },
  {
    id: 3,
    name: "My Answers",
    component: markRaw(MyAnswers),
  },
]);
const isLoading = ref(false);
const currentActivityComponent = ref(null);

const setActiveComponent = id => {
  currentActivityComponent.value = activityTabs.value.find(t => t.id === id).component;
};

const changeScrolling = async (checked) => {
  const element = document.getElementsByClassName('activity-tab-content')[0]
  if(checked) {
    element.classList.add("scroll-unset")
  } else {
    element.classList.remove("scroll-unset")
  }
  await nextTick();
}

const getAllData = async () => {
  isLoading.value = true;

  await delay();
  await Promise.all([
    getUser(),
    // getLastCategory(),
    getPastCategories(),
    // getAnsweredQuestionsCount(),
    // getCategories()
  ]);

  isLoading.value = false;
};
</script>

<style lang="scss">
@import "../assets/scss/pages/activity";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
