<template>
  <g
    style="cursor: pointer; userselect: none"
    @click="$emit('click:relation', $event)"
    @contextmenu="$emit('contextmenu:relation')"
    @mouseover="$emit('mouseover')"
    @mouseleave="$emit('mouseleave')"
  >
    <path
      :d="d"
      v-bind="markerObj"
      :stroke="stateColour"
      :stroke-width="width"
      fill="none"
    />
    <g v-if="x1">
      <rect
        :x="rectX"
        :y="rectY"
        :width="labelWidth"
        :height="fontSize"
        :fill="fill"
      />
      <text
        :x="center"
        :y="textY"
        :fill="stateColour"
        text-anchor="middle"
        v-text="label"
      />
    </g>
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
    x1: {
      type: Number,
    },
    x2: {
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
    openLeft: {
      type: Boolean,
      default: false,
    },
    openRight: {
      type: Boolean,
      default: false,
    },
    rtl: {
      type: Boolean,
      default: false,
    },
    margin: {
      type: Number,
      default: 0,
    },
    marker: {
      type: String,
    },
    maxLevel: {
      type: Number,
    },
    maxLevelTrait: {
      type: Number,
    },
    traitsOnLine: {
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
    adjustedFontSize(): number {
      return this.fontSize + 3;
    },
    r(): number {
      return 12;
    },
    y(): number {
      if (this.traitsOnLine) {
        return (
          20 +
          this.adjustedFontSize * this.maxLevel +
          this.adjustedFontSize * this.maxLevelTrait +
          this.adjustedFontSize +
          12
        );
      } else {
        return (
          20 +
          this.adjustedFontSize * this.maxLevel +
          this.adjustedFontSize / 2 +
          this.adjustedFontSize
        );
      }
    },
    d(): string {
      if (this.openLeft && this.openRight) {
        return `M ${this._x1} ${this.y - this.dy - this.r}
        H ${this._x2}
        `;
      } else if (this.openLeft) {
        return `M ${this._x1} ${this.y - this.dy - this.r}
        H ${this._x2 - this.r}
        A ${this.r} ${this.r} 0 0 1 ${this._x2} ${this.lineY + this.r}
        v ${this.dy - 8}
        `;
      } else if (this.openRight) {
        return `M ${this._x1} ${this.y - 8}
        v -${this.dy - 8}
        A ${this.r} ${this.r} 0 0 1 ${this._x1 + this.r} ${this.lineY}
        H ${this._x2}
        `;
      } else {
        return `M ${this._x1} ${this.y - 5}
        v -${this.dy - 8}
        A ${this.r} ${this.r} 0 0 1 ${this._x1 + this.r} ${this.lineY}
        H ${this._x2 - this.r}
        A ${this.r} ${this.r} 0 0 1 ${this._x2} ${this.lineY + this.r}
        v ${this.dy - 8}
        `;
      }
    },
    dy(): number {
      return (
        20 +
        this.adjustedFontSize * this.level +
        this.adjustedFontSize * this.maxLevelTrait +
        this.adjustedFontSize
      );
    },
    center(): number {
      return this._x1 + (this._x2 - this._x1) / 2;
    },
    rectX(): number {
      return this.center - this.labelWidth / 2;
    },
    rectY(): number {
      return this.lineY - this.fontSize / 2;
    },
    lineY(): number {
      return this.y - this.dy - this.r;
    },
    textY(): number {
      return this.lineY + this.fontSize / 2 - 3;
    },
    _x1(): number {
      return this.x1 - this.margin;
    },
    _x2(): number {
      return this.x2 - this.margin;
    },
    width(): number {
      return this.selected ? 3 : 2;
    },
    markerObj() {
      if (this.marker === "start") {
        switch (this.state) {
          case "removed":
            return { "marker-start": "url(#arrow-removed)" };
          case "added":
            return { "marker-start": "url(#arrow-added)" };
          case "modified":
            return { "marker-start": "url(#arrow-modified)" };
          default:
            if (this.dark) {
              return { "marker-start": "url(#arrow-light)" };
            }
            return { "marker-start": "url(#arrow-dark)" };
        }
      } else if (this.marker === "end") {
        switch (this.state) {
          case "removed":
            return { "marker-end": "url(#arrow-removed)" };
          case "added":
            return { "marker-end": "url(#arrow-added)" };
          case "modified":
            return { "marker-end": "url(#arrow-modified)" };
          default:
            if (this.dark) {
              return { "marker-end": "url(#arrow-light)" };
            }
            return { "marker-end": "url(#arrow-dark)" };
        }
      } else {
        return {};
      }
    },
    fill(): string {
      return this.dark ? "#1E1E1E" : "white";
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
      return this.dark ? "#93c9c9" : "#222222";
    },
  },
});
</script>
