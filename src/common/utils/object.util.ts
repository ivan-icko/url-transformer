/**
 * Creates object clone from target and overrides/copies properties that are passed in source object
 * @param target
 * @param source
 */
export const clone = <T, R extends T>(target: T, source: R): object => {
  const cloneObject = Object.assign({}, target) || {};

  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object) {
      cloneObject[key] = clone(cloneObject[key] ?? {}, source[key]);
    } else {
      cloneObject[key] = source[key];
    }
  }

  return cloneObject;
};
