<template>
  <f7-block class="top-list">
    <slot name="updateInfo" />
    <slot name="searchInput" />

    <f7-row v-if="isLoading">
      <f7-col>
        <f7-skeleton-block effect="wave" />
      </f7-col>
      <f7-col>
        <f7-skeleton-block effect="wave" />
      </f7-col>
    </f7-row>

    <f7-row v-else-if="!items.length">
      <f7-col>There are no results yet</f7-col>
    </f7-row>

    <f7-row
      v-else
      v-for="({nickname, username, points}, index) in items"
      :key="`top-list-row_${index + 1}`"
      no-gap
    >
      <f7-col>{{ nickname || username }}</f7-col>
      <f7-col class="text-right">{{ points }}</f7-col>
    </f7-row>
  </f7-block>
</template>

<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array,
    default: () => []
  },
})
</script>

<style scoped>
@import "@/assets/scss/components/top-list.scss";
</style>
