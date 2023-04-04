<template>
  <article class="activity-tab-content">
    <div class="my-answers">
      <h2 class="title">Summary</h2>

      <p class="last-update-info">Last update: {{ lastUpdate }}</p>

      <div class="stats">
        <custom-gauge
          :width="186"
          :height="160"
          :radius="93"
          :stroke-width="10"
          color="#8419FF"
          :percent="answersPercent"
          ><template #percent>{{ answersPercent }}</template>
          <template #amount>{{ answersStats.questions_left_count }}</template>
          <template #info>of {{ answersStats.questions_count }} questions left</template></custom-gauge
        >

        <custom-gauge
          :width="186"
          :height="160"
          :radius="93"
          :stroke-width="10"
          color="#2EE56B"
          :percent="answersPercent"
          ><template #percent>{{ answersPercent }}</template>
          <template #amount>{{ answersStats.questions_left_count }}</template>
          <template #info>of {{ answersStats.questions_count }} questions left</template></custom-gauge
        >

        <custom-gauge
          :width="186"
          :height="160"
          :radius="93"
          :stroke-width="10"
          stroke-color="#D8B3FF"
          gradient-color="#8419FF"
          :percent="answersPercent"
          ><template #percent>{{ answersPercent }}</template>
          <template #amount>{{ answersStats.questions_left_count }}</template>
          <template #info>of {{ answersStats.questions_count }} questions left</template></custom-gauge
        >

        <custom-gauge
          :width="186"
          :height="160"
          :radius="93"
          :stroke-width="10"
          stroke-color="#D8B3FF"
          gradient-color="#8419FF"
          :percent="answersPercent"
          ><template #percent>{{ answersPercent }}</template>
          <template #amount>{{ answersStats.questions_left_count }}</template>
          <template #info>of {{ answersStats.questions_count }} questions left</template></custom-gauge
        >
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useUserStats } from "@/js/stores/user-stats";
import timeAgo from "@/js/utils/time-ago";
import CustomGauge from "@/components/custom-gauge.vue";
import delay from "@/js/helpers/delay";

const userStatsStore = useUserStats();
const { answersStats } = storeToRefs(userStatsStore);
const { getAnswersStats } = userStatsStore;

const lastUpdate = computed(() => timeAgo(new Date(answersStats.value.last_update)));
const answersPercent = computed(() =>
  Math.round((answersStats.value.answers_count / answersStats.value.questions_count) * 100),
);

onMounted(async () => {
  await delay(60 * 1000 * 10);
  await getAnswersStats();
});

// await delay(60 * 1000 * 10)
// await getAnswersStats();
</script>

<style lang="scss">
.activity-tab-content {
  flex: 1;
  padding: 30px 24px 56px;
  font-family: "Rubik", sans-serif;

  .my-answers {
    text-align: center;

    .title {
      font-size: 18px;
      font-weight: 500;
      line-height: 22px;
    }

    .last-update-info {
      margin-top: 9px;
      margin-bottom: 20px;
      color: rgba(#212121, 0.9);
      font-size: 12px;
      line-height: 14px;
    }

    .stats {
      display: flex;
      flex-direction: column;
      gap: 56px;
    }
  }
}
</style>
