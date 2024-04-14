<template>
  <div class="about-us-popup">
    <f7-button class="x-icon" @click="$emit('close')">
      <img src="@/assets/icons/x.svg" />
    </f7-button>
    <f7-block>
      <f7-block-title>{{ $t("profile.about-us.software-licenses") }}</f7-block-title>
      <f7-list>
        <f7-list-item>
          <p>Wonderpush</p>
          <f7-link target="_blank" href="https://www.wonderpush.com" external>www.wonderpush.com</f7-link>
        </f7-list-item>
        <f7-list-item>
          <p>Microsoft Clarity</p>
          <f7-link target="_blank" href="https://clarity.microsoft.com" external>www.clarity.microsoft.com</f7-link>
        </f7-list-item>
        <f7-list-item>
          <p>Strapi</p>
          <f7-link target="_blank" href="https://strapi.io/" external>www.strapi.io</f7-link>
        </f7-list-item>
        <f7-list-item>
          <p>Framework7</p>
          <f7-link target="_blank" href="https://framework7.io/" external>www.framework7.io</f7-link>
        </f7-list-item>
        <f7-list-item>
          <p>Google places API</p>
          <f7-link target="_blank" href="https://developers.google.com/maps/documentation/places/web-service" external
            >www.developers.google.com/maps/documentation/places/web-service</f7-link
          >
        </f7-list-item>
        <f7-list-item>
          <p>Moment.js</p>
          <span class="link external" onclick="window.open(encodeURI('https://momentjs.com/'), '_system')"
            >www.momentjs.com</span
          >
        </f7-list-item>
        <f7-list-item>
          <p>better-sqlite3</p>
          <f7-link target="_blank" href="https://github.com/WiseLibs/better-sqlite3" external
            >www.github.com/WiseLibs/better-sqlite3</f7-link
          >
        </f7-list-item>
        <f7-list-item>
          <p>i18n</p>
          <f7-link target="_blank" href="http://github.com/mashpie/i18n-node" external
            >www.github.com/mashpie/i18n-node</f7-link
          >
        </f7-list-item>
        <f7-list-item>
          <p>PostgreSQL client</p>
          <f7-link target="_blank" href="" external>www.github.com/brianc/node-postgres</f7-link>
        </f7-list-item>
      </f7-list>
    </f7-block>
  </div>
</template>

<script setup></script>
<style lang="scss"></style>
