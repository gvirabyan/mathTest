<template>
  <f7-block>
    <f7-list>
      <f7-list-item>
        <f7-link @click="openExternalLink('https://www.wonderpush.com')">
          <p>Wonderpush</p>
          www.wonderpush.com
        </f7-link>
      </f7-list-item>
      <f7-list-item>
        <f7-link @click="openExternalLink('https://clarity.microsoft.com')">
          <p>Microsoft Clarity</p>
          www.clarity.microsoft.com
        </f7-link>
      </f7-list-item>
      <f7-list-item>
        <f7-link @click="openExternalLink('https://strapi.io/')">
          <p>Strapi</p>
          www.strapi.io
        </f7-link>
      </f7-list-item>
      <f7-list-item>
        <f7-link @click="openExternalLink('https://framework7.io/')">
          <p>Framework7</p>
          www.framework7.io
        </f7-link>
      </f7-list-item>
      <f7-list-item>
        <f7-link @click="openExternalLink('https://developers.google.com')">
          <p>Google places API</p>
          www.developers.google.com/maps/documentation/places/web-service
        </f7-link>
      </f7-list-item>
      <f7-list-item>
        <f7-link @click="openExternalLink('https://momentjs.com/')">
          <p>Moment.js</p>
          www.momentjs.com
        </f7-link>
      </f7-list-item>
      <f7-list-item>
        <f7-link @click="openExternalLink('https://github.com/WiseLibs/better-sqlite3')">
          <p>better-sqlite3</p>
          www.github.com/WiseLibs/better-sqlite3
        </f7-link>
      </f7-list-item>
      <f7-list-item>
        <f7-link @click="openExternalLink('http://github.com/mashpie/i18n-node')">
          <p>i18n</p>
          www.github.com/mashpie/i18n-node
        </f7-link>
      </f7-list-item>
      <f7-list-item>
        <f7-link @click="openExternalLink('http://github.com/brianc/node-postgres')">
          <p>PostgreSQL client</p>
          www.github.com/brianc/node-postgres
        </f7-link>
      </f7-list-item>
    </f7-list>
  </f7-block>
</template>

<script setup>
import openExternalLink from "@/js/utils/external-link";
</script>

<style lang="scss" scoped>
.list {
  :deep(ul) {
    &:before {
      display: none;
    }
    .item-content {
      padding-left: 0;
      .item-inner {
        padding-right: 0;
        .link {
          display: block;
          word-break: break-all;
          p {
            width: 100%;
            color: #212121;
          }
        }
      }
    }
  }
}
</style>
