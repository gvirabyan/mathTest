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
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
import { useNotifications } from "@/js/stores/notifications";
import { DEFAULT_TIMEZONE } from "@/js/constants/common";
import { createDatetimeString } from "@/js/utils/dates";
import LoadingSmall from "@/components/loading-small.vue";

const SuccessMessagePopup = defineAsyncComponent(() => import("@/components/success-message-popup.vue"));

const { user } = storeToRefs(useAuthStore());
const { notifications, currentPage, querySending, pageCount } = storeToRefs(useNotifications());
const { readNotification, getNotifications } = useNotifications();

const isLoading = ref(false);
const isPopupOpened = ref(false);
const currentNotification = ref(null);

const selectNotification = id => {
  currentNotification.value = notifications.value.find(n => n.id === id);
};

const formatDate = date => {
  const userDate = createDatetimeString(date, user.user_timezone || DEFAULT_TIMEZONE).split("T")[0];
  const userDateArr = userDate.split("-");
  const day = userDateArr[2];
  const month = userDateArr[1];
  const year = userDateArr[0];

  return `${day}.${month}.${year}`;
};

watch(currentNotification, value => {
  if (!value) {
    isPopupOpened.value = false;
    return;
  }

  isPopupOpened.value = true;
});

let mainScrollElem = null;
onMounted(() => {
  mainScrollElem = document.getElementsByClassName("page-content")[0];
  mainScrollElem.addEventListener("scroll", handelScroll);
});

onBeforeUnmount(() => {
  mainScrollElem.removeEventListener("scroll", handelScroll);
});

const handelScroll = () => {
  if (
    mainScrollElem.offsetHeight + mainScrollElem.scrollTop > mainScrollElem.scrollHeight - 300 &&
    !querySending.value &&
    currentPage.value < pageCount.value
  ) {
    currentPage.value++;
    getNotifications(true);
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/components/notifications";
</style>
