export {}

declare global {
  /**
   * Now declare things that go in the global namespace,
   * or augment existing declarations in the global namespace.
   */
  type FetchResponse<T> = {
    success: true
    data: T
    errors:null
  } | {
    success: false
    data: null
    errors: Record<string, string[]>
  }
}
