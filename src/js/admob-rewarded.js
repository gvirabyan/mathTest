/* eslint-env browser */

// Detect whether we are running under Cordova
const isCordova = typeof window !== "undefined" && !!window.cordova;

let rewarded = null;
// Key used in localStorage
const ADD_STORAGE_KEY = "lastAddAt";
/**
 * One‑time AdMob boot‑strap. Call this exactly once from your app bootstrap
 * (e.g. in app.js) **before** you mount Vue.
 */
export function admobInitRewarded() {
  if (!isCordova || typeof admob === "undefined") {
    console.info("[AdMob] Cordova not detected – skipping AdMob init.");
    return; // No‑op for the web build
  }

  // Defer all SDK calls until Cordova is ready
  document.addEventListener(
    "deviceready",
    async () => {
      try {
        // Mark this handset as a test device → test creatives only
        admob.configure({
          testDeviceIds: ["EMULATOR", "33BE2250B43518CCDA7DE426D04EE231"],
        });

        // MUST be called once per launch (after GDPR/ATT consent, if any)
        await admob.start();

        rewarded = createRewarded();

        // Pre‑load the first video so UI can show instantly later
        await rewarded.load();
      } catch (err) {
        console.error("[AdMob] init error", err);
      }
    },
    { once: true },
  );
}

/**
 * Create a new rewarded‑video instance.
 * Re‑instantiate or call load() after every dismissal.
 */
function createRewarded() {
  const ad = new admob.RewardedAd({
    // Use Vite env for easy swap; falls back to Google test unit.
    adUnitId: import.meta.env.VITE_AD_UNIT_REWARDED,
    // If user opts‑out of personalised ads via GDPR:
    // extras: { npa: '1' },
  });

  // Event wiring ------------------------------------------------------
  ad.on("load", () => console.log("[AdMob] Rewarded loaded"));
  ad.on("show", () => console.log("[AdMob] Rewarded shown"));
  ad.on("dismiss", () => ad.load()); // Auto‑preload next video
  ad.on("reward", e => giveHearts(e.reward));
  ad.on("loadfail", e => console.warn("[AdMob] Load fail", e));
  ad.on("showfail", e => console.warn("[AdMob] Show fail", e));

  return ad;
}

/**
 * Show the video if it is ready; otherwise fail gracefully.
 */
export async function showRewarded() {
  if (!rewarded) {
    console.info("[AdMob] Rewarded not initialised or running on web.");
    return;
  }

  if (timeToShowAdd()) {
    if (await rewarded.isLoaded()) {
      await rewarded.show();
    } else {
      console.info("[AdMob] Rewarded not ready – try again soon.");
    }
  }
}

/**
 * Grant the in‑app reward (replace with your own store / API logic).
 */
function giveHearts({ amount }) {
  // TODO: Hook into Pinia / Vuex or call your backend.
  localStorage.setItem(ADD_STORAGE_KEY, String(Date.now()));
  console.log(`[AdMob] Granting reward: +${amount} hearts`);
}

function timeToShowAdd() {
  const raw = localStorage.getItem(ADD_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(ADD_STORAGE_KEY, String(Date.now()));
    return false;
  }

  const savedMs = Number(raw);
  if (!Number.isFinite(savedMs)) return false;

  const FIVE_MIN_MS = 5 * 60 * 1000;
  return Date.now() - savedMs >= FIVE_MIN_MS;
}
