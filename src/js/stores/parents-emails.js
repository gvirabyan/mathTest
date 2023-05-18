import { ref } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
import api from "@/js/api";

export const useParentsEmailsStore = defineStore("parents-emails", () => {
  const authStore = useAuthStore();

  const parentsEmails = ref([]);

  const getParentsEmails = () => {
    return api
      .get(
        `parents-emails?populate[0]=users_permissions_users&filters[users_permissions_users][id]=${authStore.user.id}`,
      )
      .then(data => {
        if (!data.error) {
          parentsEmails.value = data?.data.map(e => ({ id: e.id, ...e.attributes }));

          return { status: "success" };
        } else {
          return { status: "error", message: data.error?.message };
        }
      });
  };

  const saveParentsEmails = emails => {
    return api
      .post(`saveMultipleParentsEmails`, { data: { emails } })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          parentsEmails.value = [...parentsEmails.value, ...data?.data];

          return { status: "success" };
        } else {
          return { status: "error", message: data.error?.message };
        }
      });
  };

  const removeParentEmail = id => {
    return api
      .remove(`parents-emails/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          parentsEmails.value = parentsEmails.value.filter(e => e.id !== id);

          return { status: "success" };
        } else {
          return { status: "error", message: data.error?.message };
        }
      });
  };

  return {
    parentsEmails,
    getParentsEmails,
    saveParentsEmails,
    removeParentEmail,
  };
});
