<template>
  <f7-page
    id="activity-page"
    class="hg-dashboard-content"
    name="dashboard"
    @page:beforein="getAllData"
    @page:afterin="loadFirstTab"
    @page:beforeout="resetSomeDataInPage"
  >
    <f7-navbar id="main-navbar">
      <top-bar ref="topBar" :tabs="activityTabs" :search="false" @tab-selected="setActiveComponent">
        <template #title>{{ $t("activity.Activity") }}</template>
        <template v-if="user && user.everyday_goal" #subtitle>{{ $t("top-bar.today-goal") }}</template>
        <template v-if="user && user.everyday_goal" #subtitle-data>{{
          `${user.everyday_goal} ${$t("top-bar.questions")}`
        }}</template>
      </top-bar>
    </f7-navbar>
    <f7-toolbar position="bottom">
      <bottom-menu :current-path="f7route.path" />
    </f7-toolbar>
    <!-- example-hidden-start -->
    <slot />

    <f7-block class="activity-tab-content">
      <Transition name="fade">
        <component :is="currentActivityComponent" :req-loading="isLoading" @go-progress-tab="goProgressTab" />
      </Transition>
    </f7-block>

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

        <f7-block v-else-if="searchStr && !topListSuggestions.length" class="no-padding result-not-found">
          <loading-small>
            {{ $t("activity.top-list.there-is-no-any-user") }}
          </loading-small>
        </f7-block>
      </f7-page>
    </f7-popup>
  </f7-page>
</template>

<script setup>
import playAudioMixin from "@/js/mixins/play_audio.js";
import { defineAsyncComponent, ref, markRaw, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/js/stores/auth";
import { useTopListStore } from "@/js/stores/top-list";
import { useUserStats } from "@/js/stores/user-stats";
import delay from "@/js/helpers/delay";
import TopBar from "@/components/topbar.vue";
import MyStatus from "@/components/activity-my-status.vue";
import BottomMenu from "@/components/bottom-menu.vue";
import LoadingSmall from "@/components/loading-small.vue";

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

const { user } = storeToRefs(useAuthStore());
const { getUser } = useAuthStore();
const { topList } = storeToRefs(useTopListStore());
const { selectTopListUser, clearSelectedTopUser } = useTopListStore();
const { getUserStatus } = useUserStats();
const { playAudio, tabChange } = playAudioMixin.setup();

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

const checkPageRedirect = ref(null);
const setActiveComponent = id => {
  active = activityTabs.value.find(t => t.id === id);
  currentActivityComponent.value = active?.component;
  if (!(checkPageRedirect.value === null && id === 1)) {
    tabChange.pause();
    tabChange.currentTime = 0;
    playAudio("tabChange");
    checkPageRedirect.value = id;
  }
};

const resetSomeDataInPage = () => {
  checkPageRedirect.value = null;
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

watch(isSearchPopup, value => {
  if (!value) return;

  clearSelectedTopUser();
});
</script>

<style lang="scss"></style>
