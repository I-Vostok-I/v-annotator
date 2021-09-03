import _ from "lodash";

import { Entity, Entities } from "../Label/Entity";
import { TextLine } from "./TextLine";
import { BaseLineSplitter } from "./TextLineSplitter";

export interface EntityObserverHint {
  entity: Entity;
  mode: "delete" | "update" | "add";
}

export interface EntityObserver {
  update(entities: Entities, hint: EntityObserverHint): void;
}

export class TextLines implements EntityObserver {
  private lines: TextLine[] = [];
  constructor(private text: string = "", private splitter: BaseLineSplitter) {}

  updateText(text: string): void {
    this.text = text;
  }

  updateSplitter(splitter: BaseLineSplitter): void {
    this.splitter = splitter;
  }

  update(entities: Entities, hint?: EntityObserverHint): void {
    const updatedLines = [];
    const startOffset = hint ? this.findByEntity(hint.entity) : 0;
    const lines = this.splitter.split(this.text, startOffset, entities);
    for (const line of lines) {
      if (this.meetStopCriteria(line)) {
        break;
      }
      updatedLines.push(line);
    }
    if (updatedLines.length > 0) {
      this.replaceLines(updatedLines);
    }
  }

  list(): TextLine[] {
    return this.lines;
  }

  private findByEntity(entity: Entity): number {
    const i = _.sortedIndexBy(this.lines, entity, "startOffset");
    if (i === 0) {
      return 0;
    } else if (i === this.lines.length) {
      return this.lines[this.lines.length - 1].startOffset;
    }

    if (this.lines[i].startOffset === entity.startOffset) {
      return this.lines[i].startOffset;
    } else {
      return this.lines[i - 1].startOffset;
    }
  }

  private meetStopCriteria(line: TextLine): boolean {
    if (this.lines.length === 0) {
      return false;
    }
    const i = _.sortedIndexBy(this.lines, line, "startOffset");
    return this.lines[i].equal(line);
  }

  private replaceLines(lines: TextLine[]): void {
    const startOffset = lines[0].startOffset;
    const endOffset = lines[lines.length - 1].endOffset;
    const l = _.sortedIndexBy(this.lines, { startOffset }, "startOffset");
    const r = _.sortedIndexBy(this.lines, { endOffset }, "endOffset");
    this.lines.splice(l, r - l + 1, ...lines);
  }
}