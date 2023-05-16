import { computed, ref } from "vue";
import { defineStore } from "pinia";
import api from "@/js/api";
import { useCategoryAnswerStore } from "@/js/stores/category-answer";

export const useCategoryStore = defineStore("category", () => {
  const categoryAnswersStore = useCategoryAnswerStore();

  const categories = ref([]);
  const searchedCategories = ref([]);
  const lastCategoryData = ref(null);
  const pastCategoriesData = ref([]);

  const pastCategoriesIds = computed(() => pastCategoriesData.value.map(c => c.id));

  const getCategories = async searchStr => {
    if (searchStr && searchedCategories.value.length) {
      searchedCategories.value = [];
    }

    const url = searchStr
      ? `categories?populate[0]=category_class&filters[name][$containsi]=${searchStr}`
      : "categories?populate[0]=category_class";

    api.get(url).then(data => {
      if (searchStr) {
        searchedCategories.value = data?.data;
        return;
      }

      categories.value = data?.data;
    });
  };

  const getCategoriesByCategoryClass = async categoryID => {
    categories.value = [];

    api.get(`categories?populate[0]=category_class&filters[category_class][id][$eq]=${categoryID}`).then(data => {
      categories.value = data.data.map(c => {
        c.classId = categoryID;
        return c;
      });
    });
  };

  const getLastCategory = async () => {
    api.get(`last-categories`).then(data => {
      lastCategoryData.value = data;
    });
  };

  const getPastCategories = async () => {
    api.get(`past-categories`).then(data => {
      pastCategoriesData.value = data;
    });
  };

  const clearSearchedCategories = () => {
    searchedCategories.value = [];
  };

  return {
    categories,
    searchedCategories,
    lastCategoryData,
    pastCategoriesData,
    pastCategoriesIds,
    getCategories,
    getCategoriesByCategoryClass,
    getLastCategory,
    getPastCategories,
    clearSearchedCategories,
  };
});
