<template>
  <f7-page class="hg-dashboard-content" name="dashboard" @page:beforein="getAllData">
    <top-bar :tabs="profileTabs" @tab-selected="setProfileComponent">
      <template #title>Profile</template>
      <template #subtitle>Username</template>
    </top-bar>

    <main class="profile-tab-content">
      <Transition name="fade">
        <f7-view />
        <!--        <component-->
        <!--          @open-success-popup="(e) => successPopup = e"-->
        <!--          :is="currentActivityComponent"-->
        <!--        />-->
      </Transition>
    </main>

    <success-message-popup
        v-if="successPopup"
        @close="successPopup = false"
        :title="successPopup"
    />

    <bottom-menu :current-path="f7route.path" />
  </f7-page>
</template>

<script setup>
import { ref, markRaw } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
// import { useCategoryStore } from "@/js/stores/categories";
// import { useQuestionsStore } from "@/js/stores/questions";
import delay from "@/js/helpers/delay";
// import ActiveCategoriesPopup from "../components/active-categories-popup.vue";
import TopBar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";
import SuccessMessagePopup from "@/components/success-message-popup.vue"

// const TopList = defineAsyncComponent(() => import("@/components/activity-my-toplist.vue"));
// const MyAnswers = defineAsyncComponent(() => import("@/components/activity-my-answers.vue"));

defineProps({
  f7route: {
    type: Object,
    default: () => {},
  },
});

const authStore = useAuthStore();
// const categoryStore = useCategoryStore();
// const questionsStore = useQuestionsStore();

const { user } = storeToRefs(authStore);
// const { categories, lastCategoryData, pastCategoriesData } = storeToRefs(categoryStore);
// const { answeredQuestionsCount } = storeToRefs(questionsStore);

const profileTabs = ref([
  {
    id: 1,
    name: "Account",
    component: markRaw(Account),
  },
  {
    id: 2,
    name: "Security",
    component: markRaw(Security),
  },
  {
    id: 3,
    name: "About Us",
    component: markRaw(AboutUs),
  },
]);

const isLoading = ref(false);
const currentActivityComponent = ref(null);

const { getUser } = authStore;
// const { getCategories, getLastCategory, getPastCategories } = categoryStore;
// const { getAnsweredQuestionsCount } = questionsStore;

const successPopup = ref(false)

const setProfileComponent = id => {
  currentActivityComponent.value = profileTabs.value.find(t => t.id === id).component;
};

const getAllData = async () => {
  isLoading.value = true;

  await delay();
  await Promise.all([
    getUser(),
    // getLastCategory(),
    // getPastCategories(),
    // getAnsweredQuestionsCount(),
    // getCategories()
  ]);

  isLoading.value = false;
};

</script>

<style lang="scss">
@import "../assets/scss/pages/profile";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
