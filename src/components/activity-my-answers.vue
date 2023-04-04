<template>
  <div class="my-answers">
    <h2 class="title">Summary</h2>

    <p class="last-update-info">Last update: {{ lastUpdate }}</p>

    <div class="stats">
      <custom-gauge :width="186" :height="160" :radius="93" :stroke-width="10" color="#8419FF" :percent="answersPercent"
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
        :percent="correctAnswersPercent"
        ><template #percent>{{ correctAnswersPercent }}</template>
        <template #amount>{{ answersStats.correct_answers }}</template>
        <template #info>correct answers</template></custom-gauge
      >

      <custom-gauge :width="186" :height="160" :radius="93" :stroke-width="10" color="#FF0000" :percent="answersPercent"
        ><template #percent>{{ wrongAnswersPercent }}</template>
        <template #amount>{{ answersStats.wrong_answers }}</template>
        <template #info>wrong answers</template></custom-gauge
      >

      <custom-gauge :width="186" :height="160" :radius="93" :stroke-width="10" color="#89838F" :percent="skippedAnswers"
        ><template #percent>{{ skippedAnswers }}</template>
        <template #amount>{{ answersStats.skipped_answers }}</template>
        <template #info>skipped answers</template></custom-gauge
      >
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useUserStats } from "@/js/stores/user-stats";
import timeAgo from "@/js/utils/time-ago";
import CustomGauge from "@/components/custom-gauge.vue";

const userStatsStore = useUserStats();
const { answersStats } = storeToRefs(userStatsStore);
const { getAnswersStats } = userStatsStore;

const lastUpdate = computed(() => timeAgo(new Date(answersStats.value.last_update)));
const answersPercent = computed(() =>
  Math.round((answersStats.value.answers_count / answersStats.value.questions_count) * 100),
);
const correctAnswersPercent = computed(() =>
  Math.round((answersStats.value.correct_answers / answersStats.value.answers_count) * 100),
);
const wrongAnswersPercent = computed(() =>
  Math.round((answersStats.value.wrong_answers / answersStats.value.answers_count) * 100),
);
const skippedAnswers = computed(() =>
  Math.round((answersStats.value.skipped_answers / answersStats.value.answers_count) * 100),
);

getAnswersStats();
</script>

<style lang="scss">
@import "@/assets/scss/components/activity-my-answers.scss";
</style>
