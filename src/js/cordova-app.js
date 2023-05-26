const cordovaApp = {
  f7: null,
  handleSplashScreen() {
    const f7 = cordovaApp.f7;
    if (!window.navigator.splashscreen || f7.device.electron) return;
    setTimeout(() => {
      window.navigator.splashscreen.hide();
    }, 2000);
  },
  handleAndroidBackButton() {
    const f7 = cordovaApp.f7;
    const $ = f7.$;
    const currentView = f7.views.current;
    currentView.router.allowPageChange = false;

    if (f7.device.electron) return;

    document.addEventListener(
      "backbutton",
      function (e) {
        const modals = document.querySelector(".framework7-modals").children;
        const currentView = f7.views.current;

        if (modals.length) {
          for (const modal of modals) {
            modal.remove();
          }

          e.preventDefault();
          return false;
        }

        if ($(".panel.panel-in").length) {
          f7.panel && f7.panel.close(".panel.panel-in");
          e.preventDefault();

          return false;
        }

        if (
          currentView &&
          currentView.router &&
          currentView.router.history.length > 1 &&
          (!modals.length || !$(".panel.panel-in").length)
        ) {
          currentView.router.allowPageChange = true;

          currentView.router.back();
          e.preventDefault();

          currentView.router.allowPageChange = false;

          return false;
        }

        navigator.app.exitApp();
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
