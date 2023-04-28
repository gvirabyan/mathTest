import { computed, ref } from "vue";
import { defineStore } from "pinia";
import api from "@/js/api";
import { useCategoryAnswerStore } from "@/js/stores/category-answer";

export const useCategoryStore = defineStore("category", () => {
  const categoryAnswersStore = useCategoryAnswerStore();

  const categories = ref([]);
  const searchedCategories = ref([]);
  const category = ref(null);
  const lastCategoryData = ref(null);
  const pastCategoriesData = ref([]);

  const categoryData = computed(() => category.value);
  const pastCategoriesIds = computed(() => pastCategoriesData.value.map(c => c.id));

  const getCategories = async searchStr => {
    if (searchStr && searchedCategories.value.length) {
      searchedCategories.value = [];
    }

    const url = searchStr
      ? `categories?populate[0]=category_class&filters[name][$containsi]=${searchStr}`
      : "categories?populate[0]=category_class";

    api
      .get(url)
      .then(res => res.json())
      .then(data => {
        if (searchStr) {
          searchedCategories.value = data?.data;
          return;
        }

        categories.value = data?.data;
      });
  };

  const getCategoriesByCategoryClass = async categoryID => {
    categories.value = [];

    api
      .get(`categories?populate[0]=category_class&filters[category_class][id][$eq]=${categoryID}`)
      .then(res => res.json())
      .then(data => {
        categories.value = data.data;
      });
  };

  const getCategory = async categoryID => {
    api
      .get(`categories/${categoryID}?fields=name&populate=answer&populate=questions`)
      .then(res => res.json())
      .then(data => {
        category.value =
          {
            id: data?.data?.id,
            name: data?.data?.attributes?.name,
            questions_amount: data?.data?.attributes?.questions?.data?.length,
          } || [];
        categoryAnswersStore.categoryAnswers = data?.data?.attributes?.answer?.data?.attributes?.answers?.answers || [];
      });
  };

  const getLastCategory = async () => {
    api
      .get(`last-categories`)
      .then(res => res.json())
      .then(data => {
        lastCategoryData.value = data;
      });
  };

  const getPastCategories = async () => {
    api
      .get(`past-categories`)
      .then(res => res.json())
      .then(data => {
        pastCategoriesData.value = data;
      });
  };

  const clearSearchedCategories = () => {
    searchedCategories.value = [];
  };

  const clearCategory = () => {
    category.value = null;
  };

  return {
    categories,
    searchedCategories,
    lastCategoryData,
    pastCategoriesData,
    category,
    pastCategoriesIds,
    categoryData,
    getCategories,
    getCategoriesByCategoryClass,
    getCategory,
    getLastCategory,
    getPastCategories,
    clearSearchedCategories,
    clearCategory,
  };
});
