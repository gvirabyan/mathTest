import Dom7 from "dom7";

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
    const $$ = Dom7;
    const currentView = f7.views.current;
    currentView.router.allowPageChange = false;

    if (f7.device.electron || f7.device.ios) return;

    document.addEventListener(
      "backbutton",
      function (e) {
        // const modals = $$(".framework7-modals").children();
        // const panels = $$(".panel.panel-in");
        const currentView = f7.views.current;

        // if (modals.length) {
        //   modals.each(modal => modal.remove());
        //
        //   e.preventDefault();
        //   return false;
        // }

        // if (panels.length) {
        //   panels.each(() => {
        //     f7.panel && f7.panel.close(".panel.panel-in");
        //     e.preventDefault();
        //   });
        //
        //   e.preventDefault();
        //   return false;
        // }

        if (currentView && currentView.router && currentView.router.history.length > 1) {
          $$(".popup-backdrop.backdrop-in").remove();
          currentView.router.back();
          e.preventDefault();

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
      document.addEventListener("deviceready", () => {
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
        // Set custom tag for the current session.
        // eslint-disable-next-line no-undef
        ClarityPlugin.setCustomTag("userID", localStorage.getItem("user-id"), success, failure);
        // Set custom user id.
        // eslint-disable-next-line no-undef
        ClarityPlugin.setCustomUserId(localStorage.getItem("user-id"), success, failure);
        // alert(3);
        var onSuccess = function (strSuccess) {
          console.log(strSuccess);
        };
        var onFailure = function (strError) {
          console.warn(strError);
        };
        // eslint-disable-next-line no-undef
        cordova.plugins.InAppUpdate.getUpdateAvailability(onSuccess, onFailure);
      });
    }
  },
};

export default cordovaApp;
