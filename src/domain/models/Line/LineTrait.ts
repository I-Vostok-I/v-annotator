import { LevelManager } from "./LevelManager";
import { TraitListItem } from "../Label/Trait";
import { LabelList } from "../Label/Label";
import { GeometricEntity } from "./LineEntity";

export interface LineTrait {
  offset: number;
  level: number;
  label: string;
  labelWidth: number;
  trait: TraitListItem;
}

export class TraitLine {
  private levelManager = new LevelManager();
  constructor(
    private traits: TraitListItem[],
    private traitLabels: LabelList
  ) {}

  render(entities: GeometricEntity[]): LineTrait[] {
    const lineTrait: LineTrait[] = [];
    this.levelManager.clear();
    const entityMap: Map<number, GeometricEntity> = new Map();
    entities.forEach((entity) => {
      entityMap.set(entity.entity.id, entity);
    });
    this.traits.sort((r1, r2) => r1.width - r2.width);
    for (const trait of this.traits) {
      const label = this.traitLabels.getById(trait.type);
      const boundEntity = entityMap.get(trait.entity.id);
      let offset = 0;
      if (boundEntity) {
        offset = boundEntity.center;
      }
      const half = label!.truncatedWidth / 2;
      this.levelManager.update(trait, [[offset - half, offset + half]]);
      const level = this.levelManager.fetchLevel(trait)!;
      lineTrait.push({
        offset: offset,
        level: level,
        label: label!.truncatedText,
        labelWidth: label!.truncatedWidth,
        trait: trait,
      });
    }
    return lineTrait;
  }
}
