import { reactive } from "vue";
import { defineStore } from "pinia";
import api from "@/js/api";

export const useUserStats = defineStore("userStats", () => {
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
    last_quiz: {
      name: null,
      questions: null,
      answers: null,
    },
    last_update: null,
    points: null,
    time_in_app: null,
  });

  const getUserStatus = async () => {
    return api
      .get("get-user-status")
      .then(res => res.json())
      .then(data => {
        userStatus.last_quiz.name = data.last_quiz.name;
        userStatus.last_quiz.questions = data.last_quiz.questions;
        userStatus.last_quiz.answers = data.last_quiz.answers;
        userStatus.last_update = data.last_update;
        userStatus.points = data.points;
        userStatus.time_in_app = data.time_in_app;
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
