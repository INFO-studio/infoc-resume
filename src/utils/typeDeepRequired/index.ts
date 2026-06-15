export type DeepRequired<T> = T extends (...args: unknown[]) => unknown
  ? T
  : T extends
        | Promise<unknown>
        | Iterable<unknown>
        | null
        | undefined
        | boolean
        | string
        | number
        | bigint
        | symbol
    ? T
    : T extends object
      ? { [P in keyof T]-?: DeepRequired<T[P]> }
      : T;
