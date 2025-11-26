/* eslint-env browser */

// Detect whether we are running under Cordova
const isCordova = typeof window !== "undefined" && !!window.cordova;

let interstitial = null;

/**
 * One‑time AdMob boot‑strap. Call this exactly once from your app bootstrap
 * (e.g. in app.js) **before** you mount Vue.
 */
export function admobInitInterstitial() {
  if (!isCordova || typeof admob === "undefined") {
    console.info("[AdMob] Cordova not detected – skipping AdMob init.");
    return; // No‑op for the web build
  }

  // Defer all SDK calls until Cordova is ready
  document.addEventListener(
    "deviceready",
    async () => {
      try {
        interstitial = createInterstitial();
        await interstitial.load();
      } catch (err) {
        console.error("[AdMob] init error", err);
      }
    },
    { once: true },
  );
}

/**
 * Create a new interstitial ad instance.
 */
function createInterstitial() {
  const adUnitId =
    window.cordova.platformId === "android"
      ? "ca-app-pub-4463307428680168/4381275310"
      : "ca-app-pub-4463307428680168/5694356980";

  const ad = new admob.InterstitialAd({
    adUnitId,
  });

  ad.on("load", () => console.log("[AdMob] Interstitial loaded"));
  ad.on("dismiss", () => ad.load());
  ad.on("loadfail", e => console.warn("[AdMob] Load fail", e));
  ad.on("showfail", e => console.warn("[AdMob] Show fail", e));

  return ad;
}

/**
 * Show the interstitial ad if it is ready; otherwise fail gracefully.
 */
export async function showInterstitial() {
  if (!interstitial) {
    console.info("[AdMob] Interstitial not initialised or running on web.");
    return;
  }

  if (await interstitial.isLoaded()) {
    await interstitial.show();
  } else {
    console.info("[AdMob] Interstitial not ready – try again soon.");
  }
}
