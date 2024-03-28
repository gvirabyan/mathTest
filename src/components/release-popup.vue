<template>
  <div class="about-us-popup">
    <f7-button class="x-icon" @click="$emit('close')">
      <img src="@/assets/icons/x.svg" />
    </f7-button>
    <f7-block>
      <f7-block-title>{{ $t("profile.about-us.release-notes") }}</f7-block-title>
      <f7-list>
        <f7-list-item v-for="version in versions" :key="version.v">
          <p>
            <b>v{{ version.v }}</b>
          </p>
          <p>
            <small>{{ version.date }}</small>
          </p>
          <f7-list>
            <f7-list-item v-for="(change, index) in version.changes" :key="index">
              {{ change }}
            </f7-list-item>
          </f7-list>
        </f7-list-item>
      </f7-list>
    </f7-block>
  </div>
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
  .list {
    margin: 0 0 0 -56px;
    padding-top: 8px !important;
    padding-bottom: 8px !important;
    font-size: 14px;
    ul {
      li :deep(.item-content) {
        min-height: auto;
        .item-inner {
          padding-top: 0;
          padding-bottom: 0;
          min-height: auto;
          &:after {
            display: none;
          }
        }
      }
    }
  }
}
</style>
