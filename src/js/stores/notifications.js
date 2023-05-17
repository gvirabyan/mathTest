import { computed, ref } from "vue";
import { defineStore } from "pinia";
import api from "@/js/api";

export const useNotifications = defineStore("notifications", () => {
  const notifications = ref([]);

  const hasUnreadNotifications = computed(() =>
    notifications.value.some(n => n?.attributes?.read === false || n?.read === false),
  );

  const getNotifications = async () => {
    return api
      .get(
        `notifications?filters[users_permissions_user][id][$eq]=${localStorage.getItem(
          "user-id",
        )}&sort[0]=read&sort[1]=createdAt:desc`,
      )
      .then(data => {
        notifications.value = data?.data;
      });
  };

  const readNotification = async id => {
    return api
      .put(`notifications/${id}`, { data: { read: true } })
      .then(res => res.json())
      .then(data => {
        notifications.value = notifications.value.map(n => (n.id === id ? data?.data : n));
      });
  };

  const addNotification = notification => {
    notifications.value.push(notification);
  };

  return {
    notifications,
    hasUnreadNotifications,
    getNotifications,
    readNotification,
    addNotification,
  };
});
