import {computed, ref} from 'vue';
import {defineStore} from 'pinia';
import api from '@/js/api';

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([]);
  const category = ref(null);
  const categoryAnswers = ref(null);

  const categoriesData = computed(() => categories.value);
  const categoryData = computed(() => category.value);

  const getCategories = async () => {
    api.get('categories').then(res => res.json()).then(data => {
      categories.value = data.data;
    })
  };

  const getCategory = async (categoryID) => {
    api.get(`categories/${categoryID}?fields=name&populate=answer`).then(res => res.json()).then(data => {
      category.value = { id: data?.data?.id, name: data?.data?.attributes?.name } || [];
      categoryAnswers.value = data?.data?.attributes?.answer?.data?.attributes?.answers?.answers || [];
    })
  };

  return {
    categories,
    category,
    categoryAnswers,
    categoriesData,
    categoryData,
    getCategories,
    getCategory
  }
});
