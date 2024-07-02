export const resolveKey = (
  className: string,
  functionName: string,
  args: any[],
) => {
  let keys: any[] = [className, functionName];
  const argsOrdered = args.map((arg) => {
    if (arg instanceof Object) {
      const argSorted = {};
      Object.keys(arg)
        .sort((a, b) => a.localeCompare(b))
        .forEach(function (key) {
          argSorted[key] = arg[key];
        });
      return argSorted;
    }
    return arg;
  });

  keys = keys.concat(argsOrdered);

  return JSON.stringify(keys);
};

export const isOkForCache = (result): boolean => {
  return !(
    !result ||
    typeof result === 'undefined' ||
    (Array.isArray(result) && result.length === 0) ||
    (typeof result === 'object' && Object.keys(result).length) === 0
  );
};
