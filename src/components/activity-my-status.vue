<template>
  <div class="my-status">
    <transition v-if="!isLoading" name="activity-fade" mode="out-in" appear>
      <div class="display-flex flex-direction-column align-items-center">
        <div class="goal-wrapper">
          <p>Set everyday goal</p>

          <custom-select
            :options="goalsOptions"
            :default="questionsSelectDefault"
            :disabled="disableSelect"
            @input:selected="setGoalHandler"
          />
        </div>

        <template v-if="userStatus.last_quiz && userStatus.last_quiz.lastCategory">
          <h2 class="title">Last quiz</h2>

          <f7-block class="last-quiz">
            <h3 class="last-quiz-name">{{ userStatus.last_quiz?.lastCategory.name }}</h3>
            <p class="last-quiz-stats">
              {{ userStatus.last_quiz?.answeredQuestions }}/{{ userStatus.last_quiz?.totalQuestions }}
            </p>
          </f7-block>
        </template>

        <f7-block class="experience">
          <h3 class="experience-title">Experience points</h3>
          <p v-if="lastUpdate" class="experience-update">Last update: {{ lastUpdate }}</p>
          <div class="experience-points-wrapper">
            <p v-if="userStatus.points" class="experience-points">{{ userStatus.points }}</p>
            <p v-else class="experience-points no-points">Start your journey to earn the points</p>
          </div>
        </f7-block>

        <f7-block v-if="userStatus.past_categories_count && userStatus.categories_count">
          <custom-gauge
            :width="customGaugeOptions.width"
            :height="customGaugeOptions.height"
            :radius="customGaugeOptions.radius"
            :stroke-width="customGaugeOptions.strokeWidth"
            color="#8419FF"
            :percent="userStatus.past_categories_percent"
            ><template #percent>{{ userStatus.past_categories_percent }}</template>
            <template #amount>{{ userStatus.past_categories_count }}/{{ userStatus.categories_count }}</template>
            <template #info>categories were answered</template>
          </custom-gauge>
        </f7-block>

        <p v-if="userStatus.time_in_app" class="experience-time">
          You are in Mathe App <span class="value">{{ userStatus.time_in_app }}</span>
        </p>
        <p v-else class="experience-time">Welcome to the Mathe App!👋</p>
      </div>
    </transition>

    <transition v-else name="loader-fadeout" mode="in-out">
      <loading-small />
    </transition>

    <teleport v-if="showSelectGoalSuccess" to="#activity-page">
      <success-message-popup
        title="Success"
        text="Your everyday goal has been set"
        @close="showSelectGoalSuccess = false"
      />
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { f7 } from "framework7-vue";
import { useAuthStore } from "@/js/stores/auth";
import { useUserStats } from "@/js/stores/user-stats";
import delay from "@/js/helpers/delay";
import timeAgo from "@/js/utils/time-ago";
import CustomSelect from "@/components/custom-select.vue";
import LoadingSmall from "@/components/loading-small.vue";
import CustomGauge from "@/components/custom-gauge.vue";

const SuccessMessagePopup = defineAsyncComponent(() => import("@/components/success-message-popup.vue"));

const authStore = useAuthStore();
const userStatsStore = useUserStats();

const { user } = storeToRefs(authStore);
const { updateUser } = authStore;
const { userStatus } = storeToRefs(userStatsStore);
const { getUserStatus } = userStatsStore;

const customGaugeOptions = {
  width: 186,
  height: 186,
  radius: 93,
  strokeWidth: 10,
};
const goalsOptions = ["10 questions", "20 questions", "30 questions", "40 questions"];

const isLoading = ref(false);
const disableSelect = ref(false);
const showSelectGoalSuccess = ref(false);

const lastUpdate = computed(() =>
  userStatus.value.last_update ? timeAgo(new Date(userStatus.value.last_update)) : null,
);
const questionsSelectDefault = computed(() =>
  user.value && user.value.everyday_goal ? `${user.value.everyday_goal} questions` : "No goal",
);

const setGoalHandler = async goal => {
  const goalValue = parseInt(goal);
  disableSelect.value = true;

  await updateUser({ everyday_goal: goalValue }).then(res => {
    if (res.status === "success") {
      showSelectGoalSuccess.value = true;
      return;
    }

    f7.toast.show({
      text: res.message,
      closeButton: true,
    });
  });

  disableSelect.value = false;
};

onMounted(async () => {
  isLoading.value = true;

  await delay(1500);
  await getUserStatus();

  isLoading.value = false;
});
</script>

<style lang="scss">
@import "@/assets/scss/components/activity-tab";
@import "@/assets/scss/components/activity-my-status";
</style>
