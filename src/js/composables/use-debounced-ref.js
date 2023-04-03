import { customRef, ref } from "vue";

const debounce = (fn, delay = 1000, immediate = false) => {
  let timeout;
  return (...args) => {
    if (immediate && !timeout) fn(...args);
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const useDebouncedRef = (initialValue, delay, immediate) => {
  const state = ref(initialValue);
  return customRef((track, trigger) => ({
    get() {
      track();
      return state.value;
    },
    set: debounce(
      value => {
        state.value = value;
        trigger();
      },
      delay,
      immediate,
    ),
  }));
};

export default useDebouncedRef;
