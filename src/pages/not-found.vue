<template>
  <f7-page class="hg-dashboard-content not-found-page" @page:beforein="getAllData">
    <div class="not-found-page-content">
      <f7-block>
        <f7-block-title>404 Not Found</f7-block-title>
        <p class="unfortunately-text">
          Unfortunately we couldn't find the page you are looking for, but we find some artwork about parties, friends
          and human relationships. Enjoy)).
        </p>

        <div v-if="mathematician" class="mathematician">
          <div class="mathematician-avatar">
            <img :src="`/images/mathematicians/${mathematician.img}.jpg`" :alt="`${mathematician.img}`" />
            <p class="mathematician-name">{{ mathematician.name }}</p>
          </div>

          <p>{{ mathematician.bio }}</p>
        </div>
      </f7-block>
    </div>

    <bottom-menu :current-path="f7route.path" />
  </f7-page>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import BottomMenu from "@/components/bottom-menu.vue";

defineProps({
  f7route: {
    type: Object,
    default: () => {},
  },
});

const i18n = useI18n();

const mathematician = ref(null);

const getAllData = () => {
  const index = Math.round(Math.random() * 9);
  mathematician.value = {
    name: i18n.t(`not-found.mathematics.${index}.name`),
    bio: i18n.t(`not-found.mathematics.${index}.bio`),
    img: i18n.t(`not-found.mathematics.${index}.img`),
  };
};
</script>

<style lang="scss">
@import "../assets/scss/pages/not-found";
</style>
