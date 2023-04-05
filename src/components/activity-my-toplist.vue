<template>
  <div
    :class="{
      'scroll-list': category === null,
    }"
    class="top-lists"
    name="top-lists"
  >
    <div v-if="category === null" class="blocks">
      <f7-block
        v-for="(list, index) in linksList"
        :key="`menu-item_${index + 1}`"
        :class="`menu-item_${index + 1}`"
        @click="chooseList(list.title)"
      >
        <f7-row class="justify-content-space-between">
          <f7-block-title>
            {{ list.title }}
          </f7-block-title>
          <p v-if="list.place" class="place-txt">
            {{ list.place }}
            place
          </p>
        </f7-row>

        <f7-row class="justify-content-space-between align-items-center">
          <p v-if="list.place" class="from-txt">
            {{ list.from }}
          </p>
          <p v-else class="update-txt">Please <a href="/profile/" @click.stop>update</a> your {{ list.fieldName }}</p>
          <p class="points-txt">
            {{ list.points }}
          </p>
        </f7-row>
      </f7-block>
    </div>
    <top-list-single v-else :category="category" @empty-category="emptyCategory" />
  </div>
</template>

<script setup>
import {ref, watch, reactive, onMounted, onUnmounted} from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
import { useTopList } from "@/js/stores/top-list";
import TopListSingle from "@/components/top-list-single.vue";

defineProps({
  f7route: {
    type: Object,
    default: () => {},
  },
});

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const category = ref(null);

const topListStore = useTopList();

const rankings = ref(null);
const isLoading = ref(false);

onMounted(async () => {
  rankings.value = await topListStore.getRankings();
});

onUnmounted(()=> {
  alert(7)
})

const linksList = reactive([
  {
    title: "In your Class",
    fieldName: "class",
    key: "course",
  },
  {
    title: "In your School",
    fieldName: "school",
    key: "institution",
  },
  {
    title: "In your City",
    fieldName: "city",
    key: "city",
  },
  {
    title: "In your Country",
    fieldName: "country",
    key: "country",
  },
  {
    title: "In World",
    fieldName: "world",
    key: "world",
  },
]);

watch(
  () => rankings.value,
  value => {
    if (value) {
      linksList[0].place = value.course.my_place;
      linksList[0].from = `from ${value.course.users_amount} people`;
      linksList[1].place = value.institution.my_place;
      linksList[1].from = `from ${value.institution.users_amount} people`;
      linksList[2].place = value.city.my_place;
      linksList[2].from = `from ${value.city.users_amount} people`;
      linksList[3].place = value.country.my_place;
      linksList[3].from = `from ${value.country.users_amount} people`;
      linksList[4].place = value.world.my_place;
      linksList[4].from = `from ${value.world.users_amount} people`;
    }
  },
);

const chooseList = title => {
  let chosen = linksList.find(l => l.title === title);
  if (user.value[chosen.key] || chosen.key === "world") {
    category.value = chosen;
  }
};

const emptyCategory = () => {
  topListStore.emptyTopList();
  category.value = null;
};
</script>

<style lang="scss">
@import "@/assets/scss/components/activity-my-toplist.scss";
</style>
