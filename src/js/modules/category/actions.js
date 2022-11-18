import api from "../../api";

export default {
  getCategories({ state }) {
    api.get('categories').then(res => res.json()).then(data => {
      state.categories = data.data;
    })

    // fetch('http://localhost:1337/api/categories?populate[0]=questions&populate[questions][fields][0]=question').then(res => res.json()).then(data => {
    //   // state.categories = data?.data?.attributes.forEach();
    //   const categories = [];
    //   data?.data.forEach(category => {
    //     categories.push({
    //       id: category.id,
    //       name: category.attributes.name,
    //       questionsCount: category.attributes.questions.data.length,
    //     })
    //   })
    //
    //   state.categories = categories
    // })
  },
  getCategory({ state }, categoryID) {
    api.get(`categories/${categoryID}?fields=name&populate=answer`).then(res => res.json()).then(data => {
      state.category = { id: data?.data?.id, name: data?.data?.attributes?.name } || [];
      state.categoryAnswers = data?.data?.attributes?.answer?.data?.attributes?.answers?.answers || [];
    })
  },
}