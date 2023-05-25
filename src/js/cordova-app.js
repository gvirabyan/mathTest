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
    if (f7.device.electron) return;

    document.addEventListener(
      "backbutton",
      function (e) {
        const modals = document.querySelector(".framework7-modals").children;
        const panelRightEl = document.querySelector(".notifications-panel");
        const panelRight = f7.panel ? f7.panel.get(panelRightEl) : null;
        const currentView = f7.views.current;

        if (modals.length) {
          e.preventDefault();

          for (const modal of modals) {
            e.preventDefault();
            modal.remove();
          }

          return false;
        } else if (
          f7.panel &&
          panelRight &&
          Object.prototype.hasOwnProperty.call(panelRight, "opened") &&
          panelRight.opened
        ) {
          e.preventDefault();

          panelRight.close(panelRightEl);
          panelRight.on("close", function () {
            e.preventDefault();
            return false;
          });

          return false;
        } else if (currentView && currentView.router && currentView.router.history.length > 1) {
          e.preventDefault();
          currentView.router.back();
          return false;
        } else {
          navigator.app.exitApp();
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
