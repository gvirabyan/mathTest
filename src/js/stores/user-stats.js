import { defineStore } from "pinia";
import { reactive } from "vue";
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
    answersStats,
    getAnswersStats,
  };
});
