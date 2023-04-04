<template>
  <article class="activity-tab-content">
    <div class="my-answers">
      <h2 class="title">Summary</h2>

      <p class="last-update-info">Last update: {{ lastUpdate }}</p>

      <custom-gauge :radius="93" />

      <svg width="186" height="157" viewBox="0 0 186 157" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.2">
          <mask id="path-1-inside-1_259_3318" fill="white">
            <path
              d="M30.5271 155.473C28.7112 157.289 25.7573 157.296 24.0344 155.392C12.7748 142.946 5.07244 127.661 1.78697 111.143C-1.80146 93.1032 0.0402485 74.404 7.0792 57.4104C14.1181 40.4169 26.0382 25.8923 41.332 15.6733C56.6257 5.45436 74.6063 1.13284e-06 93 0C111.394 -1.13284e-06 129.374 5.45435 144.668 15.6733C159.962 25.8923 171.882 40.4169 178.921 57.4104C185.96 74.404 187.801 93.1032 184.213 111.143C180.928 127.661 173.225 142.946 161.966 155.392C160.243 157.296 157.289 157.289 155.473 155.473C153.657 153.657 153.668 150.721 155.38 148.807C165.344 137.669 172.165 124.042 175.092 109.329C178.321 93.0928 176.664 76.2636 170.329 60.9694C163.994 45.6752 153.266 32.6031 139.501 23.406C125.737 14.2089 109.554 9.3 93 9.3C76.4457 9.3 60.2632 14.2089 46.4988 23.406C32.7344 32.6031 22.0063 45.6752 15.6713 60.9694C9.33622 76.2636 7.67869 93.0929 10.9083 109.329C13.8349 124.042 20.6555 137.669 30.6201 148.807C32.3324 150.721 32.3431 153.657 30.5271 155.473Z"
            />
          </mask>
          <path
            d="M30.5271 155.473C28.7112 157.289 25.7573 157.296 24.0344 155.392C12.7748 142.946 5.07244 127.661 1.78697 111.143C-1.80146 93.1032 0.0402485 74.404 7.0792 57.4104C14.1181 40.4169 26.0382 25.8923 41.332 15.6733C56.6257 5.45436 74.6063 1.13284e-06 93 0C111.394 -1.13284e-06 129.374 5.45435 144.668 15.6733C159.962 25.8923 171.882 40.4169 178.921 57.4104C185.96 74.404 187.801 93.1032 184.213 111.143C180.928 127.661 173.225 142.946 161.966 155.392C160.243 157.296 157.289 157.289 155.473 155.473C153.657 153.657 153.668 150.721 155.38 148.807C165.344 137.669 172.165 124.042 175.092 109.329C178.321 93.0928 176.664 76.2636 170.329 60.9694C163.994 45.6752 153.266 32.6031 139.501 23.406C125.737 14.2089 109.554 9.3 93 9.3C76.4457 9.3 60.2632 14.2089 46.4988 23.406C32.7344 32.6031 22.0063 45.6752 15.6713 60.9694C9.33622 76.2636 7.67869 93.0929 10.9083 109.329C13.8349 124.042 20.6555 137.669 30.6201 148.807C32.3324 150.721 32.3431 153.657 30.5271 155.473Z"
            stroke="#D8B3FF"
            stroke-width="20"
            mask="url(#path-1-inside-1_259_3318)"
          />
        </g>
      </svg>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useUserStats } from "@/js/stores/user-stats";
import timeAgo from "@/js/utils/time-ago";
import CustomGauge from "@/components/custom-gauge.vue";

const userStatsStore = useUserStats();
const { answersStats } = storeToRefs(userStatsStore);
const { getAnswersStats } = userStatsStore;

const lastUpdate = computed(() => timeAgo(new Date(answersStats.value.last_update)));

getAnswersStats();
</script>

<style lang="scss">
.activity-tab-content {
  flex: 1;
  padding: 30px 24px;
  font-family: "Rubik", sans-serif;

  .my-answers {
    text-align: center;
  }

  .title {
    font-size: 18px;
    font-weight: 500;
    line-height: 22px;
  }

  .last-update-info {
    margin-top: 9px;
    color: rgba(#212121, 0.9);
    font-size: 12px;
    line-height: 14px;
  }
}
</style>
