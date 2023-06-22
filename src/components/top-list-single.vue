<template>
  <div class="single-list">
    <div class="back-block">
      <f7-row class="display-inline-flex align-items-center" @click="goBack">
        <img alt="" src="@/assets/icons/backSlag.svg" />
        <p>{{ $t("activity.top-list.back-to-the-top-list") }}</p>
      </f7-row>
    </div>

    <div class="scroll-page">
      <f7-block v-if="category">
        <f7-row class="justify-content-space-between">
          <f7-block-title>
            {{ category.title }}
          </f7-block-title>

          <f7-button class="my-place-btn" @click="goMyPlace">
            <p class="place-txt">
              {{ `${category.place}  ${$t("activity.top-list.place")}` }}
            </p>
          </f7-button>
        </f7-row>

        <f7-row class="justify-content-space-between">
          <p class="from-txt">
            {{ category.from }}
          </p>

          <p class="from-txt">{{ `${userPoints}  ${$t("over.points")}` }}</p>
        </f7-row>
      </f7-block>

      <f7-list v-if="topList.length" class="top-list list-scroll">
        <f7-list-item
          v-for="({ id, username, points }, index) in topList"
          :key="`list-item_${index + 1}`"
          :class="{
            'my-score': id === user.id,
            last: index === topList.length - 1,
            'selected-item': id === selectedTopListUserId,
          }"
        >
          <template #before-title>
            <span class="inline-block number mr-8">{{ `${index + 1}.` }}</span>
          </template>

          <template #title>
            <span class="inline-block name">{{ username }}</span>
          </template>

          <template #after>
            <span class="points">{{ points }}</span>
          </template>
        </f7-list-item>
      </f7-list>

      <div v-else class="list-loading-bg">
        <loading-small />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useEventBus } from "@vueuse/core";
import { useAuthStore } from "@/js/stores/auth";
import { useTopListStore } from "@/js/stores/top-list";
import LoadingSmall from "@/components/loading-small.vue";

const props = defineProps({
  category: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(["empty-category"]);

const { user } = storeToRefs(useAuthStore());
const { topList, selectedTopListUserId } = storeToRefs(useTopListStore());
const { getTopList, clearSelectedTopUser } = useTopListStore();

const bus = useEventBus("toplist-search");
const smallHeight = ref(false);

const userPoints = computed(() => topList.value.find(list => list.id === user.value.id)?.points);

const onOrientationChange = () => {
  smallHeight.value = window.screen.height < 501;
};

const goBack = () => {
  emit("empty-category");
};

const goMyPlace = () => {
  document.getElementsByClassName("list-scroll")[0].children[0].scrollTop =
    document.getElementsByClassName("my-score")[0].offsetHeight * (props.category.place - 1);
};

watch(
  () => props.category,
  async category => {
    if (category) {
      const filterValue =
        category.key === "world"
          ? ""
          : category.key === "institution"
          ? user.value?.institution?.place_id
          : user.value[category.key];

      await getTopList(category.key, filterValue);
    }
  },
  {
    deep: true,
    immediate: true,
  },
);

watch(selectedTopListUserId, value => {
  if (!value) return;

  nextTick(() => {
    const selectedItem = document.querySelector(".selected-item");
    setTimeout(() => {
      selectedItem.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 500);
  });
});

onMounted(() => {
  onOrientationChange();
  window.addEventListener("orientationchange", onOrientationChange);
  bus.emit("toggle-toplist-search", true);
});

onUnmounted(() => {
  window.removeEventListener("orientationchange", onOrientationChange);
  bus.emit("toggle-toplist-search", false);
  clearSelectedTopUser();
});
</script>

<style lang="scss">
@import "@/assets/scss/mixins/top-list-item-name";
@import "@/assets/scss/mixins/top-list-item-points";

.single-list {
  height: calc(100vh - 290px);

  .back-block {
    opacity: 0.5;

    p {
      all: unset;
      margin-left: 10px;
      font-family: "Rubik", sans-serif;
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      display: flex;
      align-items: center;
    }
  }

  .list-loading-bg {
    .loading-container {
      background: #fff;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100%;
      z-index: 60;
      position: fixed;
    }
  }

  .block {
    background: rgba(216, 179, 255, 0.2);
    padding: 24px 20px;
    margin: 20px 0;
    border-radius: 8px;

    .block-title {
      all: unset;
      line-height: 17px;
      font-family: "Rubik", sans-serif;
      font-weight: 500;
      font-size: 14px;
      align-items: center;
      color: #212121;
    }

    .update-txt {
      font-family: "Rubik", sans-serif;
      font-weight: 300;
      font-size: 10px;
      color: #212121;
      opacity: 0.9;

      a {
        color: inherit;
        opacity: inherit;
        text-decoration: revert;
        text-underline: #212121;
        font-weight: bold;
      }
    }

    .my-place-btn {
      all: unset;

      .place-txt {
        margin: 0;
        font-family: "Rubik", sans-serif;
        font-weight: 500;
        font-size: 14px;
        color: #8419ff;
      }
    }

    .from-txt {
      margin-bottom: 0;
      margin-top: 10px;
      line-height: 12px;
      font-family: "Rubik", sans-serif;
      font-weight: 400;
      font-size: 10px;
      color: #212121;
      opacity: 0.9;
    }
  }

  .top-list {
    margin: 0;

    &.list-scroll {
      ul {
        overflow: auto;
        margin-right: -24px;
        padding-right: 24px;
        height: calc(100vh - 443px);
      }
    }

    ul {
      &::before {
        display: none;
      }

      &::after {
        display: none;
      }

      li {
        &.selected-item {
          border-top: 2px solid #8419ff;
          border-bottom: 2px solid #8419ff;
        }
      }

      .item-content {
        padding-left: 0;

        .item-inner {
          padding: 20px 0;

          .item-title {
            display: flex;
          }

          .number {
            color: #212121;
            font-family: "Rubik", sans-serif;
            font-size: 18px;
            font-weight: 400;
            font-feature-settings: "tnum";
            font-variant-numeric: tabular-nums;
            opacity: 0.4;
          }

          .name {
            @include top-list-item-name;
          }

          .points {
            @include top-list-item-points;
          }
        }
      }

      .my-score {
        .item-inner {
          .number {
            color: #8419ff;
          }

          .name {
            font-family: "Rubik", sans-serif;
            color: #8419ff;
          }
        }
      }
    }
  }
}

@media (max-height: 501px) {
  .top-list {
    margin: 0;

    &.list-scroll {
      ul {
        overflow: unset !important;
        margin-right: unset !important;
        padding-right: unset !important;
        height: unset !important;
      }
    }
  }
  .scroll-page {
    overflow: auto;
    margin-right: -24px;
    padding-right: 24px;
    height: calc(100vh - 305px);

    .block {
      margin: 10px 0;
    }
  }
}
</style>
