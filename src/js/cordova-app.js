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

        if (f7.panel) {
          f7.panel.close(".panel");
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

    if (import.meta.env.TARGET === "cordova") {
      // eslint-disable-next-line no-undef
      WonderPush.subscribeToNotifications();
    }
  },
};

export default cordovaApp;
