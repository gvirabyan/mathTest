<template>
  <div class="my-status">
    <template v-if="!isLoading">
      <h2 class="title">Last quiz</h2>

      <f7-block class="last-quiz">
        <h3 class="last-quiz-name">{{ userStatus.last_quiz.name }}</h3>
        <p class="last-quiz-stats">{{ userStatus.last_quiz.answers }}/{{ userStatus.last_quiz.questions }}</p>
      </f7-block>

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
    </template>

    <loading-small v-else />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useUserStats } from "@/js/stores/user-stats";
import delay from "@/js/helpers/delay";
import LoadingSmall from "@/components/loading-small.vue";
import timeAgo from "@/js/utils/time-ago";

const userStatsStore = useUserStats();
const { userStatus } = storeToRefs(userStatsStore);
const { getUserStatus } = userStatsStore;

const isLoading = ref(false);

const lastUpdate = computed(() => timeAgo(new Date(userStatus.value.last_update)));

onMounted(async () => {
  isLoading.value = true;

  await delay(1500);
  await getUserStatus();

  isLoading.value = false;
});
</script>

<style lang="scss">
@import "@/assets/scss/components/activity-my-status";
</style>
