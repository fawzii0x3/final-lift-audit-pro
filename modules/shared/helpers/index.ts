export function ensureArray<T>(array: T[] | null | undefined): T[] {
  if (!array) {
    return [];
  }
  return array;
}
