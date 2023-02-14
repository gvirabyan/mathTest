<template>
  <f7-page class="hg-categories-page" name="player-vs-machine">
    <f7-navbar title="Player vs. Machine" back-link="Back" />

    <f7-list>
      <f7-list-item
        v-for="{ id, questions } in gameModes"
        :key="id"
        @click="f7router.navigate({ name: 'PlayerVsMachineQuiz', params: { modeID: id } })"
      >
        <template #title> {{ questions }} Questions </template>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script setup>
defineProps({
  f7router: Object,
});

const gameModes = [
  {
    id: 1,
    questions: 10,
  },
  {
    id: 2,
    questions: 20,
  },
  {
    id: 3,
    questions: 30,
  },
];
</script>

<style scoped></style>
