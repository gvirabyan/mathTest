<template>
  <div class="top-bar">
    <div class="display-flex justify-content-space-between">
      <h1 class="top-bar-title"><slot name="title" /></h1>

      <div class="top-bar-button-wrapper">
        <f7-button v-if="search" class="top-bar-btn" @click="emit('show-search-popup')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 16L20 20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </f7-button>

        <f7-button class="top-bar-btn" @click="toggleNotificationsPopup">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 9C18 10.6667 18 12.3333 18 14C18 16 18.6667 17.3333 20 18H4C5.33333 17.3333 6 16 6 14C6 12.3333 6 10.6667 6 9C6 5.68629 8.68629 3 12 3C15.3137 3 18 5.68629 18 9Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10 19C10 20.1046 10.8954 21 12 21C13.1046 21 14 20.1046 14 19"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span v-if="hasNewNotifications" class="unread-point"></span>
        </f7-button>
      </div>
    </div>

    <div class="top-bar-subtitle-wrapper">
      <p class="top-bar-subtitle"><slot name="subtitle" /></p>
      <p class="top-bar-subtitle-data"><slot name="subtitle-data" /></p>
    </div>

    <div class="top-bar-tabs-wrapper" :class="{ shadow: showTabsShadow }">
      <div ref="topBarTabs" class="top-bar-tabs">
        <f7-button
          v-for="({ id, name, active }, index) in tabsResult"
          :key="`top-bar-tab_${id}`"
          class="top-bar-tab"
          :class="{ active: byRoute ? name === byRoute : active }"
          @click="selectTab(id, index)"
        >
          {{ name }}
        </f7-button>
      </div>
    </div>
  </div>

  <custom-popup
    :is-opened-initial="showNotificationsPopup"
    class="notifications"
    @close-popup="toggleNotificationsPopup"
  >
    <notifications />
  </custom-popup>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useNotifications } from "@/js/stores/notifications";
import CustomPopup from "@/components/custom-popup.vue";
import Notifications from "@/components/notifications.vue";
import { storeToRefs } from "pinia";

const props = defineProps({
  f7router: { type: Object, default: () => {} },
  tabs: {
    type: Array,
    default: () => [],
  },
  firstLoadIndex: {
    type: Number,
    default: 0,
  },
  search: {
    type: Boolean,
    default: true,
  },
  byRoute: {
    type: Boolean,
    default: false,
  },
  changeTab: {
    type: Number,
    default: -1
  }
});

const topBarTabs = ref(null);
watch(
  () => props.changeTab,
  (index) => {
    if(index > -1) {
      selectTab(props.tabs.find((t, i) => i === index).id, index)
    }
},{
    deep: true
  },
)

const emit = defineEmits(["tab-selected", "show-search-popup", "show-notifications-popup"]);

const { hasNewNotifications } = storeToRefs(useNotifications());

const tabsResult = ref(props.tabs);
const showTabsShadow = ref(true);
const hasNotificationsPopup = ref(false);
const showNotificationsPopup = ref(false);

onMounted(() => {
  if (props.firstLoadIndex !== 0) {
    selectTab(props.tabs.find((t, i) => i === props.firstLoadIndex).id, props.firstLoadIndex);
  }
  window.addEventListener("resize", resizeChange);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeChange);
});

const activeIndex = ref(0);
const resizeChange = () => {
  if (
    topBarTabs.value.clientWidth / 2 !==
    topBarTabs.value.children[activeIndex.value].getBoundingClientRect().left + 41
  ) {
    topBarTabs.value.scrollLeft +=
      topBarTabs.value.children[activeIndex.value].getBoundingClientRect().left +
      (topBarTabs.value.children[activeIndex.value].clientWidth + 20) / 2 -
      24 -
      topBarTabs.value.clientWidth / 2;
  }
};

const handleTabsScroll = e => {
  const maxScrollLeftDistance = e.currentTarget.scrollWidth - e.currentTarget.clientWidth;
  const scrollLeftDistance = e.currentTarget.scrollLeft;

  if (maxScrollLeftDistance <= scrollLeftDistance) {
    showTabsShadow.value = false;
  } else if (maxScrollLeftDistance > scrollLeftDistance) {
    showTabsShadow.value = true;
  }
};

const selectTab = (id, index) => {
  activeIndex.value = index;
  topBarTabs.value.scrollLeft +=
    topBarTabs.value.children[index].getBoundingClientRect().left +
    (topBarTabs.value.children[activeIndex.value].clientWidth + 20) / 2 -
    24 -
    topBarTabs.value.clientWidth / 2;
  tabsResult.value = tabsResult.value.map(t => {
    t.active = false;
    t.active = t.id === id;

    return t;
  });

  emit("tab-selected", id);
};

const selectFirstTab = tabs => {
  tabsResult.value = tabs
    .sort((a, b) => a.id - b.id)
    .map((t, index) => {
      return { ...t, active: index === props.firstLoadIndex };
    });
  emit("tab-selected", tabsResult.value[props.firstLoadIndex].id);
};

const toggleNotificationsPopup = () => {
  showNotificationsPopup.value = !showNotificationsPopup.value;
};

watch(
  () => props.tabs,
  value => {
    selectFirstTab(value);
  },
  {
    deep: true,
  },
);

onMounted(() => {
  topBarTabs.value.addEventListener("scroll", handleTabsScroll);
  hasNotificationsPopup.value = true;
});

if (props.tabs.length) {
  selectFirstTab(props.tabs);
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/top-bar.scss";
</style>
