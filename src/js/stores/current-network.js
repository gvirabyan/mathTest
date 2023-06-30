import { ref, reactive, computed } from "vue";
import { defineStore } from "pinia";
import { useNetwork } from "@vueuse/core";

export const useCurrentNetwork = defineStore("current-network", () => {
  const network = reactive(useNetwork());
  const networkCurrentState = ref(null);

  const checkConnection = () => {
    if (!window.cordova) return;

    const networkState = navigator.connection.type;
    const states = {};

    /* eslint-disable */
    states[Connection.UNKNOWN] = "Unknown connection";
    states[Connection.ETHERNET] = "Ethernet connection";
    states[Connection.WIFI] = "WiFi connection";
    states[Connection.CELL_2G] = "Cell 2G connection";
    states[Connection.CELL_3G] = "Cell 3G connection";
    states[Connection.CELL_4G] = "Cell 4G connection";
    states[Connection.CELL] = "Cell generic connection";
    states[Connection.NONE] = "No network connection";
    /* eslint-enable */

    networkCurrentState.value = states[networkState];
  };

  return {
    network,
    networkCurrentState,
    checkConnection,
  };
});
