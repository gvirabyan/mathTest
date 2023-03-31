<template>
  <f7-page class="hg-practice-page" name="player-vs-machine">
    <top-bar :tabs="practiceTabs">
      <template #title>Topics</template>
      <template #subtitle>Today's Goal</template>
      <template #subtitle-data>20 questions</template>
    </top-bar>

    <f7-list>
      <f7-list-item v-for="mode in gameModes" :key="mode.id" @click="setMode(mode)">
        <template #title> {{ mode.questions }} Questions </template>
      </f7-list-item>
    </f7-list>

    <bottom-menu :current-path="props.f7route.path" />
  </f7-page>
</template>

<script setup>
import { useQuizStore } from "@/js/stores/quiz";
import quizModes from "@/js/constants/quiz-modes";
import BottomMenu from "@/components/bottom-menu.vue";
import TopBar from "@/components/topbar.vue";

const props = defineProps({
  f7router: Object,
  f7route: Object,
});

const { setQuizMode } = useQuizStore();

const gameModes = [
  {
    id: 1,
    questions: quizModes.QUESTIONS_MODE_1,
    winPoints: quizModes.QUESTIONS_MODE_1,
    drawPoints: quizModes.DRAW_POINTS_MODE_1,
    losePoints: quizModes.LOSE_POINTS_MODE_1,
  },
  {
    id: 2,
    questions: quizModes.QUESTIONS_MODE_2,
    winPoints: quizModes.QUESTIONS_MODE_2,
    drawPoints: quizModes.DRAW_POINTS_MODE_2,
    losePoints: quizModes.LOSE_POINTS_MODE_2,
  },
  {
    id: 3,
    questions: quizModes.QUESTIONS_MODE_3,
    winPoints: quizModes.QUESTIONS_MODE_3,
    drawPoints: quizModes.DRAW_POINTS_MODE_3,
    losePoints: quizModes.LOSE_POINTS_MODE_3,
  },
];

const practiceTabs = [
  {
    id: "1",
    name: "Player VS Machine",
  },
  {
    id: "2",
    name: "Play with Friends",
  },
];

const setMode = mode => {
  setQuizMode(mode);
  props.f7router.navigate({ name: "PlayerVsMachineQuiz", params: { modeID: mode.id } });
};
</script>

<style lang="scss">
@import "@/assets/scss/pages/practice.scss";
</style>
