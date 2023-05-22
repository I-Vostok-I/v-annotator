<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    :direction="direction"
    :id="svgId"
    width="100%"
  >
    <defs>
      <marker
        id="arrow"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" stroke="#000000" fill="#000000" />
      </marker>
    </defs>
    <g :transform="translate">
      <BaseRelation
        v-for="relation in lineRelations"
        :key="relation.relation.id"
        :dark="dark"
        :font-size="font.fontSize"
        :x1="relation.x1"
        :x2="relation.x2"
        :level="relation.level"
        :label="relation.label"
        :label-width="relation.labelWidth"
        :marker="relation.marker"
        :max-level="maxRelationLevel"
        :max-level-trait="maxTraitLevel"
        :traits-on-line="lineTraits.length > 0"
        :openLeft="relation.openLeft"
        :openRight="relation.openRight"
        :rtl="rtl"
        :margin="left"
        :selected="isSelectedRelation(relation.relation)"
        :state="relation.state"
        @click:relation="$emit('click:relation', $event, relation.relation)"
        @contextmenu:relation="$emit('contextmenu:relation', relation.relation)"
        @mouseover="$emit('setSelectedRelation', relation.relation)"
        @mouseleave="$emit('setSelectedRelation', null)"
      />
      <BaseTrait
        v-for="trait in lineTraits"
        :key="trait.trait.id"
        :font-size="font.fontSize"
        :offset="trait.offset"
        :dark="dark"
        :label="trait.label"
        :label-width="trait.labelWidth"
        :level="trait.level"
        :margin="left"
        :max-level="maxTraitLevel"
        :max-level-relation="maxRelationLevel"
        :relations-on-line="lineRelations.length > 0"
        :selected="isSelectedTrait(trait.trait)"
        :state="trait.state"
        @click:trait="$emit('click:trait', $event, trait.trait)"
        @contextmenu:trait="$emit('contextmenu:trait', trait.trait)"
        @mouseover="$emit('setSelectedTrait', trait.trait)"
        @mouseleave="$emit('setSelectedTrait', null)"
      />
      <g :transform="translateEntity">
        <BaseText :id="id" :text-line="textLine" :text="text" :x="baseX" />
        <BaseEntity
          v-for="gEntity in geometricEntities"
          :key="gEntity.entity.id"
          :ranges="gEntity.ranges"
          :color="color(gEntity.entity)"
          :label="labelText(gEntity.entity)"
          :no-text="noText(gEntity.entity)"
          :rtl="rtl"
          :margin="left"
          :level="gEntity.level"
          :font-size="font.fontSize"
          :selected="isSelectedEntity(gEntity.entity)"
          :state="gEntity.state"
          @click:entity="$emit('click:entity', $event, gEntity.entity)"
          @contextmenu:entity="$emit('contextmenu:entity', gEntity.entity)"
          @mouseover="$emit('setSelectedEntity', gEntity.entity)"
          @mouseleave="$emit('setSelectedEntity', null)"
        />
      </g>
    </g>
  </svg>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Entity } from "@/domain/models/Label/Entity";
import { RelationListItem } from "@/domain/models/Label/Relation";
import { Font } from "@/domain/models/Line/Font";
import { LabelList } from "@/domain/models/Label/Label";
import { TextLine } from "@/domain/models/Line/LineText";
import BaseEntity from "./BaseEntity.vue";
import BaseText from "./BaseText.vue";
import BaseTrait from "./BaseTrait.vue";
import BaseRelation from "./BaseRelation.vue";
import { EntityLine, GeometricEntity } from "@/domain/models/Line/LineEntity";
import { RelationLine, LineRelation } from "@/domain/models/Line/LineRelation";
import { LineTrait, TraitLine } from "@/domain/models/Line/LineTrait";
import { TraitListItem } from "@/domain/models/Label/Trait";

