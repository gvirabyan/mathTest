<template>
  <div class="notifications">
    <h2 class="title">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16.4997 8.25C16.4997 9.77778 16.4997 11.3056 16.4997 12.8333C16.4997 14.6667 17.1108 15.8889 18.333 16.5H3.66634C4.88856 15.8889 5.49968 14.6667 5.49968 12.8333C5.49968 11.3056 5.49968 9.77778 5.49968 8.25C5.49968 5.21243 7.96211 2.75 10.9997 2.75C14.0372 2.75 16.4997 5.21243 16.4997 8.25Z"
          stroke="#8419FF"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M9.16634 17.4165C9.16634 18.429 9.98715 19.2498 10.9997 19.2498C12.0122 19.2498 12.833 18.429 12.833 17.4165"
          stroke="#8419FF"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      Notifications
    </h2>

    <f7-list v-if="!isLoading && notifications.length" class="notifications-list">
      <f7-list-item v-for="item in notifications" :key="item.id">
        <h3 class="item-title">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="5" cy="5" r="5" fill="#FFC700" />
          </svg>

          {{ item.attributes.title }}
        </h3>
        <p class="item-text">{{ item.attributes.text }}</p>
      </f7-list-item>
    </f7-list>

    <f7-block v-else-if="!notifications.length" class="no-padding">
      <p>There are no notifications yet</p>
    </f7-block>

    <loading-small v-else />

    <f7-block class="welcome-block">
      <h3 class="title">Welcome to the MatheApp</h3>
      <p class="text">Play more games, improve your skills & the first in the World!</p>
    </f7-block>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useNotifications } from "@/js/stores/notifications";
import delay from "@/js/helpers/delay";
import LoadingSmall from "@/components/loading-small.vue";

const { notifications } = storeToRefs(useNotifications());
const { getNotifications, readNotifications } = useNotifications();

const isLoading = ref(false);

const getNotificationsHandler = async () => {
  isLoading.value = true;

  await delay(500);
  await getNotifications();

  isLoading.value = false;
};

onMounted(() => {
  readNotifications();
});

getNotificationsHandler();
</script>

<style lang="scss">
@import "@/assets/scss/components/notifications";
</style>
