import { Entity, Entities } from "./Entity";
import { Identifiable } from "./Identifiable";
import IntervalTree from "@flatten-js/interval-tree";

export interface Trait {
  id: number;
  type: number;
  entityId: number;
}

export class TraitListItem implements Identifiable {
  constructor(
    readonly id: number,
    readonly type: number,
    readonly entity: Entity
  ) {}

  /**
   * Return true if the trait offset has some overlapping.
   * @param {number} startOffset - offset of something(maybe entity or relation)
   * @param {number} endOffset - offset of something(maybe entity or relation)
   * @returns {boolean} - true if there is an overlapping, otherwise false.
   */
  isIn(startOffset: number, endOffset: number): boolean {
    return (
      (startOffset <= this.startOffset && this.startOffset < endOffset) ||
      (startOffset < this.endOffset && this.endOffset <= endOffset) ||
      (this.startOffset < startOffset && endOffset < this.endOffset)
    );
  }

  /**
   * Return true if entity is a part of the trait.
   * @param {Entity} checkEntity - an entity.
   * @returns {boolean} - true if the entity is a part of the trait, otherwise false.
   */
  consistOf(checkEntity: Entity): boolean {
    return this.entity.equalTo(checkEntity);
  }

  /**
   * Return start offset of the trait.
   * The value is the start offset of the entity.
   * @returns {number} - the start offset.
   */
  get startOffset(): number {
    return this.entity.startOffset;
  }

  /**
   * Return end offset of the relation.
   * The value is a bigger value of the two entities.
   * @returns {number} - the end offset.
   */
  get endOffset(): number {
    return this.entity.endOffset;
  }

  /**
   * Return width of the trait's entity.
   * @returns {number} - the width between each entity.
   */
  get width(): number {
    return Math.abs(this.entity.startOffset - this.entity.endOffset);
  }
}

export class TraitList {
  private tree: IntervalTree<TraitListItem> = new IntervalTree();

  constructor(traits: Trait[], entities: Entities) {
    for (const trait of traits) {
      const newEntity = entities.findById(trait.entityId)!;
      const item = new TraitListItem(trait.id, trait.type, newEntity);
      this.tree.insert([item.startOffset, item.endOffset], item);
    }
  }

  /**
   * Filter triats by the provided start/end offsets.
   * @param {number} startOffset - the start offset.
   * @param {number} endOffset - the end offset.
   * @returns {TraitListItem[]} - An array with the filtered traits.
   */
  filterByRange(startOffset: number, endOffset: number): TraitListItem[] {
    return this.tree
      .search([startOffset, endOffset])
      .filter((trait: TraitListItem) => trait.isIn(startOffset, endOffset));
  }
}
