<template>
  <div class="my-status">
    <transition v-if="!isLoading" name="activity-fade" mode="out-in" appear>
      <div class="display-flex flex-direction-column align-items-center">
        <div class="goal-wrapper">
          <p>{{ $t("activity.my-status.set-everyday-goal") }}</p>

          <custom-select
            :options="goalsOptions"
            :default="questionsSelectDefault"
            :disabled="disableSelect"
            @input:selected="setGoalHandler"
          />
        </div>

        <template v-if="userStatus.last_quiz && userStatus.last_quiz.lastCategory">
          <h2 class="title">{{ $t("activity.my-status.last-quiz") }}</h2>
          <f7-block class="last-quiz">
            <f7-button @click="goLastQuiz(userStatus.last_quiz)">
              <h3 class="last-quiz-name">{{ userStatus.last_quiz?.lastCategory.name }}</h3>
            </f7-button>

            <f7-button @click="goLastQuiz(userStatus.last_quiz)">
              <p class="last-quiz-stats">
                {{ userStatus.last_quiz?.answeredQuestions }}/{{ userStatus.last_quiz?.totalQuestions }}
              </p>
            </f7-button>
          </f7-block>
        </template>

        <f7-block v-if="userStatus.daily_statics && userStatus.daily_statics.length" class="experience">
          <h3 class="experience-title">{{ $t("activity.my-status.today-activity") }}</h3>
          <f7-button class="daily-statistic-btn" @click="$emit('go-progress-tab')">
            <custom-gauge-three
              :width="customGaugeOptions.width"
              :height="customGaugeOptions.height"
              :radius="customGaugeOptions.radius"
              :stroke-width="customGaugeOptions.strokeWidth"
              color="#8419FF"
              :percent-green="staticInfo('correct').percent"
              :percent-gray="staticInfo('skipped').percent + staticInfo('correct').percent"
              ><template #amount>{{ amountAnswered }}</template>
              <template #info>
                <p>
                  {{ $t("activity.my-status.correct") }}
                  <span class="correct-answered">
                    {{ staticInfo("correct").count }}
                  </span>
                </p>
                <p>
                  {{ $t("activity.my-status.skipped") }}
                  <span class="skipped-answered">
                    {{ staticInfo("skipped").count }}
                  </span>
                </p>
                <p>
                  {{ $t("activity.my-status.wrong") }}
                  <span class="wrong-answered">
                    {{ staticInfo("wrong").count }}
                  </span>
                </p>
              </template>
            </custom-gauge-three>
          </f7-button>
          <f7-button class="check-progress-text" @click="emit('go-progress-tab')">{{
            $t("activity.my-status.check-progress")
          }}</f7-button>
        </f7-block>

        <f7-block class="experience">
          <h3 class="experience-title">{{ $t("activity.my-status.experience-points") }}</h3>

          <p v-if="userStatus.last_update" class="experience-update">
            {{ `${$t("activity.my-status.last-update")}  ${userStatus.last_update}` }}
          </p>

          <div class="experience-points-wrapper">
            <p class="experience-points">{{ userStatus.points || 0 }}</p>
          </div>

          <f7-link v-if="!userStatus.points" class="experience-points no-points" href="/topics/"
            >{{ $t("activity.my-status.go-to-topics") }}
          </f7-link>
        </f7-block>

        <f7-block v-if="userStatus.past_categories_count && userStatus.categories_count" class="experience">
          <h3 class="experience-title">{{ $t("activity.my-status.past-categories") }}</h3>
          <custom-gauge
            :width="customGaugeOptions.width"
            :height="customGaugeOptions.height"
            :radius="customGaugeOptions.radius"
            :stroke-width="customGaugeOptions.strokeWidth"
            color="#8419FF"
            :percent="userStatus.past_categories_percent"
            ><template #percent>{{ userStatus.past_categories_percent }}</template>
            <template #amount>{{ userStatus.past_categories_count }} of {{ userStatus.categories_count }}</template>
            <template #info>{{ $t("activity.my-status.categories-were-answered") }}</template>
          </custom-gauge>
        </f7-block>

        <p v-if="userStatus.time_in_app" class="experience-time">
          {{ $t("activity.my-status.you-are-in") }} <span class="value">{{ userStatus.time_in_app }}</span>
        </p>
        <p v-else class="experience-time">{{ $t("activity.my-status.past-categories") }}</p>
      </div>
    </transition>

    <teleport v-if="showSelectGoalSuccess" to="#activity-page">
      <success-message-popup
        title="Success"
        text="Your everyday goal has been set"
        @close="showSelectGoalSuccess = false"
      />
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, watch } from "vue";
import { storeToRefs } from "pinia";
import { f7 } from "framework7-vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/js/stores/auth";
import { useUserStats } from "@/js/stores/user-stats";
import CustomSelect from "@/components/custom-select.vue";
import playAudioMixin from "@/js/mixins/play_audio";
// import CustomGauge from "@/components/custom-gauge.vue";
// import CustomGaugeThree from "@/components/custom-gauge-three.vue";

