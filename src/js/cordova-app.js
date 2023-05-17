const cordovaApp = {
  f7: null,
  handleSplashScreen() {
    const f7 = this.f7;
    if (!window.navigator.splashscreen || f7.device.electron) return;
    setTimeout(() => {
      window.navigator.splashscreen.hide();
    }, 2000);
  },
  handleAndroidBackButton() {
    const f7 = this.f7;
    // const $ = f7.$;
    if (f7.device.electron) return;

    document.addEventListener(
      "backbutton",
      function (e) {
        const currentView = f7.views.current;
        const panel = f7.panel.get(".panel-right");

        if (panel && panel.opened) {
          panel.close();
          return;
        }

        if (currentView && currentView.router && currentView.router.history.length > 1) {
          currentView.router.back();
          e.preventDefault();
          return false;
        }
      },
      false,
    );
  },
  init(f7) {
    // Save f7 instance
    cordovaApp.f7 = f7;

    // Handle Android back button
    cordovaApp.handleAndroidBackButton();

    // Handle Splash Screen
    cordovaApp.handleSplashScreen();

    if (window.cordova) {
      // eslint-disable-next-line no-undef
      WonderPush.subscribeToNotifications();

      // Start Clarify
      const success = message => {
        console.log(message);
      };
      const failure = message => {
        console.log(message);
      };

      // eslint-disable-next-line no-undef
      ClarityPlugin.initialize(import.meta.env.VITE_CLARITY_APP_ID, success, failure);
    }
  },
};

export default cordovaApp;
