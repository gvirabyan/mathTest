<template>
  <f7-toolbar class="hg-bottom-menu" position="bottom">
    <f7-link
      v-for="(link, index) in menuLinksRes"
      :key="`menu-link_${index + 1}`"
      :href="link.href"
      :class="{ active: link.active }"
      @click="resetPage(link.name)"
    >
      <div class="icon-container">
        <svg
          v-if="link.name === i18n.t('activity.Activity')"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.33301 26L7.33301 11.3333L12.6663 11.3333L12.6663 26"
            :stroke="link.name === i18n.t('activity.Activity') && link.active ? '#8419FF' : '#777481'"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path d="M12.667 26L12.667 6L18.0003 6L18.0003 26" fill="#EBE6F0" />
          <path
            d="M12.667 26L12.667 6L18.0003 6L18.0003 26"
            :stroke="link.name === i18n.t('activity.Activity') && link.active ? '#8419FF' : '#777481'"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M18 26L18 15.3333L23.3333 15.3333L23.3333 26"
            :stroke="link.name === i18n.t('activity.Activity') && link.active ? '#8419FF' : '#777481'"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M4.66699 26L26.0003 26"
            :stroke="link.name === i18n.t('activity.Activity') && link.active ? '#8419FF' : '#777481'"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <svg
          v-if="link.name === i18n.t('topics.topics')"
          width="18"
          height="22"
          viewBox="0 0 18 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 4.99951C17 3.89494 16.1046 2.99951 15 2.99951H14C13.4477 2.99951 13 3.44723 13 3.99951V3.99951C13 4.5518 12.5523 4.99951 12 4.99951H6C5.44772 4.99951 5 4.5518 5 3.99951V3.99951C5 3.44723 4.55228 2.99951 4 2.99951H3C1.89543 2.99951 1 3.89494 1 4.99951V18.9995C1 20.1041 1.89543 20.9995 3 20.9995H15C16.1046 20.9995 17 20.1041 17 18.9995V4.99951Z"
            :stroke="link.name === i18n.t('topics.topics') && link.active ? '#8419FF' : '#777481'"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5 1.99951C5 1.44723 5.44772 0.999512 6 0.999512H12C12.5523 0.999512 13 1.44723 13 1.99951V3.99951C13 4.5518 12.5523 4.99951 12 4.99951H6C5.44772 4.99951 5 4.5518 5 3.99951V1.99951Z"
            fill="#EBE6F0"
            :stroke="link.name === i18n.t('topics.topics') && link.active ? '#8419FF' : '#777481'"
            stroke-width="1.5"
          />
          <path
            d="M5 8.99951H13M5 11.9995H9"
            :stroke="link.name === i18n.t('topics.topics') && link.active ? '#8419FF' : '#777481'"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <svg
          v-if="link.name === i18n.t('practice.practice')"
          width="18"
          height="24"
          viewBox="0 0 18 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 9.41421V21L5 23H13L17 21V9.41421C17 9.149 16.8946 8.89464 16.7071 8.70711L9.70711 1.70711C9.31658 1.31658 8.68342 1.31658 8.29289 1.70711L1.29289 8.70711C1.10536 8.89464 1 9.149 1 9.41421Z"
            fill="#EBE6F0"
          />
          <path
            d="M1 9L5 11L9 9L13 11L17 9"
            :stroke="link.name === i18n.t('practice.practice') && link.active ? '#8419FF' : '#777481'"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5 11V23"
            :stroke="link.name === i18n.t('practice.practice') && link.active ? '#8419FF' : '#777481'"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13 11V23"
            :stroke="link.name === i18n.t('practice.practice') && link.active ? '#8419FF' : '#777481'"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path d="M13 5H5L9 1L13 5Z" fill="#777481" />
          <path
            d="M1 21V9L9 1L17 9V21"
            :stroke="link.name === i18n.t('practice.practice') && link.active ? '#8419FF' : '#777481'"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <svg
          v-if="link.name === i18n.t('profile.profile')"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.5 23.5C11.8333 22.5 13.3333 21.6667 14 21C15 20 12 20 12 15C12 11.6667 13.3333 10 16 10C18.6667 10 20 11.6667 20 15C20 20 17 20 18 21C18.6667 21.6667 20.1667 22.5 22.5 23.5"
            fill="#EBE6F0"
          />
          <path
            d="M9.5 23.5C11.8333 22.5 13.3333 21.6667 14 21C15 20 12 20 12 15C12 11.6667 13.3333 10 16 10C18.6667 10 20 11.6667 20 15C20 20 17 20 18 21C18.6667 21.6667 20.1667 22.5 22.5 23.5C22.5 23.5 20 26 16 26C12 26 9.5 23.5 9.5 23.5Z"
            fill="#EBE6F0"
          />
          <path
            d="M9.5 23.5C11.8333 22.5 13.3333 21.6667 14 21C15 20 12 20 12 15C12 11.6667 13.3333 10 16 10C18.6667 10 20 11.6667 20 15C20 20 17 20 18 21C18.6667 21.6667 20.1667 22.5 22.5 23.5C22.5 23.5 20 26 16 26C12 26 9.5 23.5 9.5 23.5Z"
            :stroke="link.name === i18n.t('profile.profile') && link.active ? '#8419FF' : '#777481'"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M16 26C21.5228 26 26 21.5228 26 16C26 10.4772 21.5228 6 16 6C10.4772 6 6 10.4772 6 16C6 21.5228 10.4772 26 16 26Z"
            :stroke="link.name === i18n.t('profile.profile') && link.active ? '#8419FF' : '#777481'"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <span class="link-title">{{ link.name }}</span>
    </f7-link>
  </f7-toolbar>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();

const props = defineProps({
  currentPath: {
    type: String,
    default: "/",
  },
});

const menuLinks = ref([
  {
    name: i18n.t("activity.Activity"),
    href: "/",
  },
  {
    name: i18n.t("topics.topics"),
    href: "/topics/",
  },
  {
    name: i18n.t("practice.practice"),
    href: "/practice/",
  },
  {
    name: i18n.t("profile.profile"),
    href: "/profile/account/",
  },
]);

const menuLinksRes = computed(() => {
  return menuLinks.value.map(link => ({
    ...link,
    active:
      link.name === i18n.t("profile.profile")
        ? link.href.split("e/")[0] === props.currentPath.split("e/")[0]
        : link.href === props.currentPath,
  }));
});

const resetPage = linkName => {
  // actually this will work for activity page
  if (linkName === "Activity" && document.getElementsByClassName("top-bar-tabs")[1]) {
    document.getElementsByClassName("top-bar-tabs")[1].children[0].click();
  } else if (linkName === "Activity") {
    document.getElementsByClassName("top-bar-tabs")[0].children[0].click();
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/components/bottom-menu.scss";
</style>
