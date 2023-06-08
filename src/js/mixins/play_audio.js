const playAudioMixin = {
  setup() {
    const playAudio = async name => {
      const audio = new Audio(
        `assets/audios/${name}.${["lose", "skipped", "notification"].includes(name) ? "mp3" : "wav"}`,
      );
      return await audio.play().then(r => r);
    };
    return {
      playAudio,
    };
  },
};

export default playAudioMixin;
