<template>
  <f7-page class="hg-question-page" name="question">
    <f7-navbar :title="category.name" back-link="Back"></f7-navbar>
    <div v-if="question">
      <f7-block-title>{{ question.attributes?.question }}</f7-block-title>
      <f7-block-header>What will be the result of this mathematical operation ?</f7-block-header>

      <f7-list>
        <f7-list-item v-for="(answer, index) in questionAnswers"
                      :class="{
                        'hg-wrong-answer': chosenAnswer && chosenAnswerIndex === index && question.attributes?.answer !== answer,
                        'hg-correct-answer': chosenAnswer && question.attributes?.answer === answer
                      }"
                      :disabled="!!chosenAnswer"
                      :title="answer"
                      radio-icon="end"
                      name="demo-radio-end"
                      @change="chooseAnswer(answer, index)"
                      radio
        ></f7-list-item>
      </f7-list>

      <div class="hg-actions-btns-content">
        <button v-if="!chosenAnswer"
                class="button button-outline hg-default-btn-width"
                @click="skip"
        >Skip</button>

        <button v-else
                class="button button-fill hg-default-btn-width"
                @click="next"
        >Next</button>
      </div>
    </div>
  </f7-page>
</template>

<script>
import store from "../js/store";
import {useStore} from "framework7-vue";

export default {
  name: "Question",
  props: {
    f7route: Object,
  },
  setup() {
    const user = useStore('user');
    const category = useStore('category');
    const question = useStore('question');
    const questionAnswers = useStore('getAnswers');

    return {
      user,
      category,
      question,
      questionAnswers
    }
  },
  data() {
    return {
      chosenAnswer: false,
      chosenAnswerIndex: false
    }
  },
  mounted() {
    store.dispatch('getCategory', this.f7route.params.categoryID);
    store.dispatch('getQuestions', this.f7route.params.categoryID);
  },
  methods: {
    chooseAnswer(answer, index) {
      this.chosenAnswer = answer;
      this.chosenAnswerIndex = index;

      store.dispatch('updateUserAnsweredQuestions', {
        users_permissions_user: this.user.id,
        question: this.question.id,
        answer: answer,
        status: this.question.attributes.answer === answer ? 'correct' : 'wrong'
      }).then(resp => {
        if (resp.status !== 'success') {
          this.clearChosenData();
          console.error(resp.message);
        }
      });
    },
    skip() {
      store.dispatch('updateUserAnsweredQuestions', {
        users_permissions_user: this.user.id,
        question: this.question.id,
        answer: '',
        status: 'skipped'
      }).then(resp => {
        if (resp.status === 'success') {
          this.next();
        } else {
          console.error(resp.message);
        }
      });
    },
    next() {
      this.clearChosenData();
      store.dispatch('getNextQuestion')
    },
    clearChosenData() {
      this.chosenAnswer = false;
      this.chosenAnswerIndex = false;
    }
  }
}
</script>

<style lang="scss">
.hg-question-page {
  .hg-wrong-answer {
    border: 1px solid red;
  }
  .hg-correct-answer {
    border: 1px solid green;
  }
  .hg-actions-btns-content {
    display: flex;
    justify-content: center;
  }

  .ios label.item-radio:not(.item-radio-icon-start) input[type='radio'] ~ .icon-radio {
    display: none;
  }
}

.hg-default-btn-width {
  width: 100px;
}
</style>