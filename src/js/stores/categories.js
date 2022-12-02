import {computed, ref} from 'vue';
import {defineStore} from 'pinia';
import api from '@/js/api';
import {useAuthStore} from '@/js/stores/auth';
import {useCategoryAnswerStore} from '@/js/stores/category-answer';

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([]);
  const category = ref(null);

  const authStore = useAuthStore();
  const categoryAnswersStore = useCategoryAnswerStore();

  const categoriesData = computed(() => {
    return categories.value.map(c => {
      const questionsArr = c.attributes.questions.data
      const userAnswersArr = questionsArr.map(
        q => q.attributes.user_answers.data.filter(d => d.attributes.users_permissions_user.data?.id === authStore.userData.id)
      ).flat();

      return {
        ...c,
        questions_amount: questionsArr.length,
        user_answers_amount: userAnswersArr.length
      }
    })
  });
  const categoryData = computed(() => category.value);

  const getCategories = async () => {
    api.get('categories?populate[0]=questions&populate[1]=questions.user_answers&populate[2]=questions.user_answers.users_permissions_user')
      .then(res => res.json())
      .then(data => {
      categories.value = data.data;
    })
  };

  const getCategory = async (categoryID) => {
    api.get(`categories/${categoryID}?fields=name&populate=answer`).then(res => res.json()).then(data => {
      category.value = { id: data?.data?.id, name: data?.data?.attributes?.name } || [];
      categoryAnswersStore.categoryAnswers = data?.data?.attributes?.answer?.data?.attributes?.answers?.answers || [];
    })
  };

  return {
    categories,
    category,
    categoriesData,
    categoryData,
    getCategories,
    getCategory
  }
});
