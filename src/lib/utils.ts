import type { Issues } from 'valibot'

export const getValiErrors = (issues: Issues) => {
  const errors = flatten(issues).nested

  return Object.keys(errors).reduce((acc, curr) => {
    return { ...acc, [curr]: errors.at(-1) }
  }, {})
}
