<template>
  <f7-page class="hg-practice-page" name="player-vs-machine" @page:afterin="loadFirstTab">
    <topbar ref="topBar" :tabs="practiceTabs" :search="false" @tab-selected="setRivalTypeHandler">
      <template #title>{{ $t("practice.practice") }}</template>
      <template v-if="user && user.everyday_goal" #subtitle>{{ $t("top-bar.today-goal") }}</template>
      <template v-if="user && user.everyday_goal" #subtitle-data>{{
        `${user.everyday_goal} ${$t("top-bar.questions")}`
      }}</template>
    </topbar>

    <f7-list v-if="activeTabId === 1 || (activeTabId === 2 && startPracticeVsFriend)">
      <f7-list-item v-for="mode in gameModes" :key="mode.id" @click="setMode(mode)">
        <template #title>
          <f7-row class="justify-content-space-between align-items-center">
            <p class="question">
              {{ mode.questions }}
              <span>{{ $t("top-bar.questions") }}</span>
            </p>
            <p class="points">{{ mode.showPoints }}</p>
          </f7-row>
        </template>
      </f7-list-item>
    </f7-list>

    <f7-block v-else-if="activeTabId === 2 && !startPracticeVsFriend" class="can-practice">
      <div v-if="!isLoading && !lastFriendPractice" class="can-practice-content">
        <h2 class="can-practice-title">{{ $t("practice.can-practice-with-friends") }}</h2>
        <p class="can-practice-subtitle">{{ $t("practice.practice-with-friends-questions") }}</p>
        <f7-button class="can-practice-btn" @click="startPracticeVsFriend = true">{{ $t("buttons.start") }}</f7-button>
      </div>

      <div v-else-if="!isLoading && lastFriendPractice" class="score-block-wrapper">
        <div class="score-blocks">
          <div class="score-block">
            <f7-row class="justify-content-space-between">
              <f7-block-title>
                {{ $t("question.your-score-on-this-topic") }}
              </f7-block-title>
              <p class="place-txt">
                {{ lastFriendPractice.user_result }}
                {{ pluralizeWord(lastFriendPractice.user_result, $t("question.point")) }}
              </p>
            </f7-row>

            <f7-row class="justify-content-space-between align-items-center">
              <p class="from-txt">
                {{ lastFriendPractice.user_score }}/{{ lastFriendPractice.mode.questions }}
                {{ $t("question.right-answered") }}
              </p>
            </f7-row>
          </div>

          <div class="score-block">
            <f7-row class="justify-content-space-between">
              <f7-block-title>
                {{ $t("question.friends-score-on-this-topic") }}
              </f7-block-title>
              <p class="place-txt">
                {{ lastFriendPractice.rival_result }}
                {{ pluralizeWord(lastFriendPractice.rival_result, $t("question.point")) }}
              </p>
            </f7-row>

            <f7-row class="justify-content-space-between align-items-center">
              <p class="from-txt">
                {{ lastFriendPractice.rival_score }}/{{ lastFriendPractice.mode.questions }}
                {{ $t("question.right-answered") }}
              </p>
            </f7-row>
          </div>
        </div>

        <f7-button class="can-practice-btn" @click="startPracticeVsFriend = true">{{
          $t("practice.try-again")
        }}</f7-button>
      </div>
    </f7-block>

    <bottom-menu :current-path="props.f7route.path" />
  </f7-page>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/js/stores/auth";
import { useQuizStore } from "@/js/stores/quiz";
import quizModes from "@/js/constants/quiz-modes";
import pluralizeWord from "@/js/utils/pluralize-word";
import Topbar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";

const props = defineProps({
  f7router: { type: Object, default: () => {} },
  f7route: { type: Object, default: () => {} },
});

const { user } = storeToRefs(useAuthStore());
const { lastFriendPractice } = storeToRefs(useQuizStore());
const { setQuizMode, setQuizRivalType } = useQuizStore();

const gameModes = [
  {
    id: 1,
    questions: quizModes.QUESTIONS_MODE_1,
    winPoints: quizModes.QUESTIONS_MODE_1,
    drawPoints: quizModes.DRAW_POINTS_MODE_1,
    losePoints: quizModes.LOSE_POINTS_MODE_1,
    showPoints: "+10, +5, -2",
  },
  {
    id: 2,
    questions: quizModes.QUESTIONS_MODE_2,
    winPoints: quizModes.QUESTIONS_MODE_2,
    drawPoints: quizModes.DRAW_POINTS_MODE_2,
    losePoints: quizModes.LOSE_POINTS_MODE_2,
    showPoints: "+20, +10, -4",
  },
  {
    id: 3,
    questions: quizModes.QUESTIONS_MODE_3,
    winPoints: quizModes.QUESTIONS_MODE_3,
    drawPoints: quizModes.DRAW_POINTS_MODE_3,
    losePoints: quizModes.LOSE_POINTS_MODE_3,
    showPoints: "+30, +15, -6",
  },
];

const i18n = useI18n();

const practiceTabs = [
  {
    id: 1,
    name: i18n.t("practice.player-vs-machine"),
    rivalType: "machine",
  },
  {
    id: 2,
    name: i18n.t("practice.play-with-friends"),
    rivalType: "fake_user",
  },
];

const isLoading = ref(false);
const topBar = ref(null);
const activeTabId = ref(practiceTabs[0].id);
const startPracticeVsFriend = ref(false);

const loadFirstTab = () => {
  topBar.value.selectFirstTab(practiceTabs, false);
};

const setMode = mode => {
  setQuizMode(mode);
  props.f7router.navigate({ name: "PlayerVsMachineQuiz", params: { modeID: mode.id } });
};

const setRivalTypeHandler = tabId => {
  const rival = practiceTabs.find(tab => tab.id === tabId).rivalType;

  activeTabId.value = tabId;
  startPracticeVsFriend.value = false;

  setQuizRivalType(rival);
};
</script>

<style lang="scss">
@import "@/assets/scss/pages/practice.scss";
</style>
