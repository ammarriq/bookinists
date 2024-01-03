export {}

declare global {
  /**
   * Now declare things that go in the global namespace,
   * or augment existing declarations in the global namespace.
   */
  type FetchResponse<T> = {
    data: T
    success: boolean
    errors: Record<string, string[]>
  }
}
