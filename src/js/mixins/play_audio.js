import { useAuthStore } from "@/js/stores/auth";
import { storeToRefs } from "pinia/dist/pinia";
const playAudioMixin = {
  setup() {
    const userStore = useAuthStore();
    const { user } = storeToRefs(userStore);
    const playAudio = name => {
      if (user.value.sound) {
        const audio = new Audio();
        audio.src = `audios/${name}.${
          ["lose", "skipped", "notification", "achtung_short"].includes(name) ? "mp3" : "wav"
        }`;
        audio.play();
      }
    };
    return {
      playAudio,
    };
  },
};

export default playAudioMixin;
