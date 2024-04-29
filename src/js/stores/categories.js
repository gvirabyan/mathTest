import { computed, ref } from "vue";
import { defineStore } from "pinia";
import api from "@/js/api";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref([]);
  const searchedCategories = ref([]);
  const lastCategoryData = ref(null);
  const pastCategoriesData = ref([]);

  const pastCategoriesIds = computed(() => pastCategoriesData.value.map(c => c.id));
  const loading = ref(false);

  const getCategories = async searchStr => {
    loading.value = true;
    if (searchStr && searchedCategories.value.length) {
      searchedCategories.value = [];
    }

    const url = searchStr
      ? `categories?populate[0]=category_class&filters[name][$containsi]=${searchStr}`
      : "categories?populate[0]=category_class";

    api.get(url).then(data => {
      loading.value = false;
      if (searchStr) {
        searchedCategories.value = data?.data;
        return;
      }

      categories.value = data?.data;
    });
  };

  const getCategoriesByCategoryClass = async (categoryID, isAdmin) => {
    categories.value = [];

    return api
      .get(
        `categories?populate[0]=category_class&filters[category_class][id][$eq]=${categoryID}&isAdmin=${isAdmin}&pagination[limit]=100`,
      )
      .then(data => {
        if (data.data) {
          categories.value = data.data;
        }
        return true;
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
    loading,
    getCategories,
    getCategoriesByCategoryClass,
    getLastCategory,
    getPastCategories,
    clearSearchedCategories,
  };
});
