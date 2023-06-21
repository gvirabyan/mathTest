<template>
  <f7-page name="my-stats">
    <f7-navbar title="My Stats" back-link="Back"></f7-navbar>
    <f7-block-title>My Stats</f7-block-title>

    <f7-block v-if="isLoading">
      <f7-row v-for="i in 4" :key="`skeleton_${i}`" class="mb-8">
        <f7-col width="75">
          <f7-skeleton-block effect="wave" />
        </f7-col>
        <f7-col width="25">
          <f7-skeleton-block effect="wave" />
        </f7-col>
      </f7-row>
    </f7-block>

    <template v-else>
      <f7-block-title>How long I am in Math App:</f7-block-title>
      <f7-block>
        <p>{{ howLongStr }}</p>
      </f7-block>

      <f7-block-title>My points</f7-block-title>
      <f7-block>
        <p>{{ myStats?.points }}</p>
      </f7-block>

      <f7-block-title>My rankings</f7-block-title>
      <f7-block>
        <f7-list>
          <f7-list-item title="World">
            <template #after>
              <strong>{{ myStats.rankings.world }}</strong>
            </template>
          </f7-list-item>
          <f7-list-item v-if="!myStats.rankings.country">
            <p class="m-0">
              Please <f7-link href="/profile/">update</f7-link> your country information to see your rank in your
              country
            </p>
          </f7-list-item>
          <f7-list-item v-else title="Country">
            <template #after>
              <strong>{{ myStats.rankings.country }}</strong>
            </template>
          </f7-list-item>
          <f7-list-item v-if="!myStats.rankings.city">
            <p class="m-0">
              Please <f7-link href="/profile/">update</f7-link> your city information to see your rank in your country
            </p>
          </f7-list-item>
          <f7-list-item v-else title="City">
            <template #after>
              <strong>{{ myStats.rankings.city }}</strong>
            </template>
          </f7-list-item>
          <f7-list-item v-if="!myStats.rankings.institution">
            <p class="m-0">
              Please <f7-link href="/profile/">update</f7-link> your school/university/college information to see your
              rank in your country
            </p>
          </f7-list-item>
          <f7-list-item v-else title="School/University/College">
            <template #after>
              <strong>{{ myStats.rankings.institution }}</strong>
            </template>
          </f7-list-item>
          <f7-list-item v-if="!myStats.rankings.course">
            <p class="m-0">
              Please <f7-link href="/profile/">update</f7-link> your class/course information to see your rank in your
              country
            </p>
          </f7-list-item>
          <f7-list-item v-else title="Class/Course">
            <template #after>
              <strong>{{ myStats.rankings.course }}</strong>
            </template>
          </f7-list-item>
        </f7-list>
      </f7-block>

      <f7-block-title>My answers</f7-block-title>
      <f7-block>
        <f7-list>
          <f7-list-item title="Correct">
            <template #after>
              <strong>{{ myStats.answers.correct }}/{{ myStats.answers.count }} ({{ correctAnswersPercent }}%)</strong>
            </template>
          </f7-list-item>
          <f7-list-item title="Wrong">
            <template #after>
              <strong>{{ myStats.answers.wrong }}/{{ myStats.answers.count }} ({{ wrongAnswersPercent }}%)</strong>
            </template>
          </f7-list-item>
          <f7-list-item title="Skipped">
            <template #after>
              <strong>{{ myStats.answers.skipped }}/{{ myStats.answers.count }} ({{ skippedAnswersPercent }}%)</strong>
            </template>
          </f7-list-item>
        </f7-list>
      </f7-block>
    </template>
  </f7-page>
</template>

<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useTopListStore } from "@/js/stores/top-list";
import delay from "@/js/helpers/delay";
import pluralizeWord from "@/js/utils/pluralize-word";

const { myStats } = storeToRefs(useTopListStore());
const { getMyStats } = useTopListStore();

const isLoading = ref(false);

const howLongStr = computed(() => {
  const years = myStats.value?.howMuchTime.years;
  const months = myStats.value?.howMuchTime.months;
  const days = myStats.value?.howMuchTime.days;

  if (years) {
    return `${years} ${pluralizeWord(years, "year")}, ${months} ${pluralizeWord(
      months,
      "month",
    )}, ${days} ${pluralizeWord(days, "day")}`;
  }

  if (months) {
    return `${months} ${pluralizeWord(months, "month")}, ${days} ${pluralizeWord(days, "day")}`;
  }

  return `${days} ${pluralizeWord(days, "day")}`;
});

const correctAnswersPercent = computed(() => getAnswersPercent(myStats.value.answers.correct));
const wrongAnswersPercent = computed(() => getAnswersPercent(myStats.value.answers.wrong));
const skippedAnswersPercent = computed(() => getAnswersPercent(myStats.value.answers.skipped));

const getMyStatsHandler = async () => {
  isLoading.value = true;

  await delay();
  await getMyStats();

  isLoading.value = false;
};

const getAnswersPercent = answers => {
  if (!answers) {
    return 0;
  }

  return Math.round((answers / myStats.value.answers.count) * 100);
};

getMyStatsHandler();
</script>

<style scoped></style>
