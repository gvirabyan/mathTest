<template>
  <div class="solution-popup">
    <f7-button class="x-icon" @click="$emit('close')">
      <img src="@/assets/icons/x.svg" />
    </f7-button>
    <f7-block>
      <f7-block-title>{{ $t("question.exercise-solution") }}</f7-block-title>
      <div class="solution-content">
        <iframe
          :src="`https://schulmatheapp.de/solution.php?questionID=${questionID}&categoryName=${categoryName}`"
        ></iframe>
      </div>
    </f7-block>
  </div>
</template>

<script setup>
const props = defineProps({
  questionID: {
    type: Number,
    default: 0,
  },
  categoryName: {
    type: String,
    default: "",
  },
});
</script>
<style lang="scss"></style>
