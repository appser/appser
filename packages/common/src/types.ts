export type ValuesType<T extends ReadonlyArray<any> | ArrayLike<any> | Record<any, any>> = T extends ReadonlyArray<any>
  ? T[number]
  : T extends ArrayLike<any>
    ? T[number]
    : T extends object
      ? T[keyof T]
      : never

export type Optional<T extends object, K extends keyof T = keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type SetDifference<A, B> = A extends B ? never : A

export type Diff<T extends object, U extends object> = Pick<T, SetDifference<keyof T, keyof U>>

export type Intersection<T extends object, U extends object> = Pick<
  T,
  Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
>

export type Overwrite<T extends object, U extends object, I = Diff<T, U> & Intersection<U, T>> = Pick<I, keyof I>

export type AugmentedRequired<T extends object, K extends keyof T = keyof T> = Omit<T, K> & Required<Pick<T, K>>

export type OnlyRequired<T extends object, K extends keyof T = keyof T> = AugmentedRequired<Partial<T>, K>

export type PromiseType<T> = T extends Promise<infer U> ? U : never

export type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
    ? _DeepPartialArray<U>
    : T extends object
      ? _DeepPartialObject<T>
      : T | undefined

/** @private */
interface _DeepPartialArray<T> extends Array<DeepPartial<T>> {}

/** @private */
type _DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> }
