<template>
  <f7-page
    id="activity-page"
    class="hg-dashboard-content"
    name="dashboard"
    @page:beforein="getAllData"
    @page:afterin="loadFirstTab"
  >
    <topbar ref="topBar" :tabs="activityTabs" :search="false" @tab-selected="setActiveComponent">
      <template #title>{{ $t("activity.Activity") }}</template>
      <template v-if="user && user.everyday_goal" #subtitle>{{ $t("top-bar.today-goal") }}</template>
      <template v-if="user && user.everyday_goal" #subtitle-data>{{
        `${user.everyday_goal} ${$t("top-bar.questions")}`
      }}</template>
    </topbar>

    <slot />

    <main class="activity-tab-content">
      <Transition name="fade">
        <component :is="currentActivityComponent" :req-loading="isLoading" @go-progress-tab="goProgressTab" />
      </Transition>
    </main>

    <bottom-menu :current-path="f7route.path" />
  </f7-page>
</template>

<script setup>
import { ref, markRaw, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/js/stores/auth";
import delay from "@/js/helpers/delay";
import Topbar from "@/components/topbar.vue";
import MyStatus from "@/components/activity-my-status.vue";
import BottomMenu from "@/components/bottom-menu.vue";

const TopList = defineAsyncComponent(() => import("@/components/activity-my-toplist.vue"));
const MyAnswers = defineAsyncComponent(() => import("@/components/activity-my-answers.vue"));
const Progress = defineAsyncComponent(() => import("@/components/activity-progress.vue"));

defineProps({
  f7route: {
    type: Object,
    default: () => {},
  },
  f7router: {
    type: Object,
    default: () => {},
  },
});

const i18n = useI18n();

const authStore = useAuthStore();

const { user } = storeToRefs(authStore);
const { getUser } = authStore;

const activityTabs = ref([
  {
    id: 1,
    name: i18n.t("activity.tabs.My Status"),
    component: markRaw(MyStatus),
  },
  {
    id: 2,
    name: i18n.t("activity.tabs.Top List"),
    component: markRaw(TopList),
  },
  {
    id: 3,
    name: i18n.t("activity.tabs.My Answers"),
    component: markRaw(MyAnswers),
  },
  {
    id: 4,
    name: i18n.t("activity.tabs.Progress"),
    component: markRaw(Progress),
  },
]);

const topBar = ref(null);
const isLoading = ref(false);
const currentActivityComponent = ref(null);
let active = null;

const goProgressTab = () => {
  document.getElementsByClassName("top-bar-tab")[3].click();
};

const loadFirstTab = () => {
  topBar.value.selectFirstTab(activityTabs.value, false);
};

const setActiveComponent = id => {
  active = activityTabs.value.find(t => t.id === id);
  currentActivityComponent.value = active?.component;
};

const getAllData = async () => {
  await delay();
  await Promise.all([getUser()]);

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
