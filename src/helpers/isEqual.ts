import { MythologyEntity } from '../clients';

/**
 * @param {MythologyEntity[]} arr1 - array of entities
 * @param {MythologyEntity[]} arr2 - array of entities
 * @returns {boolean} result "Is equal?"
 */
export function isEqualByNames(
  arr1: MythologyEntity[],
  arr2: MythologyEntity[]
): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((entity, i) => entity.name === arr2[i].name);
}
