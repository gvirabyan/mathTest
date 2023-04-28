import { ref } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
import api from "@/js/api";

export const useNotifications = defineStore("notifications", () => {
  const auth = useAuthStore();
  const notifications = ref([]);
  const hasNewNotifications = ref(false);

  const getNotifications = async () => {
    return api
      .get(`notifications?filters[users_permissions_user][id][$eq]=${auth.user.id}`)
      .then(res => res.json())
      .then(data => {
        notifications.value = data?.data;
      });
  };

  const addNotification = notification => {
    notifications.value.push(notification);
  };

  const readNotifications = () => {
    hasNewNotifications.value = false;
  };

  return {
    notifications,
    hasNewNotifications,
    getNotifications,
    addNotification,
    readNotifications,
  };
});
