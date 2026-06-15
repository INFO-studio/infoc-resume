import type { DeepRequired } from '@/utils';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Object.prototype.toString.call(value) === '[object Object]';

const mergeDefault = <T extends Record<string, unknown>>(
  input: T,
  defaults: DeepRequired<T>,
): DeepRequired<T> => {
  const result: Record<string, unknown> = { ...defaults };

  for (const key of Object.keys(defaults)) {
    const defaultValue = (defaults as Record<string, unknown>)[key];
    const inputValue = (input as Record<string, unknown>)[key];

    if (inputValue === undefined || inputValue === null) {
      if (isPlainObject(defaultValue)) {
        result[key] = { ...defaultValue };
      } else if (Array.isArray(defaultValue)) {
        result[key] = [...defaultValue];
      }
      continue;
    }

    if (isPlainObject(defaultValue) && isPlainObject(inputValue)) {
      result[key] = mergeDefault(inputValue, defaultValue as DeepRequired<typeof inputValue>);
      continue;
    }

    result[key] = inputValue;
  }

  return result as DeepRequired<T>;
};

export default mergeDefault;
