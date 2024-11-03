<template>
  <f7-page
    class="hg-practice-page"
    name="player-vs-machine"
    @page:beforein="loadTab"
    @page:afterout="clearLastFriendPractice"
  >
    <f7-navbar id="main-navbar">
      <top-bar ref="topBar" :tabs="practiceTabs" :search="false" @tab-selected="setRivalTypeHandler">
        <template #title>{{ $t("practice.practice") }}</template>
        <template v-if="user && user.everyday_goal" #subtitle>{{ $t("top-bar.today-goal") }}</template>
        <template v-if="user && user.everyday_goal" #subtitle-data>{{
          `${user.everyday_goal} ${$t("top-bar.questions")}`
        }}</template>
      </top-bar>
    </f7-navbar>
    <f7-toolbar position="bottom">
      <bottom-menu :current-path="props.f7route.path" />
    </f7-toolbar>

    <f7-block>
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
        <div v-if="!isLoading && isLastFriendPractice" class="score-block-wrapper">
          <div class="score-blocks">
            <div class="score-block">
              <f7-row class="justify-content-space-between">
                <f7-block-title>
                  {{ lastFriendPractice.firstPlayer.nickname }} {{ $t("question.score-on-this-topic") }}
                </f7-block-title>
                <p class="place-txt">
                  {{ lastFriendPractice.firstPlayer.score }}
                  {{ pluralizeWord(lastFriendPractice.firstPlayer.score, $t("question.point")) }}
                </p>
              </f7-row>

              <f7-row class="justify-content-space-between align-items-center">
                <p class="from-txt">
                  {{ lastFriendPractice.firstPlayer.rightAnswers }}/{{ lastFriendPractice.mode.questions }}
                  {{ $t("question.right-answered") }}
                </p>
                <p class="result-txt">{{ getResultText(lastFriendPractice.firstPlayer.result) }}</p>
              </f7-row>
            </div>

            <div class="score-block">
              <f7-row class="justify-content-space-between">
                <f7-block-title>
                  {{ lastFriendPractice.secondPlayer.nickname }} {{ $t("question.score-on-this-topic") }}
                </f7-block-title>
                <p class="place-txt">
                  {{ lastFriendPractice.secondPlayer.score }}
                  {{ pluralizeWord(lastFriendPractice.secondPlayer.score, $t("question.point")) }}
                </p>
              </f7-row>

              <f7-row class="justify-content-space-between align-items-center">
                <p class="from-txt">
                  {{ lastFriendPractice.secondPlayer.rightAnswers }}/{{ lastFriendPractice.mode.questions }}
                  {{ $t("question.right-answered") }}
                </p>
                <p class="result-txt">{{ getResultText(lastFriendPractice.secondPlayer.result) }}</p>
              </f7-row>
            </div>
          </div>

          <f7-button class="can-practice-btn" @click="tryAgainHandler">{{ $t("practice.try-again") }}</f7-button>
        </div>

        <div v-else-if="!isLoading" class="can-practice-content">
          <h2 class="can-practice-title">{{ $t("practice.can-practice-with-friends") }}</h2>
          <p class="can-practice-subtitle">{{ $t("practice.practice-with-friends-questions") }}</p>
          <f7-button class="can-practice-btn" @click="startPracticeVsFriend = true">{{
            $t("buttons.start")
          }}</f7-button>
        </div>
      </f7-block>
    </f7-block>
  </f7-page>
</template>

<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/js/stores/auth";
import { useQuizStore } from "@/js/stores/quiz";
import quizModes from "@/js/constants/quiz-modes";
import pluralizeWord from "@/js/utils/pluralize-word";
import { isNullish } from "@/js/utils/objects-utils";
import TopBar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";
import playAudioMixin from "@/js/mixins/play_audio";

const props = defineProps({
  f7router: { type: Object, default: () => {} },
  f7route: { type: Object, default: () => {} },
});

const { user } = storeToRefs(useAuthStore());
const { lastFriendPractice } = storeToRefs(useQuizStore());
const { setQuizMode, setQuizRivalType, clearLastFriendPractice } = useQuizStore();
const { playAudio, tabChange } = playAudioMixin.setup();

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

const isLastFriendPractice = computed(
  () =>
    !isNullish(lastFriendPractice.value.firstPlayer) &&
    !isNullish(lastFriendPractice.value.firstPlayer) &&
    !isNullish(lastFriendPractice.value.mode),
);

const loadTab = () => {
  if (isLastFriendPractice.value) {
    const playWithFriendTabId = 2;
    const playWithFriendTabIndex = practiceTabs.findIndex(tab => tab.id === playWithFriendTabId);

    topBar.value.selectTab(playWithFriendTabId, playWithFriendTabIndex);
    return;
  }

  topBar.value.selectFirstTab(practiceTabs, false);
};

const setMode = mode => {
  setQuizMode(mode);
  props.f7router.navigate({ name: "PlayerVsMachineQuiz", params: { modeID: mode.id } });
};

const checkPageRedirect = ref(0);

const setRivalTypeHandler = tabId => {
  const rival = practiceTabs.find(tab => tab.id === tabId).rivalType;

  activeTabId.value = tabId;
  startPracticeVsFriend.value = false;
  setQuizRivalType(rival);
  if (checkPageRedirect.value > 1) {
    tabChange.pause();
    tabChange.currentTime = 0;
    playAudio("tabChange");
  }
  checkPageRedirect.value++;
};

const getResultText = result => {
  const resultObj = {
    win: i18n.t("practice.result-win"),
    draw: i18n.t("practice.result-draw"),
    lose: i18n.t("practice.result-lose"),
  };

  return resultObj[result];
};

const tryAgainHandler = () => {
  clearLastFriendPractice();
  setQuizRivalType("fake_user");
  startPracticeVsFriend.value = true;
};
</script>

<style lang="scss">
@import "@/assets/scss/pages/practice.scss";
</style>
