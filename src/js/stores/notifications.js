import { computed, ref } from "vue";
import { defineStore } from "pinia";
import api from "@/js/api";

export const useNotifications = defineStore("notifications", () => {
  const notifications = ref([]);
  const currentPage = ref(1);
  const pageCount = ref(0);
  const querySending = ref(false);

  const hasUnreadNotifications = computed(() =>
    notifications.value.some(n => n?.attributes?.read === false || n?.read === false),
  );

  const getNotifications = async (pagination = false) => {
    if (!pagination) {
      currentPage.value = 1;
    }
    querySending.value = true;
    return api
      .get(
        `notifications?filters[users_permissions_user][id][$eq]=${localStorage.getItem("user-id")}&pagination[page]=${
          currentPage.value
        }&sort[0]=read&sort[1]=createdAt:desc`,
      )
      .then(data => {
        if (data.meta) {
          pageCount.value = data.meta.pagination.pageCount;
          notifications.value = pagination ? [...notifications.value, ...data?.data] || [] : data?.data || [];
          querySending.value = false;
        }
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
    currentPage,
    pageCount,
    querySending,
    hasUnreadNotifications,
    getNotifications,
    readNotification,
    addNotification,
  };
});
