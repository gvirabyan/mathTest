<template>
  <div class="progress">
    <transition name="activity-fade" mode="out-in" appear>
      <div>
        <div class="progress-week-months">
          <f7-button @click="getActualProgress('week')">week</f7-button>
          <span>/</span>
          <f7-button @click="getActualProgress('month')">month</f7-button>
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
        <div class="next-prev-block">
          <f7-button @click="prevDate">{{ `<- prev` }}</f7-button>
          <f7-button @click="nextDate">{{ `next ->` }}</f7-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useUserStats } from "@/js/stores/user-stats";
import moment from "moment";
import { ref, computed, watch, reactive } from "vue";
import { storeToRefs } from "pinia/dist/pinia";

moment.updateLocale("en", {
  week: {
    dow: 1, // Monday
  },
});

// Get the current date
const rules = reactive({
  unitOfTime: "week",
  currentDate: moment(),
});

const startDay = ref();
const endDay = ref();

const userStore = useUserStats();
const { userProgress } = storeToRefs(userStore);
const days = ref([]);
const topValueOfAmount = ref(0);
const amountLargest = ref(0);

const getActualProgress = async unitOfTime => {
  rules.currentDate = moment();
  rules.unitOfTime = unitOfTime;
  await updateProgress();
};

const prevDate = async () => {
  console.log(7, rules.unitOfTime === "week");
  if (rules.unitOfTime === "week") {
    rules.currentDate = rules.currentDate.startOf("week").subtract(1, "day");
  } else {
    rules.currentDate = rules.currentDate.subtract(1, "month").startOf("month");
  }
  await updateProgress();
};

const nextDate = async () => {
  if (rules.unitOfTime === "week") {
    rules.currentDate = rules.currentDate.add(1, rules.unitOfTime);
  } else {
    rules.currentDate = rules.currentDate.add(1, "month").startOf("month");
  }
  await updateProgress();
};

watch(
  () => rules,
  async () => {
    await updateProgress();
  },
  {
    immediate: true,
    deep: true,
  },
);

async function updateProgress() {
  //  reset previous data before get new data
  userProgress.value = {};
  amountLargest.value = 0;
  topValueOfAmount.value = 0;

  // get statistics by startDay and endDay
  startDay.value = rules.currentDate.startOf(rules.unitOfTime).format("YYYY-MM-DD");
  endDay.value = rules.currentDate.endOf(rules.unitOfTime).format("YYYY-MM-DD");
  await userStore.getProgressByDays(startDay.value, endDay.value);

  // get days
  days.value = [];
  days.value[0] = startDay.value;
  let lengthDays = Number(endDay.value.split("-")[2]) - Number(startDay.value.split("-")[2]);
  for (let day = 1; day <= lengthDays; day++) {
    days.value.push(rules.currentDate.clone().startOf(rules.unitOfTime).add(day, "day").format("YYYY-MM-DD"));
  }
}

const getAnsweredPercent = (day, status) => {
  if (!userProgress.value || !userProgress.value[day] || !userProgress.value[day][status]) {
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
