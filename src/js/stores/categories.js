import { computed, ref } from "vue";
import { defineStore } from "pinia";
import api from "@/js/api";
import { useAuthStore } from "@/js/stores/auth";
import { useCategoryAnswerStore } from "@/js/stores/category-answer";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref([]);
  const category = ref({});
  const lastCategoryData = ref(null);
  const pastCategoriesData = ref([]);

  const authStore = useAuthStore();
  const categoryAnswersStore = useCategoryAnswerStore();

  const categoriesData = computed(() => {
    return categories.value.map(c => {
      const questionsArr = c.attributes.questions.data;

      const userAnswersArr = questionsArr
        .map(q => {
          if (!q.attributes.user_answers.data.length) {
            return [];
          }

          return q.attributes.user_answers.data.filter(
            d => d.attributes.users_permissions_user.data?.id === authStore.user?.id,
          );
        })
        .flat();

      return {
        ...c,
        questions_amount: questionsArr.length,
        user_answers_amount: userAnswersArr.length > questionsArr.length ? questionsArr.length : userAnswersArr.length,
      };
    });
  });
  const categoryData = computed(() => category.value);

  const getCategories = async () => {
    api
      .get(
        "categories?populate[0]=questions&populate[1]=questions.user_answers&populate[2]=questions.user_answers.users_permissions_user",
      )
      .then(res => res.json())
      .then(data => {
        categories.value = data.data;
      });
  };

  const getCategoriesByCategoryClass = async categoryID => {
    categories.value = [];

    api
      .get(
        `categories?populate[0]=questions&populate[1]=questions.user_answers&populate[2]=questions.user_answers.users_permissions_user&populate[3]=category_class&filters[category_class][id][$eq]=${categoryID}`,
      )
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

  return {
    categories,
    lastCategoryData,
    pastCategoriesData,
    category,
    categoriesData,
    categoryData,
    getCategories,
    getCategoriesByCategoryClass,
    getCategory,
    getLastCategory,
    getPastCategories,
  };
});
