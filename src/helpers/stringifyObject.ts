export function stringifyTopLevel<T extends Record<string, any>>(
  obj: T
): Record<keyof T, string> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return [key, JSON.stringify(value)];
      }
      return [key, String(value)];
    })
  ) as Record<keyof T, string>;
}
