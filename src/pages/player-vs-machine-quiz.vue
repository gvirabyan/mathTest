<template>
  <f7-page
    class="hg-categories-page"
    name="player-vs-machine"
    @page:beforein="getQuizQuestions(quizMode.questions, pastCategoriesIds)"
  >
    <f7-navbar title="Player vs. Machine" back-link="Back" />

    <f7-block>Boop {{ f7route.params.modeID }}</f7-block>
  </f7-page>
</template>

<script setup>
import { useCategoryStore } from "@/js/stores/categories";
import { useQuestionsStore } from "@/js/stores/questions";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const props = defineProps({
  f7route: Object,
});

const { pastCategoriesData } = storeToRefs(useCategoryStore());
const { questions, quizMode } = storeToRefs(useQuestionsStore());
const { getQuizQuestions } = useQuestionsStore();

const pastCategoriesIds = computed(() => pastCategoriesData.value.map(c => c.id));
</script>

<style scoped></style>
