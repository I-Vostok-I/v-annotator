import { Entity, Entities } from "@/domain/models/Label/Entity";
import { RelationListItem, RelationList } from "@/domain/models/Label/Relation";

describe("Entity component", () => {
  it("start offset", () => {
    const fromEntity = new Entity(0, 0, 1, 2, "added");
    const toEntity = new Entity(1, 0, 3, 4, "added");
    const relation = new RelationListItem(0, 0, fromEntity, toEntity, "added");
    expect(relation.startOffset).toEqual(1);
  });

  it("end offset", () => {
    const fromEntity = new Entity(0, 0, 1, 2, "added");
    const toEntity = new Entity(1, 0, 3, 4, "added");
    const relation = new RelationListItem(0, 0, fromEntity, toEntity, "added");
    expect(relation.endOffset).toEqual(4);
  });

  it("check consistOf", () => {
    const fromEntity = new Entity(0, 0, 0, 0, "added");
    const toEntity = new Entity(1, 0, 0, 0, "added");
    const entity = new Entity(2, 0, 0, 0, "added");
    const relation = new RelationListItem(0, 0, fromEntity, toEntity, "added");

    expect(relation.consistOf(fromEntity)).toBeTruthy();
    expect(relation.consistOf(toEntity)).toBeTruthy();
    expect(relation.consistOf(entity)).toBeFalsy();
  });

  it("is open on left to be truthy", () => {
    const fromEntity = new Entity(0, 0, 10, 20, "added");
    const toEntity = new Entity(1, 0, 20, 30, "added");
    const relations = [
      new RelationListItem(0, 0, fromEntity, toEntity, "added"),
      new RelationListItem(0, 0, toEntity, fromEntity, "added"),
    ];
    for (const relation of relations) {
      expect(relation.isOpenOnLeft(9)).toBeFalsy();
      expect(relation.isOpenOnLeft(10)).toBeFalsy();
      expect(relation.isOpenOnLeft(11)).toBeTruthy();
    }
  });

  it("is open on left to be truthy", () => {
    const fromEntity = new Entity(0, 0, 0, 0, "added");
    const toEntity = new Entity(1, 0, 10, 20, "added");
    const relations = [
      new RelationListItem(0, 0, fromEntity, toEntity, "added"),
      new RelationListItem(0, 0, toEntity, fromEntity, "added"),
    ];
    for (const relation of relations) {
      expect(relation.isOpenOnRight(9)).toBeTruthy();
      expect(relation.isOpenOnRight(10)).toBeTruthy();
      expect(relation.isOpenOnRight(11)).toBeFalsy();
    }
  });

  it("is visible", () => {
    const fromEntity = new Entity(0, 0, 10, 20, "added");
    const toEntity = new Entity(1, 0, 25, 30, "added");
    const relations = [
      new RelationListItem(0, 0, fromEntity, toEntity, "added"),
      new RelationListItem(0, 0, toEntity, fromEntity, "added"),
    ];
    for (const relation of relations) {
      expect(relation.isVisible(30)).toBeFalsy();
      expect(relation.isVisible(29)).toBeFalsy();
      expect(relation.isVisible(26)).toBeFalsy();
      expect(relation.isVisible(25)).toBeTruthy();
    }
  });

  it("check length", () => {
    const fromEntity = new Entity(0, 0, 1, 1, "added");
    const toEntity = new Entity(1, 0, 3, 3, "added");
    const relation = new RelationListItem(0, 0, fromEntity, toEntity, "added");
    expect(relation.width).toEqual(2);
  });
});

describe("RelationList", () => {
  const entities = new Entities([
    new Entity(0, 0, 5, 10, "added"),
    new Entity(1, 0, 20, 30, "added"),
  ]);
  const relations = [{ id: 0, labelId: 0, fromId: 0, toId: 1, state: "added" }];
  const relationList = new RelationList(relations, entities);

  it("can filter by range", () => {
    expect(relationList.filterByRange(0, 5).length).toBe(0);
    expect(relationList.filterByRange(0, 6).length).toBe(1);
    expect(relationList.filterByRange(30, 31).length).toBe(0);
    expect(relationList.filterByRange(29, 31).length).toBe(1);
    expect(relationList.filterByRange(5, 30).length).toBe(1);
  });

  it("return empty list by filtering", () => {
    expect(relationList.filterByRange(100, 101)).toEqual([]);
  });
});
