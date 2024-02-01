export {}

declare global {
  /**
   * Now declare things that go in the global namespace,
   * or augment existing declarations in the global namespace.
   */
  type FetchResponse<T> =
    | {
        success: true
        data: T
        errors: null
      }
    | {
        success: false
        data: null
        errors: Record<string, string[]>
      }

  // type SwapType<Object extends object, Keys extends keyof Object, Type> = {
  //   [Key in keyof Object]: Key extends Keys ? Type : Object[Key]
  // }
  type SwapType<
    Object extends object,
    FromType extends Object[keyof Object],
    ToType
  > = {
    [Key in keyof Object]: Object[Key] extends FromType ? ToType : Object[Key]
  }

  type ToKeyType<Object extends object, Keys extends keyof Object, ToType> = {
    [Key in keyof Object]: Key extends Keys
      ? Exclude<Object[Key], undefined> | ToType
      : Object[Key]
  }

  type Require<Object extends object, Keys extends keyof Object> = Required<
    Pick<Object, Keys>
  > &
    Omit<Object, Keys>
}
