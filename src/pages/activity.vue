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
      <template v-if="user.everyday_goal" #subtitle>Today's Goal</template>
      <template v-if="user.everyday_goal" #subtitle-data>{{ user.everyday_goal }} questions</template>
    </top-bar>

    <main class="activity-tab-content">
      <Transition name="fade">
        <component :is="currentActivityComponent" />
      </Transition>
    </main>

    <!--    <active-categories-popup />-->

    <!--    <div class="block hg-statistics-content">-->
    <!--      <div class="row">-->
    <!--        <div v-if="isLoading" class="col-100 hg-statistic-item hg-last-category-content">-->
    <!--          <div class="card card-content card-content-padding">-->
    <!--            <f7-skeleton-block effect="wave" height="28px">-->
    <!--              <f7-skeleton-text />-->
    <!--            </f7-skeleton-block>-->
    <!--          </div>-->
    <!--        </div>-->

    <!--        <a-->
    <!--          v-else-if="lastCategoryData?.lastCategory"-->
    <!--          class="col-100 hg-statistic-item hg-last-category-content"-->
    <!--          :href="`categories/${lastCategoryData?.lastCategory.id}/questions`"-->
    <!--        >-->
    <!--          <div class="card card-content card-content-padding">-->
    <!--            <div class="hg-body-content">-->
    <!--              <i class="f7-icons hg-content-icon">graph_square</i>-->
    <!--              <span class="hg-content-value">{{ lastCategoryData?.lastCategory.name }}</span>-->
    <!--            </div>-->

    <!--            <div class="hg-content-title">-->
    <!--              Last Category (<b class="hg-questions-answers-details"-->
    <!--                >{{ lastCategoryData?.answeredQuestions }}/{{ lastCategoryData?.totalQuestions }}</b-->
    <!--              >)-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </a>-->

    <!--        <div class="col-50 hg-statistic-item hg-answered-questions-content">-->
    <!--          <div class="card card-content card-content-padding">-->
    <!--            <div class="hg-body-content">-->
    <!--              <template v-if="!isLoading">-->
    <!--                <i class="f7-icons hg-content-icon">status</i>-->
    <!--                <span class="hg-content-value">{{ answeredQuestionsCount }}</span>-->
    <!--              </template>-->

    <!--              <div v-else class="hg-skeleton-wrapper">-->
    <!--                <f7-skeleton-block effect="wave" width="28px" height="28px" />-->
    <!--                <f7-skeleton-block effect="wave" width="56px" height="28px" />-->
    <!--              </div>-->
    <!--            </div>-->
    <!--            <div class="hg-content-title">Answered Questions</div>-->
    <!--          </div>-->
    <!--        </div>-->

    <!--        <div class="col-50 hg-statistic-item hg-experience-points-content">-->
    <!--          <div class="card card-content card-content-padding">-->
    <!--            <div class="hg-body-content">-->
    <!--              <template v-if="!isLoading">-->
    <!--                <i class="f7-icons hg-content-icon">grid_circle</i>-->
    <!--                <span class="hg-content-value">{{ user?.points }}</span>-->
    <!--              </template>-->
    <!--              <div v-else class="hg-skeleton-wrapper">-->
    <!--                <f7-skeleton-block effect="wave" width="28px" height="28px" />-->
    <!--                <f7-skeleton-block effect="wave" width="56px" height="28px" />-->
    <!--              </div>-->
    <!--            </div>-->
    <!--            <div class="hg-content-title">Experience Points</div>-->
    <!--          </div>-->
    <!--        </div>-->

    <!--        <div class="col-50 hg-statistic-item hg-active-categories-content">-->
    <!--          <div class="card card-content card-content-padding">-->
    <!--            <div class="hg-body-content">-->
    <!--              <template v-if="!isLoading">-->
    <!--                <i class="f7-icons hg-content-icon">graph_square</i>-->
    <!--                <span class="hg-content-value">{{ pastCategoriesData?.length }}</span>-->
    <!--              </template>-->
    <!--              <div v-else class="hg-skeleton-wrapper">-->
    <!--                <f7-skeleton-block effect="wave" width="28px" height="28px" />-->
    <!--                <f7-skeleton-block effect="wave" width="56px" height="28px" />-->
    <!--              </div>-->
    <!--            </div>-->
    <!--            <div class="hg-content-title">Past Categories</div>-->
    <!--          </div>-->
    <!--        </div>-->

    <!--        <a class="col-50 hg-statistic-item hg-categories-list-content" href="/categories/">-->
    <!--          <div class="card card-content card-content-padding">-->
    <!--            <div class="hg-body-content">-->
    <!--              <template v-if="!isLoading">-->
    <!--                <i class="f7-icons hg-content-icon">qrcode</i>-->
    <!--                <span class="hg-content-value">{{ categories?.length }}</span>-->
    <!--              </template>-->

    <!--              <div v-else class="hg-skeleton-wrapper">-->
    <!--                <f7-skeleton-block effect="wave" width="28px" height="28px" />-->
    <!--                <f7-skeleton-block effect="wave" width="56px" height="28px" />-->
    <!--              </div>-->
    <!--            </div>-->

    <!--            <div class="hg-content-title">Categories List</div>-->
    <!--          </div>-->
    <!--        </a>-->

    <!--        <a-->
    <!--          v-if="pastCategoriesData.length"-->
    <!--          class="col-50 hg-statistic-item hg-categories-list-content"-->
    <!--          href="/player-vs-machine/"-->
    <!--        >-->
    <!--          <div class="card card-content card-content-padding">-->
    <!--            <div class="hg-body-content">-->
    <!--              <template v-if="!isLoading">-->
    <!--                <i class="f7-icons hg-content-icon">device_phone_portrait</i>-->
    <!--                <span class="hg-content-value">Play</span>-->
    <!--              </template>-->

    <!--              <div v-else class="hg-skeleton-wrapper">-->
    <!--                <f7-skeleton-block effect="wave" width="28px" height="28px" />-->

    <!--                <f7-skeleton-block effect="wave" width="56px" height="28px" />-->
    <!--              </div>-->
    <!--            </div>-->

    <!--            <div class="hg-content-title">Player vs. Machine</div>-->
    <!--          </div>-->
    <!--        </a>-->
    <!--      </div>-->
    <!--    </div>-->

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
import MyStatus from "@/components/activity-my-status.vue";

import TopList from "@/components/activity-my-toplist.vue";
import MyAnswers from "@/components/activity-my-answers.vue";
import { useCategoryStore } from "@/js/stores/categories";

// const TopList = defineAsyncComponent(() => import("@/components/activity-my-toplist.vue"));
// const MyAnswers = defineAsyncComponent(() => import("@/components/activity-my-answers.vue"));

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
