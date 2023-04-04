<template>
  <div class="my-answers">
    <h2 class="title">Summary</h2>

    <p class="last-update-info">Last update: {{ lastUpdate }}</p>

    <div class="stats">
      <custom-gauge
        v-for="(item, i) in customGaugeData"
        :key="`gauge_${i + 1}`"
        :width="customGaugeOptions.width"
        :height="customGaugeOptions.height"
        :radius="customGaugeOptions.radius"
        :stroke-width="customGaugeOptions.strokeWidth"
        :color="item.color"
        ><template #percent>{{ item.percent }}</template>
        <template #amount>{{ item.amount }}</template>
        <template #info>{{ item.info }}</template></custom-gauge
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

const customGaugeOptions = {
  width: 186,
  height: 160,
  radius: 93,
  strokeWidth: 10,
};

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
const skippedAnswers = computed(() => 100 - correctAnswersPercent.value - wrongAnswersPercent.value);

const customGaugeData = computed(() => [
  {
    ...customGaugeOptions,
    color: "#8419FF",
    percent: answersPercent.value,
    amount: answersStats.value.questions_left_count,
    info: `of ${answersStats.value.questions_count} questions left`,
  },
  {
    ...customGaugeOptions,
    color: "#2EE56B",
    percent: correctAnswersPercent.value,
    amount: answersStats.value.correct_answers,
    info: "correct answers",
  },
  {
    ...customGaugeOptions,
    color: "#FF0000",
    percent: wrongAnswersPercent.value,
    amount: answersStats.value.wrong_answers,
    info: "wrong answers",
  },
  {
    ...customGaugeOptions,
    color: "#89838F",
    percent: skippedAnswers.value,
    amount: answersStats.value.skipped_answers,
    info: "skipped answers",
  },
]);

getAnswersStats();
</script>

<style lang="scss">
@import "@/assets/scss/components/activity-my-answers.scss";
</style>
