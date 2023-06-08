const playAudioMixin = {
  setup() {
    const playAudio = name => {
      const audio = new Audio(
        `assets/audios/${name}.${["lose", "skipped", "notification"].includes(name) ? "mp3" : "wav"}`,
      );
      console.log(audio, 111);
      audio.play();
    };
    return {
      playAudio,
    };
  },
};

export default playAudioMixin;
