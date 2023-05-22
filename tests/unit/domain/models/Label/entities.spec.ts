import { Entity } from "@/domain/models/Label/Entity";
import { Entities } from "@/domain/models/Label/Entity";

describe("Entities", () => {
  it("can be filtered by range", () => {
    const content = "example text";
    const entities = new Entities([
      new Entity(0, 0, 0, content.length, "added"),
      new Entity(0, 0, 0, content.length + 1, "added"),
      new Entity(0, 0, content.length, content.length + 1, "added"),
    ]);
    const expected = [
      new Entity(0, 0, 0, content.length, "added"),
      new Entity(0, 0, 0, content.length + 1, "added"),
    ];
    const actual = entities.filterByRange(0, content.length);
    expect(actual).toEqual(expected);
  });

  it("can filter by range", () => {
    const entities = new Entities([new Entity(0, 0, 1, 5, "added")]);
    expect(entities.filterByRange(0, 1).length == 0).toBeTruthy();
    expect(entities.filterByRange(1, 5).length == 0).toBeFalsy();
    expect(entities.filterByRange(1, 6).length == 0).toBeFalsy();
    expect(entities.filterByRange(4, 6).length == 0).toBeFalsy();
    expect(entities.filterByRange(5, 6).length == 0).toBeTruthy();
  });

  it("return empty list by filtering", () => {
    const entities = new Entities([]);
    expect(entities.filterByRange(0, 1)).toEqual([]);
  });

  it("can get size", () => {
    const entities = new Entities([new Entity(0, 0, 0, 0, "added")]);
    expect(entities.size).toEqual(1);
  });

  it("find by id", () => {
    const entity = new Entity(1, 0, 0, 0, "added");
    const entities = new Entities([entity]);
    expect(entities.findById(1)).toEqual(entity);
    expect(entities.findById(0)).toBeUndefined();
  });

  it("intersect any", () => {
    const entities = new Entities([new Entity(0, 0, 1, 5, "added")]);
    expect(entities.intersectAny(0, 1)).toBeFalsy();
    expect(entities.intersectAny(0, 2)).toBeTruthy();
    expect(entities.intersectAny(4, 6)).toBeTruthy();
    expect(entities.intersectAny(5, 6)).toBeFalsy();
    expect(entities.intersectAny(1, 5)).toBeTruthy();
  });
});
