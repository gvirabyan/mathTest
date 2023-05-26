<template>
  <div class="notifications">
    <f7-list v-if="!isLoading && notifications?.length" class="notifications-list">
      <f7-list-item v-for="item in notifications" :key="item?.id" @click="selectNotification(item?.id)">
        <h3 class="item-title">
          <svg
            v-if="item?.attributes?.read === false || item?.read === false"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="5" cy="5" r="5" fill="#FFC700" />
          </svg>

          {{ item?.attributes?.title || item?.title }}
        </h3>
        <p class="item-text">{{ item?.attributes?.text || item?.text }}</p>
        <p class="item-date">{{ formatDate(item?.attributes?.createdAt) || formatDate(item?.createdAt) }}</p>
      </f7-list-item>
    </f7-list>

    <f7-block v-else-if="!notifications?.length" class="no-margin-top no-padding">
      <p>{{ $t("notification.there-arnt-notification") }}</p>
    </f7-block>

    <loading-small v-else />

    <f7-block class="welcome-block">
      <h3 class="title">{{ $t("notification.welcome-app") }}</h3>
      <p class="text">{{ $t("notification.play-more-games") }}</p>
    </f7-block>

    <teleport v-if="isPopupOpened" to=".framework7-modals">
      <success-message-popup
        v-if="isPopupOpened"
        ref="successMessage"
        :title="currentNotification.attributes?.title || currentNotification.title"
        :text="currentNotification.attributes?.text || currentNotification.text"
        :date="formatDate(currentNotification.attributes?.createdAt) || formatDate(currentNotification.createdAt)"
        :btn-text="$t('buttons.close')"
        @appeared="readNotification(currentNotification.id)"
        @close="currentNotification = null"
      />
    </teleport>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useElementVisibility } from "@vueuse/core";
import { useNotifications } from "@/js/stores/notifications";
import LoadingSmall from "@/components/loading-small.vue";

const SuccessMessagePopup = defineAsyncComponent(() => import("@/components/success-message-popup.vue"));

const { notifications } = storeToRefs(useNotifications());
const { readNotification } = useNotifications();

const isLoading = ref(false);
const isPopupOpened = ref(false);
const currentNotification = ref(null);
const successMessage = ref(null);
const successMessageIsVisible = useElementVisibility(successMessage);

const selectNotification = id => {
  currentNotification.value = notifications.value.find(n => n.id === id);
};

const formatDate = date => {
  const objectDate = new Date(date);
  const day = objectDate.getDate();
  const month = objectDate.getMonth() + 1;
  const year = objectDate.getFullYear();

  return `${day}.${month}.${year}`;
};

watch(currentNotification, value => {
  if (!value) {
    isPopupOpened.value = false;
    return;
  }

  isPopupOpened.value = true;
});

watch(successMessageIsVisible, value => {
  if (value) return;

  isPopupOpened.value = false;
});
</script>

<style lang="scss">
@import "@/assets/scss/components/notifications";
</style>