export default Vue.extend({
  components: {
    BaseEntity,
    BaseText,
    BaseTrait,
    BaseRelation,
  },

  props: {
    entities: {
      type: [] as PropType<Entity[]>,
      default: () => [],
      required: true,
    },
    relations: {
      type: [] as PropType<RelationListItem[]>,
      default: () => [],
    },
    traits: {
      type: [] as PropType<TraitListItem[]>,
      default: () => [],
    },
    textLine: {
      type: Object as PropType<TextLine>,
      required: true,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    font: {
      type: Object as PropType<Font>,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    entityLabels: {
      type: Object as PropType<LabelList>,
      required: true,
    },
    relationLabels: {
      type: Object as PropType<LabelList>,
    },
    traitLabels: {
      type: Object as PropType<LabelList>,
    },
    rtl: {
      type: Boolean,
      default: false,
    },
    baseX: {
      type: Number,
      default: 0,
    },
    left: {
      type: Number,
      default: 0,
    },
    right: {
      type: Number,
      default: 0,
    },
    selectedEntities: {
      type: Array as PropType<Entity[]>,
    },
    selectedRelation: {
      type: Object as PropType<RelationListItem | null>,
    },
    selectedTrait: {
      type: Object as PropType<TraitListItem | null>,
    },
  },

  data() {
    return {
      element: null as SVGTextElement | null,
    };
  },

  mounted() {
    this.setElement();
  },

  watch: {
    textLine: {
      handler() {
        this.setElement();
      },
      deep: true,
    },
    entities: {
      handler() {
        this.$nextTick(() => {
          const svg = document.getElementById(
            this.svgId
          ) as unknown as SVGSVGElement;
          const height = svg.getBBox().height + 20;
          svg.setAttribute("style", `height: ${height}px`);
          this.$emit("update:height", this.id, height);
        });
      },
      deep: true,
      immediate: true,
    },
  },

  computed: {
    translate(): string {
      return `translate(0, ${this.font.lineHeight})`;
    },
    geometricEntities(): GeometricEntity[] {
      if (this.element) {
        const view = new EntityLine(this.textLine, this.rtl);
        return view.render(this.element, this.entities, this.entityLabels);
      } else {
        return [];
      }
    },
    lineRelations(): LineRelation[] {
      const view = new RelationLine(
        this.relations,
        this.relationLabels,
        this.textLine,
        this.left,
        this.right
      );
      return view.render(this.geometricEntities, this.rtl);
    },
    lineTraits(): LineTrait[] {
      const view = new TraitLine(this.traits, this.traitLabels);
      return view.render(this.geometricEntities);
    },
    maxRelationLevel(): number {
      return Math.max(...this.lineRelations.map((r) => r.level), 0);
    },
    maxTraitLevel(): number {
      return Math.max(...this.lineTraits.map((t) => t.level), 0);
    },
    y(): number {
      const levelRel = Math.max(
        ...this.lineRelations.map((item) => item.level)
      );
      const levelTrait = Math.max(...this.lineTraits.map((item) => item.level));
      if (levelRel >= 0 && levelTrait >= 0) {
        return (
          20 +
          (this.font.fontSize + 3) * levelTrait +
          (this.font.fontSize + 3) * levelRel +
          (this.font.fontSize + 3) +
          24
        );
      } else if (levelRel >= 0) {
        return (
          20 +
          (this.font.fontSize + 3) * levelRel +
          (this.font.fontSize + 3) / 2 +
          32
        );
      } else if (levelTrait >= 0) {
        return (
          20 +
          (this.font.fontSize + 3) * levelTrait +
          (this.font.fontSize + 3) / 2 +
          12
        );
      } else {
        return 0;
      }
    },
    translateEntity(): string {
      return `translate(0, ${this.y})`;
    },
    direction(): string {
      return this.rtl ? "rtl" : "ltr";
    },
    id(): string {
      return `${this.textLine.startOffset}:${this.textLine.endOffset}`;
    },
    svgId(): string {
      return "svg" + this.id;
    },
  },

  methods: {
    noText(entity: Entity): boolean {
      // Do not show a label text if the entity continues from the previous line.
      return entity.startOffset < this.textLine.startOffset;
    },
    setElement() {
      this.$nextTick(() => {
        this.element = document.getElementById(
          this.id
        ) as unknown as SVGTextElement;
      });
    },
    color(entity: Entity): string {
      return this.entityLabels.getColor(entity.label)!;
    },
    labelText(entity: Entity): string {
      return this.entityLabels.getText(entity.label)!;
    },
    isSelectedRelation(relation: RelationListItem): boolean {
      return this.selectedRelation === relation;
    },
    isSelectedTrait(trait: TraitListItem): boolean {
      return this.selectedTrait === trait;
    },
    isSelectedEntity(entity: Entity): boolean {
      if (this.selectedRelation) {
        return this.selectedRelation.consistOf(entity);
      } else {
        return (
          this.selectedEntities.filter((e) => e.id === entity.id).length > 0
        );
      }
    },
  },
});
</script>

<style scoped>
svg {
  overflow-wrap: normal;
}
</style>
