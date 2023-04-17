<template>
  <div class="about-us-popup">
    <f7-button class="x-icon" @click="$emit('close')">
      <img src="@/assets/icons/x.svg" />
    </f7-button>
    <f7-block>
      <f7-block-title>Write a review</f7-block-title>
    </f7-block>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/components/about-us-popups.scss";
</style>
