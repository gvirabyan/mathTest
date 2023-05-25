<template>
  <f7-page class="hg-practice-page" name="player-vs-machine" @page:afterin="loadFirstTab">
    <topbar ref="topBar" :tabs="practiceTabs" :search="false">
      <template #title>{{ $t("practice.practice") }}</template>
      <template v-if="user && user.everyday_goal" #subtitle>{{ $t("top-bar.today-goal") }}</template>
      <template v-if="user && user.everyday_goal" #subtitle-data>{{
        `${user.everyday_goal} ${$t("top-bar.questions")}`
      }}</template>
    </topbar>

    <f7-list>
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

    <bottom-menu :current-path="props.f7route.path" />
  </f7-page>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/js/stores/auth";
import { useCategoryStore } from "@/js/stores/categories";
import { useQuizStore } from "@/js/stores/quiz";
import quizModes from "@/js/constants/quiz-modes";
import BottomMenu from "@/components/bottom-menu.vue";
import Topbar from "@/components/topbar.vue";
import { useI18n } from "vue-i18n";

import { storeToRefs } from "pinia";

const props = defineProps({
  f7router: { type: Object, default: () => {} },
  f7route: { type: Object, default: () => {} },
});

const { user } = storeToRefs(useAuthStore());
const { setQuizMode } = useQuizStore();

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
  },
  {
    id: 2,
    name: i18n.t("practice.play-with-friends"),
  },
];

const topBar = ref(null);

const loadFirstTab = () => {
  topBar.value.selectFirstTab(practiceTabs, false);
};

const setMode = mode => {
  setQuizMode(mode);
  props.f7router.navigate({ name: "PlayerVsMachineQuiz", params: { modeID: mode.id } });
};
</script>

<style lang="scss">
@import "@/assets/scss/pages/practice.scss";
</style>
