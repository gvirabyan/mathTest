<template>
  <div class="progress">
    <transition name="activity-fade" mode="out-in" appear>
      <div>
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
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia/dist/pinia";

moment.updateLocale("en", {
  week: {
    dow: 1, // Monday
  },
});

// Get the current date
const currentDate = moment();
const startDay = currentDate.clone().startOf("week").format("YYYY-MM-DD");
const endDay = currentDate.clone().endOf("week").format("YYYY-MM-DD");

const userStore = useUserStats();
const { userProgress } = storeToRefs(userStore);
const days = ref([startDay]);

onMounted(() => {
  userStore.getProgressByDays(startDay, endDay);
});

for (let day = 1; day < 7; day++) {
  days.value.push(currentDate.clone().startOf("week").add(day, "day").format("YYYY-MM-DD"));
}
const topValueOfAmount = ref(0);
let amountLargest = 0;

const getAnsweredPercent = computed(() => (day, status) => {
  if (!userProgress.value[day] || !userProgress.value[day][status]) {
    return 0;
  }
  //calculate amount of exact day
  let amount = 0;
  for (const statusKey in userProgress.value[day]) {
    amount += Number(userProgress.value[day][statusKey]);
  }
  if (amountLargest < amount) {
    amountLargest = amount;
  }
  // round amountLargest
  topValueOfAmount.value = amountLargest + 5 - (amountLargest % 5);
  return (userProgress.value[day][status] * 55) / topValueOfAmount.value;
});

const scaleNumber = computed(() => i => topValueOfAmount.value - (topValueOfAmount.value * (i - 1)) / 5);
</script>

<style lang="scss">
@import "@/assets/scss/components/activity-tab";
@import "@/assets/scss/components/activity-progress";
</style>
