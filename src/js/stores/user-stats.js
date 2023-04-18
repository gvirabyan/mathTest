import { reactive } from "vue";
import { defineStore } from "pinia";
import api from "@/js/api";

export const useUserStats = defineStore("user-stats", () => {
  const answersStats = reactive({
    questions_count: null,
    questions_left_count: null,
    answers_count: null,
    correct_answers: null,
    wrong_answers: null,
    skipped_answers: null,
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
  });

  const getUserStatus = async () => {
    return api
      .get("get-user-status")
      .then(res => res.json())
      .then(data => {
        userStatus.last_quiz = data.last_quiz;
        userStatus.last_update = data.last_update;
        userStatus.points = data.points;
        userStatus.time_in_app = data.time_in_app;
        userStatus.past_categories_count = data.past_categories_count;
        userStatus.categories_count = data.categories_count;
        userStatus.past_categories_percent = data.past_categories_percent;
      });
  };

  const getAnswersStats = async () => {
    return api
      .get("get-answers-stats")
      .then(res => res.json())
      .then(data => {
        answersStats.questions_count = data.questions_count;
        answersStats.questions_left_count = data.questions_left_count;
        answersStats.answers_count = data.answers_count;
        answersStats.correct_answers = data.correct_answers;
        answersStats.wrong_answers = data.wrong_answers;
        answersStats.skipped_answers = data.skipped_answers;
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
