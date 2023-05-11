import { ref } from "vue";
import { defineStore } from "pinia";
import api from "@/js/api";

export const useCategoryClassesStore = defineStore("category-classes", () => {
  const categoryClasses = ref([]);
  const selectedClass = ref(1);

  const getCategoryClasses = async () => {
    return api
      .get("category-classes?populate[0]=category")
      .then(res => res.json())
      .then(data => {
        categoryClasses.value = data?.data;
      });
  };

  return {
    categoryClasses,
    getCategoryClasses,
    selectedClass,
  };
});
