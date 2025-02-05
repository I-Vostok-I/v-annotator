<template>
  <g @mouseover="$emit('mouseover')" @mouseleave="$emit('mouseleave')">
    <BaseEntityLine
      v-for="([x1, x2], index) in coordinates"
      :key="index"
      :x1="x1"
      :x2="x2"
      :y="lineY"
      :color="stateColourLine"
      :height="height"
    />
    <BaseEntityText
      v-if="!noText"
      :r="r"
      :x="textX"
      :y="textY"
      :dx="dx"
      :rtl="rtl"
      :text="label"
      :color="stateColourText"
      :color-shape="stateColourLine"
      @click:entity="$emit('click:entity', $event)"
      @contextmenu:entity="$emit('contextmenu:entity')"
    />
  </g>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import BaseEntityText from "./BaseEntityText.vue";
import BaseEntityLine from "./BaseEntityLine.vue";
import { Ranges } from "@/domain/models/Line/LineEntity";
import config from "@/domain/models/Config/Config";

export default Vue.extend({
  components: {
    BaseEntityText,
    BaseEntityLine,
  },

  props: {
    ranges: {
      type: Object as PropType<Ranges>,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    noText: {
      type: Boolean,
      required: false,
    },
    label: {
      type: String,
      required: true,
    },
    rtl: {
      type: Boolean,
      default: false,
    },
    margin: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 0,
    },
    fontSize: {
      type: Number,
      default: 17,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    state: {
      type: String,
      default: "added",
    },
  },

  computed: {
    dx(): number {
      return this.rtl ? -config.labelMargin : config.labelMargin;
    },
    r(): number {
      return config.radius;
    },
    height(): number {
      return this.selected ? config.lineWidth * 1.5 : config.lineWidth;
    },
    textX(): number {
      if (this.rtl) {
        return this.x(this.ranges.first.x2);
      } else {
        return this.x(this.ranges.first.x1);
      }
    },
    textY(): number {
      const marginTop = 5;
      return this.lineY + this.fontSize / 2 + marginTop;
    },
    lineY(): number {
      const marginBottom = 8;
      return (
        config.lineWidth +
        (config.lineWidth + this.fontSize + marginBottom) * this.level
      );
    },
    coordinates(): [number, number][] {
      return this.ranges.items.map((range) => [
        this.x(range.x1),
        this.x(range.x2),
      ]);
    },
    stateColourLine(): string {
      if (this.state === "removed") {
        return "#888888";
      }
      return this.color;
    },
    stateColourText(): string {
      if (this.state === "removed") {
        return "#D50000";
      }
      if (this.state === "added") {
        return "#00A651";
      }
      if (this.state === "modified") {
        return "#E67E22";
      }
      return "currentColor";
    },
  },

  methods: {
    x(x: number): number {
      return x - this.margin;
    },
  },
});
</script>
