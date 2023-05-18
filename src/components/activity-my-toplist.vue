<template>
  <div
    :class="{
      'scroll-list': category === null,
    }"
    class="top-lists"
    name="top-lists"
  >
    <div v-if="category === null" class="blocks">
      <div class="circle-points">
        <p>
          {{ user.points }}<br />
          <span>{{ $t("over.points") }}</span>
        </p>
      </div>
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
            {{ $t("activity.top-list.place") }}
          </p>
        </f7-row>

        <f7-row class="justify-content-space-between align-items-center">
          <p v-if="list.place" class="from-txt">
            {{ list.from }}
          </p>
          <p v-else class="update-txt">
            {{ $t("activity.top-list.please") }}
            <a href="/profile/account/" @click.stop>{{ $t("activity.top-list.update") }}</a>
            {{ $t("activity.top-list.your") }} {{ list.fieldName }}
          </p>
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
import { ref, watch, reactive, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
import { useTopList } from "@/js/stores/top-list";
import TopListSingle from "@/components/top-list-single.vue";
import { useI18n } from "vue-i18n";

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

onMounted(async () => {
  rankings.value = await topListStore.getRankings();
});

const i18n = useI18n();

const linksList = reactive([
  {
    title: i18n.t("activity.top-list.lists.0.title"),
    fieldName: i18n.t("activity.top-list.lists.0.fieldName"),
    key: "course",
  },
  {
    title: i18n.t("activity.top-list.lists.1.title"),
    fieldName: i18n.t("activity.top-list.lists.1.fieldName"),
    key: "institution",
  },
  {
    title: i18n.t("activity.top-list.lists.2.title"),
    fieldName: i18n.t("activity.top-list.lists.2.fieldName"),
    key: "city",
  },
  {
    title: i18n.t("activity.top-list.lists.3.title"),
    fieldName: i18n.t("activity.top-list.lists.3.fieldName"),
    key: "country",
  },
  {
    title: i18n.t("activity.top-list.lists.4.title"),
    fieldName: i18n.t("activity.top-list.lists.4.fieldName"),
    key: "world",
  },
]);

watch(
  () => rankings.value,
  value => {
    if (value) {
      linksList[0].place = value.course.my_place;
      linksList[0].from = `${i18n.t("activity.top-list.from")} ${value.course.users_amount} ${i18n.t(
        "activity.top-list.people",
      )}`;
      linksList[1].place = value.institution.my_place;
      linksList[1].from = `${i18n.t("activity.top-list.from")} ${value.institution.users_amount} ${i18n.t(
        "activity.top-list.people",
      )}`;
      linksList[2].place = value.city.my_place;
      linksList[2].from = `${i18n.t("activity.top-list.from")} ${value.city.users_amount} ${i18n.t(
        "activity.top-list.people",
      )}`;
      linksList[3].place = value.country.my_place;
      linksList[3].from = `${i18n.t("activity.top-list.from")} ${value.country.users_amount} ${i18n.t(
        "activity.top-list.people",
      )}`;
      linksList[4].place = value.world.my_place;
      linksList[4].from = `${i18n.t("activity.top-list.from")} ${value.world.users_amount} ${i18n.t(
        "activity.top-list.people",
      )}`;
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
