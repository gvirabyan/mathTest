<template>
  <f7-page class="hg-categories-page" name="player-vs-machine">
    <f7-navbar title="Player vs. Machine" back-link="Back" />

    <f7-list>
      <f7-list-item v-for="mode in gameModes" :key="mode.id" @click="setMode(mode)">
        <template #title> {{ mode.questions }} Questions </template>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script setup>
import { useQuizStore } from "@/js/stores/quiz";
import quizModes from "@/js/constants/quiz-modes";

const props = defineProps({
  f7router: Object,
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

const setMode = mode => {
  setQuizMode(mode);
  props.f7router.navigate({ name: "PlayerVsMachineQuiz", params: { modeID: mode.id } });
};
</script>

<style scoped></style>
