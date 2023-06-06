<template>
  <div class="progress">
    <transition name="activity-fade" mode="out-in" appear>
      <div>
        <div class="progress-week-months">
          <f7-button @click="unitOfTime = 'week'">week</f7-button>
          <span>/</span>
          <f7-button @click="unitOfTime = 'month'">month</f7-button>
        </div>
        <div class="diagram-main">
          <div class="diagram-y-scale">
            <div
              v-for="i in 5"
              :key="i"
              :style="{
                height: `${55 / 5}vh`,
              }"
            >
              {{ scaleNumber(i) }}
            </div>
          </div>
          <div class="diagram-container">
            <div class="diagram">
              <div class="diagram-days">
                <div
                  v-for="day in days"
                  :key="day"
                  :style="{
                    width: `${100 / days.length}%`,
                  }"
                >
                  <div
                    class="diagram-answer-wrong"
                    :style="{
                      height: `${getAnsweredPercent(day, 'wrong')}vh`,
                    }"
                  />
                  <div
                    class="diagram-answer-skipped"
                    :style="{
                      height: `${getAnsweredPercent(day, 'skipped')}vh`,
                    }"
                  />
                  <div
                    class="diagram-answer-correct"
                    :style="{
                      height: `${getAnsweredPercent(day, 'correct')}vh`,
                    }"
                  />
                </div>
              </div>
            </div>
            <div class="diagram-x-scale">
              <span>{{ startDay }}</span>
              <span>{{ endDay }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useUserStats } from "@/js/stores/user-stats";
import moment from "moment";
import { ref, onMounted, computed, watch } from "vue";
import { storeToRefs } from "pinia/dist/pinia";

moment.updateLocale("en", {
  week: {
    dow: 1, // Monday
  },
});

// Get the current date
const unitOfTime = ref("week");
const currentDate = moment();
const startDay = ref();
const endDay = ref();

const userStore = useUserStats();
const { userProgress } = storeToRefs(userStore);
const days = ref([]);
const topValueOfAmount = ref(0);
const amountLargest = ref(0);

watch(
  () => unitOfTime.value,
  async unitTime => {
    //  reset previous data before get new data
    userProgress.value = [];
    amountLargest.value = 0;
    topValueOfAmount.value = 0;

    // get statistics by startDay and endDay
    startDay.value = currentDate.clone().startOf(unitTime).format("YYYY-MM-DD");
    endDay.value = currentDate.clone().endOf(unitTime).format("YYYY-MM-DD");
    await userStore.getProgressByDays(startDay.value, endDay.value);

    // get days
    days.value = [];
    days.value[0] = startDay.value;
    let lengthDays = Number(endDay.value.split("-")[2]) - Number(startDay.value.split("-")[2]);
    for (let day = 1; day <= lengthDays; day++) {
      days.value.push(currentDate.clone().startOf(unitOfTime.value).add(day, "day").format("YYYY-MM-DD"));
    }
  },
  {
    immediate: true,
  },
);

const getAnsweredPercent = (day, status) => {
  if (!userProgress.value[day] || !userProgress.value[day][status]) {
    return 0;
  }
  //calculate amount of exact day
  let amount = 0;
  for (const statusKey in userProgress.value[day]) {
    amount += Number(userProgress.value[day][statusKey]);
  }
  if (amountLargest.value < amount) {
    amountLargest.value = amount;
  }
  // round amountLargest
  topValueOfAmount.value = amountLargest.value + 5 - (amountLargest.value % 5);
  return (userProgress.value[day][status] * 55) / topValueOfAmount.value;
};

const scaleNumber = computed(() => i => topValueOfAmount.value - (topValueOfAmount.value * (i - 1)) / 5);
</script>

<style lang="scss">
@import "@/assets/scss/components/activity-tab";
@import "@/assets/scss/components/activity-progress";
</style>
