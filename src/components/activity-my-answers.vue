<template>
  <div class="my-answers">
    <transition v-if="!isLoading" name="activity-fade" mode="out-in" appear>
      <div class="display-flex flex-direction-column align-items-center">
        <h2 class="title">{{ $t("activity.my-answers.summary") }}</h2>

        <p v-if="answersStats.last_update" class="last-update-info">
          {{ `${$t("activity.my-status.last-update")} ${answersStats.last_update}` }}
        </p>

        <div class="stats">
          <custom-gauge
            :width="customGaugeOptions.width"
            :height="customGaugeOptions.height"
            :radius="customGaugeOptions.radius"
            :stroke-width="customGaugeOptions.strokeWidth"
            color="#8419FF"
            :percent="answersStats.answers_percent"
          >
            <template #percent>{{ answersStats.answers_percent }}</template>
            <template #amount>{{ answersStats.answers_count }}</template>
            <template #info
              >{{
                `${$t("activity.my-answers.of")} ${answersStats.questions_count} ${$t(
                  "activity.my-answers.questions-passed",
                )}`
              }}
            </template>
          </custom-gauge>

          <custom-gauge
            :width="customGaugeOptions.width"
            :height="customGaugeOptions.height"
            :radius="customGaugeOptions.radius"
            :stroke-width="customGaugeOptions.strokeWidth"
            color="#2EE56B"
            :percent="answersStats.correct_answers.percent"
          >
            <template #percent>{{ answersStats.correct_answers.percent }}</template>
            <template #amount>{{ answersStats.correct_answers.count }}</template>
            <template #info>{{ $t("activity.my-answers.correct-answers") }}</template>
          </custom-gauge>

          <custom-gauge
            :width="customGaugeOptions.width"
            :height="customGaugeOptions.height"
            :radius="customGaugeOptions.radius"
            :stroke-width="customGaugeOptions.strokeWidth"
            color="#FF0000"
            :percent="answersStats.wrong_answers.percent"
          >
            <template #percent>{{ answersStats.wrong_answers.percent }}</template>
            <template #amount>{{ answersStats.wrong_answers.count }}</template>
            <template #info>{{ $t("activity.my-answers.wrong-answers") }}</template>
          </custom-gauge>

          <custom-gauge
            :width="customGaugeOptions.width"
            :height="customGaugeOptions.height"
            :radius="customGaugeOptions.radius"
            :stroke-width="customGaugeOptions.strokeWidth"
            color="#89838F"
            :percent="answersStats.skipped_answers.percent"
          >
            <template #percent>{{ answersStats.skipped_answers.percent }}</template>
            <template #amount>{{ answersStats.skipped_answers.count }}</template>
            <template #info>{{ $t("activity.my-answers.skipped-answers") }}</template>
          </custom-gauge>
        </div>
      </div>
    </transition>

    <transition v-else name="loader-fadeout" mode="in-out">
      <loading-small />
    </transition>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStats } from "@/js/stores/user-stats";
import timeAgo from "@/js/utils/time-ago";
import CustomGauge from "@/components/custom-gauge.vue";
import LoadingSmall from "@/components/loading-small.vue";

const userStatsStore = useUserStats();
const { answersStats } = storeToRefs(userStatsStore);
const { getAnswersStats } = userStatsStore;

const customGaugeOptions = {
  width: 186,
  height: 160,
  radius: 93,
  strokeWidth: 10,
};

const isLoading = ref(false);

const getAnswersStatsHandler = async () => {
  isLoading.value = true;

  await getAnswersStats();

  isLoading.value = false;
};

getAnswersStatsHandler();
</script>

<style lang="scss">
@import "@/assets/scss/components/activity-tab";
@import "@/assets/scss/components/activity-my-answers.scss";
</style>
