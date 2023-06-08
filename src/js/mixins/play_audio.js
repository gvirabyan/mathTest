const playAudioMixin = {
  setup() {
    const playAudio = name => {
      const audio = new Audio();
      audio.src = `audios/${name}.${["lose", "skipped", "notification"].includes(name) ? "mp3" : "wav"}`;
      audio.load();
      audio.play();
    };
    return {
      playAudio,
    };
  },
};

export default playAudioMixin;
