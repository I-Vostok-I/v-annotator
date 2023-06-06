<template>
  <div id="app" style="width: 1000px; background-color: #eee">
    <button @click="changeText">Change text</button>
    <button @click="resetEntity">Reset entity</button>
    <button @click="changeLabel">Change label</button>
    <button @click="rtl = !rtl">Change RTL{{ rtl }}</button>
    <button @click="allowOverlapping = !allowOverlapping">
      Allow overlapping({{ allowOverlapping }})
    </button>
    <button @click="addRelation">Add relation</button>
    <button @click="addTrait">Add trait</button>
    <v-annotator
      :dark="false"
      :allow-overlapping="allowOverlapping"
      :text="text"
      :entities="entities"
      :entity-labels="entityLabels"
      :grapheme-mode="graphemeMode"
      :relations="relations"
      :relation-labels="relationLabels"
      :traits="traits"
      :trait-labels="traitLabels"
      :rtl="rtl"
      :selected-entities="selectedEntities"
      @add:entity="addEntity"
      @click:entity="updateEntity"
      @click:relation="updateRelation"
      @click:trait="updateTrait"
      @contextmenu:entity="deleteEntity"
      @contextmenu:relation="deleteRelation"
      @contextmenu:trait="deleteTrait"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VAnnotator from "./components/VAnnotator.vue";
import { Entity } from "./domain/models/Label/Entity";
import { Relation } from "./domain/models/Label/Relation";
import { Trait } from "./domain/models/Label/Trait";

export default Vue.extend({
  name: "App",

  components: {
    VAnnotator,
  },

  data() {
    return {
      allowOverlapping: false,
      graphemeMode: false,
      id: 100,
      // text: "من ويكيبيديا، الموسوعة الحرة\nداستان SVG Tiny 1.2 طولا ني است.",
      // rtl: true,
      // text: "👶🏻👦🏻👧🏻👨🏻👩🏻👱🏻‍♀️👱🏻👴🏻👵🏻👲🏻👳🏻‍♀️👳🏻👮🏻‍♀️👮🏻👷🏻‍♀️👷🏻💂🏻‍♀️💂🏻🕵🏻‍♀️👩🏻‍⚕️👨🏻‍⚕️👩🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾"
      rtl: false,
      text: "we must respect the will of the individual. Take it easy I can assure you that everything will turn out to be fine.\nThe president Obama.".repeat(
        1 //0000
      ),
      entities: [
        {
          id: 0,
          user: 0,
          label: 0,
          startOffset: 3,
          endOffset: 7,
          state: "auto",
        },
        {
          id: 4,
          user: 0,
          label: 0,
          startOffset: 35,
          endOffset: 46,
          state: "modified",
        },
        {
          id: 1,
          user: 0,
          label: 1,
          startOffset: 59,
          endOffset: 62,
          state: "added",
        },
        {
          id: 6,
          user: 0,
          label: 1,
          startOffset: 63,
          endOffset: 69,
          state: "added",
        },
        {
          id: 7,
          user: 0,
          label: 1,
          startOffset: 70,
          endOffset: 73,
          state: "auto",
        },
        {
          id: 2,
          user: 0,
          label: 0,
          startOffset: 79,
          endOffset: 89,
          state: "auto",
        },
        {
          id: 3,
          user: 0,
          label: 1,
          startOffset: 79,
          endOffset: 94,
          state: "auto",
        },
        {
          id: 5,
          user: 0,
          label: 1,
          startOffset: 130,
          endOffset: 135,
          state: "removed",
        },
      ],
      relations: [
        {
          id: 0,
          fromId: 4,
          toId: 0,
          labelId: 0,
          state: "added",
        },
        {
          id: 1,
          fromId: 4,
          toId: 2,
          labelId: 0,
          state: "removed",
        },
        {
          id: 2,
          fromId: 4,
          toId: 3,
          labelId: 0,
          state: "modified",
        },
      ],
      traits: [
        {
          id: 4,
          type: 1,
          entityId: 2,
          state: "auto",
        },
        {
          id: 0,
          type: 1,
          entityId: 0,
          state: "auto",
        },
        {
          id: 1,
          type: 1,
          entityId: 0,
          state: "auto",
        },
        {
          id: 2,
          type: 1,
          entityId: 5,
          state: "removed",
        },
        {
          id: 3,
          type: 1,
          entityId: 2,
          state: "auto",
        },
        {
          id: 5,
          type: 1,
          entityId: 6,
          state: "added",
        },
      ],
      entityLabels: [
        {
          id: 0,
          text: "VeryLongLabelWithManyCharacters",
          color: "#2196F3",
        },
        {
          id: 1,
          text: "Ipsum",
          color: "#F9A825",
        },
      ],
      relationLabels: [
        {
          id: 0,
          text: "superLongRelationLabel",
          color: "#ffffff",
        },
        {
          id: 1,
          text: "isLivedIn",
          color: "#ffffff",
        },
      ],
      traitLabels: [
        {
          id: 0,
          text: "negation",
        },
        {
          id: 1,
          text: "direction",
        },
      ],
    };
  },

  created() {
    // for (let i = 0; i < 10000; i++) {
    //   this.addEntity(i * 10 + 100, i * 10 + 105);
    // }
  },

  computed: {
    selectedEntities(): any[] {
      return [this.entities[0], this.entities[1]];
    },
  },

  methods: {
    addEntity(event: Event, startOffset: number, endOffset: number) {
      this.entities.push({
        id: this.id,
        startOffset,
        endOffset,
        label: 0,
        user: 0,
        state: "added",
      });
      this.id++;
    },
    updateEntity(event: Event, id: number) {
      const entity = this.entities.find((e) => e.id === id);
      console.log(JSON.stringify(entity));
      console.log(event);
    },
    deleteEntity(entity: Entity) {
      this.entities = this.entities.filter((e) => e.id !== entity.id);
      this.relations.forEach((r) => {
        if (r.fromId === entity.id || r.toId === entity.id) {
          this.deleteRelation(r);
        }
      });
      this.traits.forEach((t) => {
        if (t.entityId === entity.id) {
          this.deleteTrait(t);
        }
      });
    },
    changeText() {
      this.text = "The president Obama came to Japan.";
      this.resetEntity();
    },
    resetEntity() {
      this.entities = [];
      this.resetRelation();
    },
    changeLabel() {
      this.entityLabels[0].color = "#FF5733";
      this.entityLabels[0].text = "Misc";
    },
    addRelation() {
      this.relations.push({
        id: 1,
        fromId: 1,
        toId: 2,
        labelId: 1,
        state: "added",
      });
    },
    addTrait() {
      this.traits.push({
        id: 4,
        type: 1,
        entityId: 6,
        state: "added",
      });
    },
    updateRelation(event: Event, relation: Relation) {
      console.log(relation);
      console.log(event);
    },
    updateTrait(event: Event, trait: Trait) {
      console.log(trait);
      console.log(event);
    },
    deleteRelation(relation: Relation) {
      this.relations = this.relations.filter((r) => r.id !== relation.id);
    },
    deleteTrait(trait: Trait) {
      this.traits = this.traits.filter((t) => t.id !== trait.id);
    },
    resetRelation() {
      this.relations = [];
    },
  },
});
</script>
