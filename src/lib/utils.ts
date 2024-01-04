import type { APIContext, APIRoute } from 'astro'
import { flatten, type Issues } from 'valibot'

export const getValiErrors = (issues: Issues) => {
  const errors = flatten(issues).nested

  return Object.keys(errors).reduce((acc, curr) => {
    return { ...acc, [curr]: errors[curr]?.at(-1) }
  }, {})
}

export const createActions = (actions: Record<string, APIRoute>) => {
  return async (context: APIContext) => {
    const searchParams = [...context.url.searchParams.keys()]
    const actionname = searchParams[0] ?? 'default'

    const action = actions[actionname]
    if (!action) throw new Error('no action found')

    return await action(context)
  }
}
