<template>
  <f7-block class="top-list">
    <f7-row no-gap>
      <f7-col>Nickname</f7-col>
      <f7-col>1000</f7-col>
    </f7-row>
    <f7-row no-gap>
      <f7-col>Nickname</f7-col>
      <f7-col>1000</f7-col>
    </f7-row>
    <f7-row no-gap>
      <f7-col>Nickname</f7-col>
      <f7-col>1000</f7-col>
    </f7-row>
  </f7-block>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
@import "@/assets/scss/components/top-list.scss";
</style>
