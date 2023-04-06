<template>
  <div class="my-answers">
    <h2 class="title">Summary</h2>

    <transition v-if="!isLoading" name="answers-fade" mode="out-in" appear>
      <div>
        <p class="last-update-info">Last update: {{ lastUpdate }}</p>

        <div class="stats">
          <custom-gauge
            :width="customGaugeOptions.width"
            :height="customGaugeOptions.height"
            :radius="customGaugeOptions.radius"
            :stroke-width="customGaugeOptions.strokeWidth"
            color="#8419FF"
            :percent="answersPercent"
            ><template #percent>{{ answersPercent }}</template>
            <template #amount>{{ answersStats.questions_left_count }}</template>
            <template #info>of {{ answersStats.questions_count }} questions left</template>
          </custom-gauge>

          <custom-gauge
            :width="customGaugeOptions.width"
            :height="customGaugeOptions.height"
            :radius="customGaugeOptions.radius"
            :stroke-width="customGaugeOptions.strokeWidth"
            color="#2EE56B"
            :percent="correctAnswersPercent"
            ><template #percent>{{ correctAnswersPercent }}</template>
            <template #amount>{{ answersStats.correct_answers }}</template>
            <template #info>correct answers</template>
          </custom-gauge>

          <custom-gauge
            :width="customGaugeOptions.width"
            :height="customGaugeOptions.height"
            :radius="customGaugeOptions.radius"
            :stroke-width="customGaugeOptions.strokeWidth"
            color="#FF0000"
            :percent="wrongAnswersPercent"
            ><template #percent>{{ wrongAnswersPercent }}</template>
            <template #amount>{{ answersStats.wrong_answers }}</template>
            <template #info>wrong answers</template>
          </custom-gauge>

          <custom-gauge
            :width="customGaugeOptions.width"
            :height="customGaugeOptions.height"
            :radius="customGaugeOptions.radius"
            :stroke-width="customGaugeOptions.strokeWidth"
            color="#89838F"
            :percent="skippedAnswersPercent"
            ><template #percent>{{ skippedAnswersPercent }}</template>
            <template #amount>{{ answersStats.skipped_answers }}</template>
            <template #info>skipped answers</template>
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
import delay from "@/js/helpers/delay";
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
const skippedAnswersPercent = computed(() => 100 - correctAnswersPercent.value - wrongAnswersPercent.value);

const getAnswersStatsHandler = async () => {
  isLoading.value = true;

  await delay(2000);
  await getAnswersStats();

  isLoading.value = false;
};

getAnswersStatsHandler();
</script>

<style lang="scss">
@import "@/assets/scss/components/activity-my-answers.scss";

.answers-fade-enter-active,
.answers-fade-leave-active {
  transition: all 0.5s ease;
}
.answers-fade-enter-from,
.answers-fade-leave-to {
  opacity: 0;
  transform: translateY(40px);
}

.loader-fadeout-enter-active,
.loader-fadeout-leave-active {
  transition: all 0.5s ease-out;
}
.loader-fadeout-leave-to {
  opacity: 1;
  transform: scale(1);
}
</style>
