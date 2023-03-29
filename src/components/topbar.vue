<template>
  <div class="top-bar">
    <div class="justify-content-space-between">
      <h1 class="top-bar-title"><slot name="title"></slot></h1>
    </div>
    <div class="top-bar-subtitle-wrapper">
      <p class="top-bar-subtitle"><slot name="subtitle"></slot></p>
      <p class="top-bar-subtitle-data"><slot name="subtitle-data"></slot></p>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
@import "@/assets/scss/components/top-bar.scss";
</style>
