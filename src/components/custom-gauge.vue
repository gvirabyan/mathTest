<template>
  <div class="custom-gauge-wrapper">
    <svg :height="heightComp" :width="widthComp">
      <defs>
        <linearGradient :id="`grad${colorWithoutSharp}`" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" :stop-color="color" stop-opacity="1"></stop>
          <stop offset="100%" :stop-color="color" stop-opacity="1"></stop>
        </linearGradient>
      </defs>

      <circle
        :cx="radius"
        :cy="radius"
        :r="innerRadiusComp"
        :stroke="color"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-width="strokeWidthComp"
        stroke-linecap="round"
        :transform="transform"
        opacity="0.2"
      />

      <circle
        class="gauge_base"
        :cx="radius"
        :cy="radius"
        :r="innerRadiusComp"
        :stroke="`url(#grad${colorWithoutSharp})`"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="offset"
        :stroke-width="strokeWidthComp"
        :transform="transform"
        stroke-linecap="round"
        style="transition: stroke-dasharray 0.3s"
      />
    </svg>

    <div class="custom-gauge-content">
      <p v-if="hasPercentSlot" class="percent"><slot name="percent" />%</p>
      <h3 class="amount"><slot name="amount" /></h3>
      <p class="info"><slot name="info" /></p>
    </div>
  </div>
</template>

<script setup>
import { computed, useSlots } from "vue";

const props = defineProps({
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
  radius: {
    type: Number,
    default: 0,
  },
  strokeWidth: {
    type: Number,
    default: 0,
  },
  innerRadius: {
    type: Number,
    default: 0,
  },
  percent: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: "#000",
  },
});

const slots = useSlots();

const widthComp = computed(() => (props.width ? props.width : props.radius * 2));
const heightComp = computed(() => (props.height ? props.height : props.radius * 2));
const strokeWidthComp = computed(() => (props.strokeWidth ? props.strokeWidth : props.radius * 0.2));
const innerRadiusComp = computed(() => (props.innerRadius ? props.innerRadius : props.radius - props.strokeWidth / 2));
const circumference = computed(() => innerRadiusComp.value * 2 * Math.PI);
const arc = computed(() => circumference.value * (270 / 360));
const dashArray = computed(() => `${arc.value} ${circumference.value}`);
const transform = computed(() => `rotate(135, ${props.radius}, ${props.radius})`);
const offset = computed(() => arc.value - (props.percent / 100) * arc.value);
const colorWithoutSharp = computed(() => props.color.replace("#", ""));
const hasPercentSlot = computed(() => !!slots.percent);
</script>

<style lang="scss">
.custom-gauge-wrapper {
  position: relative;
}

.custom-gauge-content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  padding-top: 40px;
  text-align: center;

  .percent {
    margin: 0 0 6px;
    color: v-bind("props.color");
    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
  }

  .amount {
    margin: 0;
    font-weight: 500;
    font-size: 36px;
    line-height: 43px;
  }

  .info {
    width: 70%;
    margin: 0 auto;
    font-size: 12px;
    line-height: 14px;
  }
}
</style>
