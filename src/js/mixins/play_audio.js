const playAudioMixin = {
  setup() {
    const playAudio = name => {
      alert(4);
      const audio = new Audio(
        `@/assets/audios/${name}.${["lose", "skipped", "notification"].includes(name) ? "mp3" : "wav"}`,
      );
      console.log(audio, 111);
      audio
        .play()
        .then(function () {
          // Automatic playback started!
        })
        .catch(function (error) {
          // Automatic playback failed.
          // Show a UI element to let the user manually start playback.
        });
    };
    return {
      playAudio,
    };
  },
};

export default playAudioMixin;
