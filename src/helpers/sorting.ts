import { MythologyEntity, MythologyGetSortEnum } from "../clients";

/**
 * Sorts array of entities in chosen direction
 * @param {MythologyEntity[]} arr - array of entities to sort
 * @param {MythologyGetSortEnum} dir - direction of sorting
 * @returns {MythologyEntity[]} sorted array of entities
 */
export function sorting(
  arr: MythologyEntity[],
  dir: MythologyGetSortEnum
): MythologyEntity[] {
  let mySortedTable: MythologyEntity[];
  mySortedTable =
    dir === "asc"
      ? arr.sort((ent1, ent2) => ent1["name"].localeCompare(ent2["name"]))
      : arr.sort((ent1, ent2) => ent2["name"].localeCompare(ent1["name"]));

  return mySortedTable;
}
