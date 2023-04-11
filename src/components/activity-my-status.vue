<template>
  <div class="my-status">
    <transition v-if="!isLoading" name="activity-fade" mode="out-in" appear>
      <div class="display-flex flex-direction-column align-items-center">
        <div class="goal-wrapper">
          <p>Set everyday goal</p>

          <custom-select :options="goalsOptions" :disabled="disableSelect" @input:selected="setGoalHandler" />
        </div>

        <template v-if="userStatus.last_quiz">
          <h2 class="title">Last quiz</h2>

          <f7-block class="last-quiz">
            <h3 class="last-quiz-name">{{ userStatus.last_quiz.lastCategory.name }}</h3>
            <p class="last-quiz-stats">
              {{ userStatus.last_quiz.answeredQuestions }}/{{ userStatus.last_quiz.totalQuestions }}
            </p>
          </f7-block>
        </template>

        <f7-block class="experience">
          <h3 class="experience-title">Experience points</h3>
          <p class="experience-update">Last update: {{ lastUpdate }}</p>
          <div class="experience-points-wrapper">
            <p class="experience-points">{{ userStatus.points }}</p>
          </div>
          <p class="experience-time">
            You are in Math App <span class="value">{{ userStatus.time_in_app }}</span>
          </p>
        </f7-block>
      </div>
    </transition>

    <transition v-else name="loader-fadeout" mode="in-out">
      <loading-small />
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
import { useUserStats } from "@/js/stores/user-stats";
import delay from "@/js/helpers/delay";
import LoadingSmall from "@/components/loading-small.vue";
import timeAgo from "@/js/utils/time-ago";
import CustomSelect from "@/components/custom-select.vue";
import { f7 } from "framework7-vue";

const authStore = useAuthStore();
const userStatsStore = useUserStats();

const { updateUser } = authStore;
const { userStatus } = storeToRefs(userStatsStore);
const { getUserStatus } = userStatsStore;

const goalsOptions = ["10 questions", "20 questions", "30 questions", "40 questions"];
const isLoading = ref(false);
const disableSelect = ref(false);

const lastUpdate = computed(() => timeAgo(new Date(userStatus.value.last_update)));

const setGoalHandler = async goal => {
  const goalValue = parseInt(goal);
  disableSelect.value = true;

  await updateUser({ everyday_goal: goalValue }).then(res => {
    if (res.status === "success") {
      f7.toast.show({
        text: "Everyday goal has been set",
        closeButton: true,
      });

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
