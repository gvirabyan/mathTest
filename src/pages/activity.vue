<template>
  <f7-page id="activity-page" class="hg-dashboard-content" name="dashboard" @page:beforein="getAllData">
    <top-bar :tabs="activityTabs" @tab-selected="setActiveComponent">
      <template #title>{{ $t("activity.Activity") }}</template>
      <template v-if="user && user.everyday_goal" #subtitle>Today's Goal</template>
      <template v-if="user && user.everyday_goal" #subtitle-data>{{ user.everyday_goal }} questions</template>
    </top-bar>
    <slot />
    <main class="activity-tab-content">
      <Transition name="fade">
        <component :is="currentActivityComponent" />
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
import { useUserStats } from "@/js/stores/user-stats";
import delay from "@/js/helpers/delay";
import TopBar from "@/components/topbar.vue";
import MyStatus from "@/components/activity-my-status.vue";
import BottomMenu from "@/components/bottom-menu.vue";

const TopList = defineAsyncComponent(() => import("@/components/activity-my-toplist.vue"));
const MyAnswers = defineAsyncComponent(() => import("@/components/activity-my-answers.vue"));

defineProps({
  f7route: {
    type: Object,
    default: () => {},
  },
});

const i18n = useI18n();

const userStatsStore = useUserStats();
const authStore = useAuthStore();

const { user } = storeToRefs(authStore);
const { getUser } = authStore;
const { getUserStatus } = userStatsStore;

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
]);
const isLoading = ref(false);
const currentActivityComponent = ref(null);
let active = null;
const setActiveComponent = id => {
  active = activityTabs.value.find(t => t.id === id);
  currentActivityComponent.value = active.component;
};

const getAllData = async () => {
  isLoading.value = true;
  await delay();
  await Promise.all([getUser()]);
  if (active && active.name === "My Status") {
    isLoading.value = true;
    await delay();
    await getUserStatus();
    isLoading.value = false;
  }
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
