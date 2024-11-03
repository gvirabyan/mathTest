<template>
  <f7-page class="hg-dashboard-content" name="dashboard" @page:beforein="getAllData">
    <f7-navbar id="main-navbar">
      <top-bar ref="topBar" :tabs="profileTabs" :search="false" @tab-selected="setProfileComponent">
        <template #title>{{ $t("profile.profile") }}</template>
        <template v-if="user && user.everyday_goal" #subtitle>{{ $t("top-bar.today-goal") }}</template>
        <template v-if="user && user.everyday_goal" #subtitle-data>{{
          `${user.everyday_goal} ${$t("top-bar.questions")}`
        }}</template>
      </top-bar>
    </f7-navbar>
    <f7-toolbar position="bottom">
      <bottom-menu :current-path="f7route.path" />
    </f7-toolbar>

    <f7-block class="profile-tab-content">
      <Transition name="fade">
        <f7-view />
      </Transition>
    </f7-block>

    <success-message-popup v-if="successPopup" :title="successPopup" @close="successPopup = false" />
  </f7-page>
</template>

<script setup>
import { ref, markRaw } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
import delay from "@/js/helpers/delay";
import TopBar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";
import SuccessMessagePopup from "@/components/success-message-popup.vue";
import Account from "@/pages/account.vue";
import Security from "@/pages/security.vue";
import AboutUs from "@/pages/about-us.vue";

defineProps({
  f7route: {
    type: Object,
    default: () => {},
  },
});

const authStore = useAuthStore();

const { user } = storeToRefs(authStore);
const { getUser } = authStore;

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
const successPopup = ref(false);

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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
