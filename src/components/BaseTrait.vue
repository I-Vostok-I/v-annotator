<template>
  <g
    style="cursor: pointer; userselect: none"
    @click="$emit('click:trait', $event)"
    @contextmenu="$emit('contextmenu:trait')"
    @mouseover="$emit('mouseover')"
    @mouseleave="$emit('mouseleave')"
  >
    <rect
      :x="rectX"
      :y="rectY"
      rx="3"
      ry="3"
      :width="rectWidth"
      :height="rectHeight"
      :stroke="stateColour"
      :stroke-width="width"
      :fill="fill"
    />
    <text
      :x="textX"
      :y="textY"
      :fill="stateColour"
      text-anchor="middle"
      v-text="label"
    />
    <path
      v-if="level === 0"
      :d="`M${rectX + rectWidth / 4},${rectY + rectHeight} V${
        rectY + rectHeight + 16
      }`"
      :stroke="stateColour"
      stroke-width="2"
      fill="none"
    />
    <path
      v-if="level === 0"
      :d="`M${rectX + (rectWidth / 4) * 3},${rectY + rectHeight} V${
        rectY + rectHeight + 16
      }`"
      :stroke="stateColour"
      stroke-width="2"
      fill="none"
    />
  </g>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    fontSize: {
      type: Number,
      required: true,
    },
    offset: {
      type: Number,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
    labelWidth: {
      type: Number,
      required: true,
    },
    level: {
      type: Number,
      default: 0,
    },
    margin: {
      type: Number,
      default: 0,
    },
    maxLevel: {
      type: Number,
    },
    maxLevelRelation: {
      type: Number,
    },
    relationsOnLine: {
      type: Boolean,
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
    r(): number {
      return 12;
    },
    y(): number {
      if (this.relationsOnLine) {
        return (
          20 +
          this.rectHeight * this.maxLevel +
          this.rectHeight * this.maxLevelRelation +
          this.rectHeight +
          12
        );
      } else {
        return 20 + this.rectHeight * this.maxLevel + this.rectHeight / 2;
      }
    },
    d(): string {
      return "";
    },
    dy(): number {
      return 20 + this.rectHeight * this.level;
    },
    _offset(): number {
      return this.offset - this.margin;
    },
    lineY(): number {
      return this.y - this.dy - this.r;
    },
    rectX(): number {
      return this.textX - this.labelWidth / 2 - 2.5;
    },
    rectY(): number {
      return this.textY - this.fontSize / 2 - 6;
    },
    rectWidth(): number {
      return this.labelWidth + 5;
    },
    rectHeight(): number {
      return this.fontSize + 3;
    },
    textX(): number {
      return this._offset;
    },
    textY(): number {
      return this.lineY + this.fontSize / 2;
    },
    width(): number {
      return this.selected ? 3 : 1;
    },
    fill(): string {
      return this.dark ? "#1E1E1E" : "white";
    },
    textCol(): string {
      return this.dark ? "white" : "black";
    },
    stateColour(): string {
      if (this.state === "removed") {
        return "#D50000";
      }
      if (this.state === "added") {
        return "#00A651";
      }
      if (this.state === "modified") {
        return "#E67E22";
      }
      return this.dark ? "white" : "black";
    },
  },
});
</script>
