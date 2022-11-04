<template>
  <f7-page name="category">
    <f7-navbar :title="category.name" back-link="Back"></f7-navbar>
    <f7-block-title>{{ questions[questionIndex]?.attributes?.question }}</f7-block-title>
    <f7-block-header>What will be the result of this mathematical operation ?</f7-block-header>
    <f7-list>
      <f7-list-item v-for="(answer, index) in questionAnswers"
                    :title="answer"
                    radio-icon="end"
                    name="demo-radio-end"
                    radio
      ></f7-list-item>
    </f7-list>

    <f7-list>
      {{questions.length ? questions[questionIndex] : 'zz'}}
      <f7-list-item v-for="question in questions"
                    :link="`/categories/${f7route.params.categoryID}/questions/${question.id}`"
                    :title="question.attributes.question"
      ></f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
import store from "../js/store";
import {useStore} from "framework7-vue";

export default {
  name: "Category",
  props: {
    f7route: Object,
  },
  setup() {
    const category = useStore('category');
    const questions = useStore('questions');
    const questionIndex = useStore('questionIndex');
    const questionAnswers = useStore('getAnswers');

    return {
      category,
      questions,
      questionIndex,
      questionAnswers
    }
  },
  data() {
    return {}
  },
  mounted() {
    store.dispatch('getCategory', this.f7route.params.categoryID);
  }
}
</script>