import { reactive } from "vue";
import { defineStore } from "pinia";
import api from "@/js/api";

export const useUserStats = defineStore("user-stats", () => {
  const answersStats = reactive({
    questions_count: null,
    questions_left_count: null,
    answers_count: null,
    topic_answers: {
      count: null,
      percent: null,
    },
    correct_answers: {
      count: null,
      percent: null,
    },
    wrong_answers: {
      count: null,
      percent: null,
    },
    skipped_answers: {
      count: null,
      percent: null,
    },
    last_update: null,
  });

  const userStatus = reactive({
    last_quiz: null,
    last_update: null,
    points: null,
    time_in_app: null,
    past_categories_count: null,
    categories_count: null,
    past_categories_percent: null,
    daily_statics: null,
  });

  const getUserStatus = async () => {
    return new Promise((resolve, reject) => {
      api
        .get("get-user-status")
        .then(data => {
          if (data.error) {
            reject("error");
            return;
          }
          if (data.time_in_app !== undefined) {
            userStatus.last_quiz = data.last_quiz;
            userStatus.last_update = data.last_update;
            userStatus.points = data.points;
            userStatus.time_in_app = data.time_in_app;
            userStatus.past_categories_count = data.past_categories_count;
            userStatus.categories_count = data.categories_count;
            userStatus.past_categories_percent = data.past_categories_percent;
            userStatus.daily_statics = data.daily_statics;
          }
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const getAnswersStats = async () => {
    return api.get("get-answers-stats").then(data => {
      answersStats.questions_count = data.questions_count;
      answersStats.questions_left_count = data.questions_left_count;
      answersStats.answers_count = data.answers_count;
      answersStats.topic_answers.count = data.topic_answers.count;
      answersStats.topic_answers.percent = data.topic_answers.percent;
      answersStats.correct_answers.count = data.correct_answers.count;
      answersStats.correct_answers.percent = data.correct_answers.percent;
      answersStats.wrong_answers.count = data.wrong_answers.count;
      answersStats.wrong_answers.percent = data.wrong_answers.percent;
      answersStats.skipped_answers.count = data.skipped_answers.count;
      answersStats.skipped_answers.percent = data.skipped_answers.percent;
      answersStats.last_update = data.last_update;
    });
  };

  return {
    userStatus,
    answersStats,
    getUserStatus,
    getAnswersStats,
  };
});
