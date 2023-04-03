<template>
  <div class="single-list">
    <div class="back-block">
      <f7-row
        @click="goBack"
        class="display-inline-flex align-items-center">
        <img src="@/assets/icons/backSlag.svg" alt="">
        <p>Back to the Top List</p>
      </f7-row>
    </div>

    <f7-block v-if="category">
      <f7-row class="justify-content-space-between">
        <f7-block-title>
          {{category.title}}
        </f7-block-title>
        <p v-if="category.place" class="place-txt">
          {{category.place}}
          place
        </p>
      </f7-row>

      <f7-row class="justify-content-space-between">
        <p v-if="category.place" class="from-txt">
          {{category.from}}
        </p>
        <p
            v-else
            class="update-txt"
        >
          Please <a @click.stop href="/profile/">update</a> information to see your rank
        </p>
        <p class="place-txt">
          {{ category.points }}
        </p>
      </f7-row>
    </f7-block>

    <f7-list v-if="topList.length" class="top-list">
      <f7-list-item
          v-for="({ id, username, points }, index) in topList"
          :key="`list-item_${index + 1}`"
          :class="{ 'my-score': id === user.id, last: index === topList.length - 1 }"
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
  </div>
</template>

<script setup>

import { useAuthStore } from "@/js/stores/auth";
import { useTopList } from "@/js/stores/top-list";
import { storeToRefs } from "pinia";
import {watch} from "vue";
const props = defineProps({
  category: {
    type: Object
  }
})
const emit = defineEmits(['empty-category']);

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const topListStore = useTopList();
const { topList } = storeToRefs(topListStore);
const { getTopList } = topListStore;
watch(
  () => props.category,
  async (category) => {
    console.log(topList.value, 3693)
    if(category) {
      if(category.key === 'world') {
        await getTopList(category.key, "");
      } else if(category.key === 'institution') {
        await getTopList(category.key, user.value.institution?.place_id)
      } else {
        await getTopList(category.key, user.value[category.key]);
      }
    }
  },
  {
    deep: true,
    immediate: true
  }
)
watch(
  () => topList.value,
  async (v) => {
    console.log(v, 2356)
  },
  {
    deep: true,
    immediate: true
  }
)
const goBack = () => {
  emit('empty-category')
}
</script>

<style lang="scss">
.single-list {
  padding: 0 24px;
  .back-block {
    padding-top: 30px;
    opacity: 0.5;
    p {
      all: unset;
      margin-left: 10px;
      font-family: 'Rubik';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      display: flex;
      align-items: center;
    }
  }
  .block {
    background: rgba(216, 179, 255, 0.2);
    padding: 24px 20px;
    margin: 20px 0;
    border-radius: 8px;
    .block-title {
      all: unset;
      font-family: 'Rubik';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      align-items: center;
      color: #212121;
    }
    .update-txt {
      font-family: 'Rubik';
      font-style: normal;
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
    .place-txt {
      margin: 0;
      font-family: 'Rubik';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      color: #8419ff;
    }
    .points-txt {
      margin: 0;
      font-family: 'Rubik';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      color: #8419ff;
    }
    .from-txt {
      font-family: 'Rubik';
      font-style: normal;
      font-weight: 400;
      font-size: 10px;
      color: #212121;
      opacity: 0.9;
    }
  }
  .top-list {
    margin-top: 10px;
    ul {
      &::before {
        display: none;
      }
      .item-content {
        padding-left: 0;
        .item-inner {
          padding: 20px 0;
          .number {
            font-family: 'Rubik';
            font-style: normal;
            font-weight: 400;
            font-size: 18px;
            color: #212121;
            opacity: 0.4;
          }
          .name {
            font-family: 'Rubik';
            font-style: normal;
            font-weight: 500;
            font-size: 18px;
            line-height: 22px;
            color: #212121;
          }
          .points {
            font-family: 'Rubik';
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            align-items: center;
            color: #8419FF;
          }
        }
      }
      .my-score {
        .item-inner {
          .number {
            color: #8419FF;
          }
          .name {
            font-family: 'Rubik';
            color: #8419FF;
          }
        }
      }
    }
  }
}
</style>