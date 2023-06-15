import { useAuthStore } from "@/js/stores/auth";
import { storeToRefs } from "pinia/dist/pinia";
const playAudioMixin = {
  setup() {
    const lose = new Audio("audios/lose.mp3");
    const skipped = new Audio("audios/skipped.mp3");
    const notification = new Audio("audios/notification.mp3");
    const achtung_short = new Audio("audios/achtung_short.mp3");
    const correct = new Audio("audios/correct.wav");
    const draw = new Audio("audios/draw.wav");
    const win = new Audio("audios/win.wav");
    const wrong = new Audio("audios/wrong.wav");

    const userStore = useAuthStore();
    const { user } = storeToRefs(userStore);
    const playAudio = name => {
      correct.play();
      eval(name + ".play()");
    };
    return {
      playAudio,
    };
  },
};

export default playAudioMixin;
