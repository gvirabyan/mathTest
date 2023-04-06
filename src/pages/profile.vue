<template>
  <f7-page-master class="hg-dashboard-content" name="dashboard" @page:beforein="getAllData">
    <top-bar :tabs="profileTabs" @tab-selected="setProfileComponent">
      <template #title>Profile</template>
      <template #subtitle>Username</template>
    </top-bar>
<!--    <div class="view"></div>-->
<!--    <main class="profile-tab-content">-->
<!--      <Transition name="fade">-->
<!--&lt;!&ndash;        <router-view :f7router="$f7router"></router-view>&ndash;&gt;-->
<!--&lt;!&ndash;        <f7-view />&ndash;&gt;-->
<!--&lt;!&ndash;        <f7-view class="safe-areas" url="/profile/"></f7-view>&ndash;&gt;-->
<!--      </Transition>-->
<!--    </main>-->

    <success-message-popup
      v-if="successPopup"
      @close="successPopup = false"
      :title="successPopup"
    />
<!--    <leave-page-popup />-->
    <bottom-menu :current-path="f7route.path" />
  </f7-page-master>
</template>

<script setup>
import { ref, markRaw, inject } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
// import { useCategoryStore } from "@/js/stores/categories";
// import { useQuestionsStore } from "@/js/stores/questions";
import delay from "@/js/helpers/delay";
// import ActiveCategoriesPopup from "../components/active-categories-popup.vue";
import TopBar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";
import SuccessMessagePopup from "@/components/success-message-popup.vue"
import LeavePagePopup from "@/components/leave-page-popup.vue"

// const TopList = defineAsyncComponent(() => import("@/components/activity-my-toplist.vue"));
// const MyAnswers = defineAsyncComponent(() => import("@/components/activity-my-answers.vue"));

const props = defineProps({
  f7router: Object,
  f7route: Object
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
    path: "/profile/account/",
    // component: markRaw(Account),
  },
  {
    id: 2,
    name: "Security",
    path: "/profile/security/",
    // component: markRaw(Security),
  },
  {
    id: 3,
    name: "About Us",
    path: "/profile/about-us/",
    // component: markRaw(AboutUs),
  },
]);

const isLoading = ref(false);

const { getUser } = authStore;
// const { getCategories, getLastCategory, getPastCategories } = categoryStore;
// const { getAnsweredQuestionsCount } = questionsStore;

const successPopup = ref(false)

const setProfileComponent = id => {
  props.f7router.navigate('/profile/account/')
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
