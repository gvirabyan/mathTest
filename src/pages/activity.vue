<template>
  <f7-page
    id="activity-page"
    class="hg-dashboard-content"
    name="dashboard"
    @page:beforein="getAllData"
    @page:afterin="loadFirstTab"
  >
    <topbar
      ref="topBar"
      :tabs="activityTabs"
      :search="hasSearch"
      @tab-selected="setActiveComponent"
      @show-search-popup="toggleSearchPopup"
    >
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

        <f7-list v-if="topListSuggestions?.length" no-hairlines-md>
          <f7-list-item
            v-for="topListUser in topListSuggestions"
            :key="topListUser.id"
            @click="selectTopListUserHandler(topListUser.id)"
          >
            <template #title>
              <p class="name">{{ topListUser.username }}</p>
            </template>

            <template #after>
              <p class="points">{{ topListUser.points }}</p>
            </template>
          </f7-list-item>
        </f7-list>

        <f7-block v-else-if="searchStr && !topListSuggestions.length" class="no-padding">
          <p>There is no any user with this username</p>
        </f7-block>
      </f7-page>
    </f7-popup>
  </f7-page>
</template>

<script setup>
import { defineAsyncComponent, ref, markRaw, computed } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useEventBus } from "@vueuse/core";
import { useAuthStore } from "@/js/stores/auth";
import { useTopListStore } from "@/js/stores/top-list";
import { useUserStats } from "@/js/stores/user-stats";
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
const bus = useEventBus("toplist-search");
bus.on((e, payload) => {
  hasSearch.value = payload;
});

const { user } = storeToRefs(useAuthStore());
const { getUser } = useAuthStore();
const { topList } = storeToRefs(useTopListStore());
const { selectTopListUser } = useTopListStore();
const { getUserStatus } = useUserStats();

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

const isLoading = ref(false);
const topBar = ref(null);
const currentActivityComponent = ref(null);
const hasSearch = ref(false);
const isSearchPopup = ref(false);
const searchStr = ref("");
let active = null;

const topListSuggestions = computed(() => {
  if (!searchStr.value || !topList.value.length) return [];

  return topList.value.filter(item => {
    const lowerUsername = item.username.toLowerCase();
    const lowerSearchStr = searchStr.value.toLowerCase();

    return lowerUsername.includes(lowerSearchStr);
  });
});

const goProgressTab = () => {
  const progressTabId = 4;
  const progressTabIndex = activityTabs.value.findIndex(t => t.id === progressTabId);

  topBar.value.selectTab(progressTabId, progressTabIndex);
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
  await getUser();
  await getUserStatus();
};

const toggleSearchPopup = () => {
  isSearchPopup.value = !isSearchPopup.value;
};

const selectTopListUserHandler = id => {
  selectTopListUser(id);
  isSearchPopup.value = false;
  searchStr.value = "";
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