const { playAudio } = playAudioMixin.setup();

const CustomGauge = defineAsyncComponent(() => import("@/components/custom-gauge.vue"));
const CustomGaugeThree = defineAsyncComponent(() => import("@/components/custom-gauge-three.vue"));
const SuccessMessagePopup = defineAsyncComponent(() => import("@/components/success-message-popup.vue"));

const authStore = useAuthStore();
const userStatsStore = useUserStats();

const { user } = storeToRefs(authStore);
const { userStatus } = storeToRefs(userStatsStore);

const { updateUser } = authStore;
const { getUserStatus } = userStatsStore;

const i18n = useI18n();

const props = defineProps({
  reqLoading: {
    type: Boolean,
  },
});

const emit = defineEmits(["go-progress-tab"]);

const customGaugeOptions = {
  width: 186,
  height: 186,
  radius: 93,
  strokeWidth: 10,
};
const goalsOptions = [
  `10 ${i18n.t("top-bar.questions")}`,
  `20 ${i18n.t("top-bar.questions")}`,
  `30 ${i18n.t("top-bar.questions")}`,
  `40 ${i18n.t("top-bar.questions")}`,
];

const isLoading = ref(false);
const disableSelect = ref(false);
const showSelectGoalSuccess = ref(false);

const amountAnswered = computed(() => {
  let amount = 0;
  if (userStatus.value && userStatus.value.daily_statics) {
    amount = userStatus.value.daily_statics.reduce((acc, statistic) => {
      acc += Number(statistic.count);
      return acc;
    }, 0);
  }
  return amount;
});

const staticInfo = computed(() => status => {
  let staticInfo = {
    count: 0,
    percent: 0,
  };
  if (amountAnswered.value && userStatus.value.daily_statics.find(s => s.status === status)) {
    staticInfo = userStatus.value.daily_statics.find(s => s.status === status);
    staticInfo.percent = (Number(staticInfo.count) * 100) / amountAnswered.value;
  }
  return staticInfo;
});

const questionsSelectDefault = computed(() =>
  user.value && user.value?.everyday_goal
    ? `${user.value?.everyday_goal} ${i18n.t("top-bar.questions")}`
    : `${i18n.t("activity.my-status.no-goal")}`,
);

const getUserStatusHandler = async () => {
  isLoading.value = true;

  await getUserStatus().then(data => {
    if (userStatus.value.points === undefined) {
      userStatus.value.last_quiz = data.last_quiz;
      userStatus.value.last_update = data.last_update;
      userStatus.value.points = data.points;
      userStatus.value.time_in_app = data.time_in_app;
      userStatus.value.past_categories_count = data.past_categories_count;
      userStatus.value.categories_count = data.categories_count;
      userStatus.value.past_categories_percent = data.past_categories_percent;
    }
  });

  isLoading.value = false;
};

const setGoalHandler = async goal => {
  const goalValue = parseInt(goal);
  disableSelect.value = true;
  playAudio("goalUpdate");
  await updateUser({ everyday_goal: goalValue }).then(res => {
    if (res.status === "success") {
      showSelectGoalSuccess.value = true;
      return;
    }

    f7.toast.show({
      text: res.message,
      closeButton: true,
    });
  });

  disableSelect.value = false;
};

const goLastQuiz = quiz => {
  if (quiz) {
    f7.views.main.router.navigate(`/categories/${quiz.lastCategory.id}/questions`);
  }
};

watch(
  () => props.reqLoading,
  () => {
    isLoading.value = props.reqLoading;
  },
  {
    immediate: true,
  },
);

getUserStatusHandler();
</script>

<style lang="scss">
@import "@/assets/scss/components/activity-tab";
@import "@/assets/scss/components/activity-my-status";
</style>
