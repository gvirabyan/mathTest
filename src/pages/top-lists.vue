<template>
  <f7-page name="top-lists" class="top-lists">
  <top-bar :tabs="navbarLinks" >
    <template #subtitle-data>20 questions</template>
  </top-bar>
    <div v-if="category === null" class="blocks">
      <f7-block
        v-for="(list, index) in linksList"
        @click="chooseList(list.title)"
        :class="`menu-item_${index + 1}`"
        :key="`menu-item_${index + 1}`">
        <f7-row class="justify-content-space-between">
          <f7-block-title>
            {{list.title}}
          </f7-block-title>
          <p  v-if="list.place"  class="place-txt">
            {{list.place}}
            place
          </p>
        </f7-row>

        <f7-row class="justify-content-space-between align-items-center">
          <p   v-if="list.place" class="from-txt">
            {{list.from}}
          </p>
          <p
            v-else
            class="update-txt"
          >
            Please <a @click.stop href="/profile/">update</a> information to see your rank
          </p>
          <p class="points-txt">
            {{list.points}}
          </p>
        </f7-row>
      </f7-block>
    </div>
    <top-list-single
      v-else :category="category"
      @empty-category="emptyCategory"
    />
    <div class="menu">
      <bottom-menu :current-path="f7route.path" />
    </div>
  </f7-page>
</template>

<script setup>
import BottomMenu from "@/components/bottom-menu.vue";
import TopBar from "@/components/topbar.vue";
import TopListSingle from "@/components/TopListSingle.vue";
import { useTopList } from "@/js/stores/top-list";
import {ref, watch, reactive, onMounted} from "vue";

const navbarLinks = [
  {
    id: 'status',
    name: `My Status`
  },
  {
    id: 'list',
    name: `Top List`
  },
  {
    id: 'answers',
    name: `My Answers`
  }
]

defineProps({
  f7route: Object,
});

const category = ref(null);

const topListStore = useTopList();

const rankings = ref(null)

onMounted(async() => {
  rankings.value = await topListStore.getRankings()
})

const linksList = reactive([
  {
    title: "In your Class",
    text: 'Last update: 2023-03-18 11:43',
    key: 'course'
  },
  {
    title: "In your School",
    text: 'Last update: 2023-03-18 11:43',
    key: 'institution'
  },
  {
    title: "In your City",
    text: 'Last update: 2023-03-18 11:43',
    key: 'city'
  },
  {
    title: "In your Country",
    text: 'Last update: 2023-03-18 11:43',
    key: 'country'
  },
  {
    title: "In World",
    text: 'Last update: 2023-03-18 11:43',
    key: 'world'
  },
]);

watch(
  () => rankings.value,
  (value) => {
    if(value) {
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
}
)

const chooseList = (title) => {
  category.value =  linksList.find( l => l.title === title)
}

const emptyCategory = () => {
  topListStore.emptyTopList();
  category.value =  null
}

</script>

<style lang="scss">
.top-lists {
  background: #fff;
  padding: 0;
  height: 100vh;
  .page-content {
    padding: 0;
    overflow: unset;
    .blocks {
      overflow: auto;
      height: calc(100vh - 246px);
      padding: 10px 24px 0 24px;
      .block {
        background: rgba(216, 179, 255, 0.2);
        padding: 24px 20px;
        margin: 20px 0;
        border-radius: 8px;
        &.menu-item_1 {
          background: rgba(241,229,255, 0.2)
        }
        &.menu-item_2 {
          background: rgba(228,228,228, 0.2)
        }
        &.menu-item_3 {
          background: rgba(241,229,255, 0.2)
        }
        &.menu-item_4 {
          background: rgba(216, 179, 255, 0.2);
        }
        &.menu-item_5 {
          background: rgba(241,229,255, 0.2)
        }
        .block-title {
          all: unset;
          line-height: 17px;
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
          margin-bottom: 0;
          margin-top: 10px;
          font-family: 'Rubik';
          font-style: normal;
          font-weight: 400;
          font-size: 10px;
          line-height: 12px;
          color: #212121;
          opacity: 0.9;
        }
      }
    }
  }
  .menu {
    position: fixed;
    bottom: 0;
    .toolbar {
      width: 100vw;
    }
  }
}
</style>
