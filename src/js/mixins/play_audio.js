const playAudioMixin = {
  setup() {
    const playAudio = name => {
      const audio = new Audio();
      audio.src = `audios/${name}.${["lose", "skipped", "notification"].includes(name) ? "mp3" : "wav"}`;
      audio.load();
      audio
        .play()
        .then(function (r) {
          // Automatic playback started!
          console.log(r, 11);
        })
        .catch(function (error) {
          console.log(error, 14);
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
