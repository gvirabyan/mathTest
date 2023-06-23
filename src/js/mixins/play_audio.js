import { useAuthStore } from "@/js/stores/auth";
import { storeToRefs } from "pinia/dist/pinia";
const playAudioMixin = {
  setup() {
    const lose = new Audio("audios/lose.mp3");
    lose.pause();
    const skipped = new Audio("audios/skipped.mp3");
    skipped.pause();
    const notification = new Audio("audios/notification.mp3");
    notification.pause();
    const achtung_short = new Audio("audios/achtung_short.mp3");
    achtung_short.pause();
    const correct = new Audio("audios/correct.wav");
    correct.pause();
    const draw = new Audio("audios/draw.wav");
    draw.pause();
    const win = new Audio("audios/win.wav");
    win.pause();
    const wrong = new Audio("audios/wrong.wav");
    wrong.pause();
    const tabChange = new Audio("audios/tabChange.wav");
    tabChange.pause();
    const formSubmit = new Audio("audios/formSubmit.wav");
    formSubmit.pause();
    const goalUpdate = new Audio("audios/goalUpdate.mp3");
    goalUpdate.pause();
    const notificationOpen = new Audio("audios/notificationOpen.mp3");
    notificationOpen.pause();

    const userStore = useAuthStore();
    const { user } = storeToRefs(userStore);
    const playAudio = name => {
      if (eval(name) && user.value && user.value.sound) {
        eval(name + `.volume = ${Number(user.value.volume_sound) / 100}`);
        eval(name + ".play()");
      } else if (eval(name) && !user.value) {
        eval(name + ".play()");
      }
    };
    return {
      correct,
      tabChange,
      playAudio,
    };
  },
};

export default playAudioMixin;
