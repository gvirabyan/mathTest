<template>
  <f7-block>
    <f7-block v-for="version in versions" :key="version.v">
      <p>
        <b>v{{ version.v }}</b>
        <br />
        <small>{{ version.date }}</small>
      </p>
      <f7-list>
        <f7-list-item v-for="(change, index) in version.changes" :key="index">
          {{ change }}
        </f7-list-item>
      </f7-list>
    </f7-block>
  </f7-block>
</template>

<script setup>
import { ref } from "vue";

const lang = import.meta.env.VITE_LANGUAGE;
const versions = ref(null);
import(`../../src/locales/${lang}.json`).then(data => {
  versions.value = data.default.versions;
});
</script>

<style lang="scss" scoped>
.list {
  margin-top: 0;
  :deep(ul) {
    &:after,
    &:before {
      display: none;
    }
  }
}
</style>
