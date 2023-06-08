const playAudioMixin = {
  setup() {
    const playAudio = name => {
      const audio = new Audio();
      console.log(audio, 111);
      audio.src = `src/assets/audios/${name}.${["lose", "skipped", "notification"].includes(name) ? "mp3" : "wav"}`;
      audio.load();
      audio
        .play()
        .then(function (r) {
          // Automatic playback started!
          console.log(r, 12);
        })
        .catch(function (error) {
          console.log(error, 12);
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
