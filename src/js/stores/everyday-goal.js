import { reactive, watch } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
import { useNotifications } from "@/js/stores/notifications";
import api from "@/js/api";

export const useEverydayGoalStore = defineStore("everyday-goal", () => {
  const auth = useAuthStore();
  const notifications = useNotifications();

  const everydayGoal = reactive(
    localStorage.getItem("everydayGoal")
      ? JSON.parse(localStorage.getItem("everydayGoal"))
      : { questionsToGoal: auth.user?.everyday_goal, isPassed: false, passingDatetime: null },
  );

  const setEverydayGoal = questions => {
    everydayGoal.questionsToGoal = questions;
  };

  const decreaseQuestionsToGoal = status => {
    if (everydayGoal.questionsToGoal === 0) return;

    if (status !== "correct") return;

    everydayGoal.questionsToGoal -= 1;
  };

  const sendEverydayGoalReach = async () => {
    // eslint-disable-next-line no-undef
    WonderPush.getInstallationId(function (installationId) {
      return api.post("everyday-goal-notify", { installationId }).then(data => notifications.addNotification(data));
    });
  };

  const restartEverydayGoal = () => {
    everydayGoal.questionsToGoal = auth.user?.everyday_goal;
    everydayGoal.isPassed = false;
    everydayGoal.passingDatetime = null;
  };

  watch(
    () => everydayGoal.questionsToGoal,
    async val => {
      localStorage.setItem("everydayGoal", JSON.stringify({ ...everydayGoal, questionsToGoal: val }));

      if (val === 0) {
        everydayGoal.isPassed = true;
        everydayGoal.passingDatetime = new Date().toISOString();

        localStorage.setItem("everydayGoal", JSON.stringify(everydayGoal));

        await sendEverydayGoalReach();
      }
    },
  );

  return {
    everydayGoal,
    setEverydayGoal,
    decreaseQuestionsToGoal,
    sendEverydayGoalReach,
    restartEverydayGoal,
  };
});
